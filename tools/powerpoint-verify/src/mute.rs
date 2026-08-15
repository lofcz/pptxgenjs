//! Mute PowerPoint and the Windows System Sounds session for the sidecar lifetime.
//! Repair / MessageBox dings are PlaySound aliases on the system-sounds session,
//! which still reach the physical device from a hidden desktop.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{mpsc, Arc, Mutex};
use std::thread::JoinHandle;
use std::time::Duration;

use windows::core::{Interface, Result};
use windows::Win32::Media::Audio::{
	eConsole, eRender, IAudioSessionControl, IAudioSessionControl2, IAudioSessionEnumerator,
	IAudioSessionManager2, IMMDeviceEnumerator, ISimpleAudioVolume, MMDeviceEnumerator,
};
use windows::Win32::System::Com::{
	CoCreateInstance, CoInitializeEx, CoUninitialize, CLSCTX_ALL, COINIT_MULTITHREADED,
};

pub struct AudioMute {
	stop: Arc<AtomicBool>,
	pids: Arc<Mutex<Vec<u32>>>,
	thread: Option<JoinHandle<()>>,
}

impl AudioMute {
	pub fn start() -> Self {
		let stop = Arc::new(AtomicBool::new(false));
		let pids = Arc::new(Mutex::new(Vec::new()));
		let (ready_tx, ready_rx) = mpsc::channel();
		let stop_t = stop.clone();
		let pids_t = pids.clone();
		let thread = std::thread::spawn(move || {
			if let Err(err) = mute_loop(stop_t, pids_t, ready_tx) {
				eprintln!("powerpoint-verify: audio mute: {err}");
			}
		});
		if ready_rx.recv_timeout(Duration::from_secs(2)).is_err() {
			eprintln!("powerpoint-verify: audio mute did not attach within 2s");
		}
		Self { stop, pids, thread: Some(thread) }
	}

	pub fn track_pids(&self, pids: impl IntoIterator<Item = u32>) {
		if let Ok(mut slot) = self.pids.lock() {
			for pid in pids {
				if pid != 0 && !slot.contains(&pid) {
					slot.push(pid);
				}
			}
		}
	}
}

impl Drop for AudioMute {
	fn drop(&mut self) {
		self.stop.store(true, Ordering::Relaxed);
		if let Some(thread) = self.thread.take() {
			let _ = thread.join();
		}
	}
}

fn mute_loop(stop: Arc<AtomicBool>, pids: Arc<Mutex<Vec<u32>>>, ready: mpsc::Sender<()>) -> Result<()> {
	struct Ready(Option<mpsc::Sender<()>>);
	impl Drop for Ready {
		fn drop(&mut self) {
			if let Some(tx) = self.0.take() {
				let _ = tx.send(());
			}
		}
	}
	let ready = Ready(Some(ready));

	unsafe { CoInitializeEx(None, COINIT_MULTITHREADED).ok()? };
	let enumerator: IMMDeviceEnumerator = unsafe { CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL)? };
	let device = unsafe { enumerator.GetDefaultAudioEndpoint(eRender, eConsole)? };
	let manager: IAudioSessionManager2 = unsafe { device.Activate(CLSCTX_ALL, None)? };

	let mut system_was_muted: Option<bool> = None;
	if let Ok(prior) = apply_mutes(&manager, &[]) {
		system_was_muted = prior;
	}
	drop(ready);
	while !stop.load(Ordering::Relaxed) {
		let tracked = pids.lock().map(|g| g.clone()).unwrap_or_default();
		if let Ok(prior) = apply_mutes(&manager, &tracked) {
			if system_was_muted.is_none() {
				system_was_muted = prior;
			}
		}
		std::thread::sleep(Duration::from_millis(15));
	}

	if system_was_muted == Some(false) {
		let _ = set_system_sounds_mute(&manager, false);
	}
	unsafe { CoUninitialize() };
	Ok(())
}

fn apply_mutes(manager: &IAudioSessionManager2, pids: &[u32]) -> Result<Option<bool>> {
	let sessions: IAudioSessionEnumerator = unsafe { manager.GetSessionEnumerator()? };
	let count = unsafe { sessions.GetCount()? };
	let mut system_was_muted = None;
	for i in 0..count {
		let control: IAudioSessionControl = unsafe { sessions.GetSession(i)? };
		let Ok(control2) = control.cast::<IAudioSessionControl2>() else { continue };
		let Ok(volume) = control.cast::<ISimpleAudioVolume>() else { continue };
		let is_system = unsafe { control2.IsSystemSoundsSession() }.0 == 0;
		let session_pid = unsafe { control2.GetProcessId() }.unwrap_or(0);
		if is_system {
			let already = session_muted(&volume);
			if system_was_muted.is_none() {
				system_was_muted = Some(already);
			}
			if !already {
				let _ = unsafe { volume.SetMute(true, std::ptr::null()) };
			}
		} else if pids.contains(&session_pid) && !session_muted(&volume) {
			let _ = unsafe { volume.SetMute(true, std::ptr::null()) };
		}
	}
	Ok(system_was_muted)
}

fn set_system_sounds_mute(manager: &IAudioSessionManager2, mute: bool) -> Result<()> {
	let sessions: IAudioSessionEnumerator = unsafe { manager.GetSessionEnumerator()? };
	let count = unsafe { sessions.GetCount()? };
	for i in 0..count {
		let control: IAudioSessionControl = unsafe { sessions.GetSession(i)? };
		let Ok(control2) = control.cast::<IAudioSessionControl2>() else { continue };
		if unsafe { control2.IsSystemSoundsSession() }.0 != 0 {
			continue;
		}
		let Ok(volume) = control.cast::<ISimpleAudioVolume>() else { continue };
		unsafe { volume.SetMute(mute, std::ptr::null())? };
	}
	Ok(())
}

fn session_muted(volume: &ISimpleAudioVolume) -> bool {
	unsafe { volume.GetMute() }.map(|flag| flag.as_bool()).unwrap_or(false)
}
