mod diff;
mod dispatch;
mod isolate;
mod watch;

use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{mpsc, Arc, Mutex};
use std::time::{Duration, Instant};

use serde::Serialize;
use windows::core::{Result as WinResult, GUID};
use windows::Win32::System::Com::{
	CoCreateInstance, CoInitializeEx, CoUninitialize, CLSCTX_LOCAL_SERVER, COINIT_APARTMENTTHREADED,
	IDispatch,
};

use crate::diff::{compact_dialog, diff_pptx, PackageDiff};
use crate::dispatch::{as_dispatch, as_i32, as_string, method, prop_get, prop_put, vt_bool, vt_bstr, vt_i4};
use crate::isolate::Isolation;
use crate::watch::{watch_dialogs, DialogHit};

/// PowerPoint.Application
const PPT_CLSID: GUID = GUID::from_u128(0x9149_3441_5A91_11CF_8700_00AA_0060_263B);

#[derive(Serialize)]
struct FileResult {
	file: String,
	verdict: String,
	opened: bool,
	name: Option<String>,
	#[serde(rename = "fullName")]
	full_name: Option<String>,
	saved: Option<i32>,
	error: Option<String>,
	#[serde(rename = "dialogText")]
	dialog_text: Option<String>,
	#[serde(rename = "repairSummary")]
	repair_summary: Option<String>,
	followups: Vec<String>,
	#[serde(rename = "packageDiff")]
	package_diff: Option<PackageDiff>,
	clicked: Option<String>,
	signals: Vec<String>,
	ms: u128,
}

fn main() {
	if let Err(err) = run() {
		eprintln!("powerpoint-verify: {err}");
		std::process::exit(2);
	}
}

fn run() -> Result<(), Box<dyn std::error::Error>> {
	let (timeout, files) = parse_args()?;
	if files.is_empty() {
		return Err("pass one or more .pptx paths".into());
	}

	let (tx, rx) = mpsc::channel();
	std::thread::spawn(move || {
		let result = sta_session(files, timeout);
		let _ = tx.send(result);
	});
	let results = rx
		.recv_timeout(timeout * 3 + Duration::from_secs(20))
		.map_err(|err| err.to_string())?
		.map_err(|err| err.to_string())?;
	println!("{}", serde_json::to_string(&results)?);
	Ok(())
}

fn parse_args() -> Result<(Duration, Vec<PathBuf>), Box<dyn std::error::Error>> {
	let mut timeout = Duration::from_secs(25);
	let mut files = Vec::new();
	let mut args = std::env::args().skip(1);
	while let Some(arg) = args.next() {
		if arg == "--timeout-ms" {
			let ms: u64 = args.next().ok_or("--timeout-ms needs a value")?.parse()?;
			timeout = Duration::from_millis(ms);
		} else if arg.starts_with('-') {
			return Err(format!("unknown flag {arg}").into());
		} else {
			files.push(PathBuf::from(arg));
		}
	}
	Ok((timeout, files))
}

fn sta_session(files: Vec<PathBuf>, timeout: Duration) -> Result<Vec<FileResult>, Box<dyn std::error::Error + Send + Sync>> {
	let preexisting = toolhelp_pids("POWERPNT.EXE");
	if !preexisting.is_empty() {
		return Err("an interactive PowerPoint instance is already running — close it so the sidecar can own a hidden instance".into());
	}

	let mut isolation = Isolation::new().map_err(|err| format!("create hidden desktop: {err}"))?;
	// SetThreadDesktop must happen before CoInitialize — STA init creates a hidden window
	// that then makes the desktop switch return ERROR_BUSY.
	Isolation::bind_current_thread().map_err(|err| format!("bind hidden desktop: {err}"))?;
	unsafe { CoInitializeEx(None, COINIT_APARTMENTTHREADED).ok()? };

	let app: IDispatch = match unsafe { CoCreateInstance::<_, IDispatch>(&PPT_CLSID, None, CLSCTX_LOCAL_SERVER) } {
		Ok(app) => app,
		Err(err) => {
			unsafe { CoUninitialize() };
			return Err(format!("CoCreateInstance PowerPoint.Application: {err}").into());
		}
	};
	let _ = prop_put(&app, "Visible", vt_bool(true));
	let _ = prop_put(&app, "DisplayAlerts", vt_i4(2));
	let mut hwnd = 0i32;
	for _ in 0..25 {
		hwnd = prop_get(&app, "HWND").ok().and_then(|v| as_i32(&v)).unwrap_or(0);
		if hwnd != 0 {
			break;
		}
		std::thread::sleep(Duration::from_millis(100));
	}
	if hwnd != 0 {
		if let Err(err) = isolation.adopt_hwnd(hwnd as i64) {
			eprintln!("powerpoint-verify: adopt HWND {hwnd} skipped: {err}");
		}
	} else {
		eprintln!("powerpoint-verify: PowerPoint HWND is still 0; UIA will scan the hidden desktop");
	}
	std::thread::sleep(Duration::from_millis(400));
	let spawned: Vec<u32> = toolhelp_pids("POWERPNT.EXE")
		.into_iter()
		.filter(|pid| !preexisting.contains(pid))
		.collect();
	if isolation.pid == 0 {
		if let Some(&pid) = spawned.first() {
			isolation.pid = pid;
		}
	}
	eprintln!("powerpoint-verify: hidden desktop hwnd={hwnd} pid={} spawned={spawned:?}", isolation.pid);

	let mut results = Vec::new();
	let uia_pid = if hwnd == 0 { 0 } else { isolation.pid };
	for file in &files {
		results.push(verify_one(&app, uia_pid, &spawned, file, timeout));
	}

	let _ = method(&app, "Quit", Vec::new());
	drop(app);
	drop(isolation);
	unsafe { CoUninitialize() };
	let deadline = Instant::now() + Duration::from_secs(8);
	loop {
		let leftover: Vec<u32> = toolhelp_pids("POWERPNT.EXE")
			.into_iter()
			.filter(|pid| !preexisting.contains(pid))
			.collect();
		if leftover.is_empty() {
			break;
		}
		for pid in leftover {
			terminate_pid(pid);
		}
		if Instant::now() >= deadline {
			break;
		}
		std::thread::sleep(Duration::from_millis(150));
	}
	Ok(results)
}

fn toolhelp_pids(name: &str) -> Vec<u32> {
	use windows::Win32::Foundation::CloseHandle;
	use windows::Win32::System::Diagnostics::ToolHelp::{
		CreateToolhelp32Snapshot, Process32FirstW, Process32NextW, PROCESSENTRY32W, TH32CS_SNAPPROCESS,
	};
	let mut pids = Vec::new();
	unsafe {
		let Ok(snap) = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) else { return pids };
		let mut entry = PROCESSENTRY32W {
			dwSize: std::mem::size_of::<PROCESSENTRY32W>() as u32,
			..Default::default()
		};
		if Process32FirstW(snap, &mut entry).is_ok() {
			loop {
				let exe = String::from_utf16_lossy(entry.szExeFile.split(|c| *c == 0).next().unwrap_or(&[]));
				if exe.eq_ignore_ascii_case(name) {
					pids.push(entry.th32ProcessID);
				}
				if Process32NextW(snap, &mut entry).is_err() {
					break;
				}
			}
		}
		let _ = CloseHandle(snap);
	}
	pids
}

fn verify_one(app: &IDispatch, uia_pid: u32, spawned: &[u32], file: &PathBuf, timeout: Duration) -> FileResult {
	let abs = dunce_abs(file);
	let stop = Arc::new(AtomicBool::new(false));
	let hit: Arc<Mutex<Option<DialogHit>>> = Arc::new(Mutex::new(None));
	let watch_stop = stop.clone();
	let watch_hit = hit.clone();
	let watch_timeout = timeout;
	let watcher = std::thread::spawn(move || {
		unsafe {
			let _ = CoInitializeEx(None, COINIT_APARTMENTTHREADED);
		}
		let _ = Isolation::bind_current_thread();
		watch_dialogs(uia_pid, watch_timeout, watch_stop, watch_hit);
		unsafe { CoUninitialize() };
	});

	std::thread::sleep(Duration::from_millis(250));
	let started = Instant::now();
	let watchdog_stop = stop.clone();
	let watchdog_timeout = timeout + Duration::from_secs(3);
	let watchdog_pids: Vec<u32> = spawned.to_vec();
	std::thread::spawn(move || {
		let deadline = Instant::now() + watchdog_timeout;
		while Instant::now() < deadline {
			if watchdog_stop.load(Ordering::Relaxed) {
				return;
			}
			std::thread::sleep(Duration::from_millis(100));
		}
		if !watchdog_stop.load(Ordering::Relaxed) {
			for pid in watchdog_pids {
				terminate_pid(pid);
			}
		}
	});
	let opened = open_presentation(app, &abs);
	let dialog_after_open = hit.lock().ok().and_then(|g| g.clone());

	let mut signals = Vec::new();
	let mut opened_ok = false;
	let mut name = None;
	let mut full_name = None;
	let mut saved = None;
	let mut error = None;

	let mut package_diff = None;
	match opened {
		Ok(pres) => {
			opened_ok = true;
			name = prop_get(&pres, "Name").ok().and_then(|v| as_string(&v));
			full_name = prop_get(&pres, "FullName").ok().and_then(|v| as_string(&v));
			saved = prop_get(&pres, "Saved").ok().and_then(|v| as_i32(&v));
			if dialog_after_open.as_ref().is_some_and(|hit| hit.verdict == "repair") {
				package_diff = save_and_diff(&pres, &abs);
			}
			let _ = prop_put(&pres, "Saved", vt_bool(true));
			let _ = method(&pres, "Close", Vec::new());
		}
		Err(err) => error = Some(err.to_string()),
	}
	stop.store(true, Ordering::Relaxed);
	let _ = watcher.join();
	let dialog = hit.lock().ok().and_then(|g| g.clone()).or(dialog_after_open);

	if let Some(dialog) = &dialog {
		if dialog.verdict == "repair" {
			signals.push("repair-dialog".into());
		}
		if dialog.verdict == "reject" {
			signals.push("reject-dialog".into());
		}
	}
	if name.as_deref().is_some_and(|n| n.contains("[Repaired]") || n.contains("[Opraveno]") || n.contains("[Repariert]")) {
		signals.push("repaired-title".into());
	}
	if opened_ok && full_name.as_deref().is_some_and(|n| !paths_equal(n, &abs)) {
		signals.push("opened-as-copy".into());
	}
	if opened_ok && saved == Some(0) {
		signals.push("unsaved-after-open".into());
	}
	if package_diff.as_ref().is_some_and(|diff| !diff.changed.is_empty() || !diff.removed.is_empty() || !diff.added.is_empty()) {
		signals.push("package-diff".into());
	}
	if error.is_some() {
		signals.push("com-error".into());
	}
	let timed_out = error.as_deref().is_some_and(|text| text.contains("timed out"));
	if timed_out {
		signals.push("open-timeout".into());
	}

	let verdict = if signals.iter().any(|s| s == "repair-dialog" || s == "repaired-title") {
		"repair"
	} else if timed_out {
		"timeout"
	} else if signals.iter().any(|s| s == "reject-dialog") || !opened_ok {
		"reject"
	} else if signals.iter().any(|s| s == "opened-as-copy" || s == "unsaved-after-open") {
		"repair"
	} else {
		"ok"
	};

	FileResult {
		file: abs,
		verdict: verdict.into(),
		opened: opened_ok,
		name,
		full_name,
		saved,
		error,
		repair_summary: dialog.as_ref().map(|hit| compact_dialog(&hit.text)),
		followups: dialog.as_ref().map(|hit| hit.followups.iter().map(|text| compact_dialog(text)).collect()).unwrap_or_default(),
		dialog_text: dialog.as_ref().map(|hit| hit.text.clone()),
		package_diff,
		clicked: dialog.as_ref().and_then(|hit| hit.clicked.clone()),
		signals,
		ms: started.elapsed().as_millis(),
	}
}

fn open_presentation(app: &IDispatch, path: &str) -> WinResult<IDispatch> {
	let presentations = as_dispatch(&prop_get(app, "Presentations")?)?;
	let opened = method(
		&presentations,
		"Open",
		vec![vt_bstr(path), vt_i4(0), vt_i4(0), vt_i4(-1)],
	)?;
	as_dispatch(&opened)
}

/// ppSaveAsOpenXMLPresentation
const PP_SAVE_AS_OPEN_XML: i32 = 24;

fn save_and_diff(pres: &IDispatch, original: &str) -> Option<PackageDiff> {
	let repaired = std::env::temp_dir().join(format!(
		"pptx-repaired-{}-{}.pptx",
		std::process::id(),
		std::time::SystemTime::now()
			.duration_since(std::time::UNIX_EPOCH)
			.map(|d| d.as_millis())
			.unwrap_or(0)
	));
	let path = repaired.to_string_lossy().to_string();
	if method(pres, "SaveAs", vec![vt_bstr(&path), vt_i4(PP_SAVE_AS_OPEN_XML)]).is_err() {
		return None;
	}
	let diff = diff_pptx(std::path::Path::new(original), repaired.as_path()).ok();
	let _ = std::fs::remove_file(&repaired);
	diff
}

fn terminate_pid(pid: u32) {
	use windows::Win32::Foundation::CloseHandle;
	use windows::Win32::System::Threading::{OpenProcess, TerminateProcess, PROCESS_TERMINATE};
	unsafe {
		if let Ok(handle) = OpenProcess(PROCESS_TERMINATE, false, pid) {
			let _ = TerminateProcess(handle, 1);
			let _ = CloseHandle(handle);
		}
	}
}

fn dunce_abs(path: &PathBuf) -> String {
	std::fs::canonicalize(path)
		.unwrap_or_else(|_| path.clone())
		.to_string_lossy()
		.trim_start_matches(r"\\?\")
		.to_string()
}

fn paths_equal(a: &str, b: &str) -> bool {
	a.replace('/', "\\").eq_ignore_ascii_case(&b.replace('/', "\\"))
}

