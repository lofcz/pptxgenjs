use std::collections::HashSet;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use windows::core::Result;
use windows::Win32::System::Com::{CoCreateInstance, CLSCTX_INPROC_SERVER};
use windows::Win32::System::Variant::VARIANT;
use windows::Win32::UI::Accessibility::{
	CUIAutomation, IUIAutomation, IUIAutomationElement, IUIAutomationInvokePattern,
	TreeScope_Children, TreeScope_Descendants, UIA_InvokePatternId, UIA_NamePropertyId,
	UIA_ProcessIdPropertyId,
};

const REPAIR_TEXT: &[&str] = &[
	"found a problem with content",
	"attempt to repair",
	"click repair",
	"našel problém",
	"opravit prezentaci",
	"problem mit dem inhalt",
];
const REJECT_TEXT: &[&str] = &[
	"can't open",
	"cannot open",
	"unable to open",
	"isn't a valid",
	"is not a valid",
	"nelze otevřít",
	"nicht öffnen",
];
const REPAIR_BUTTONS: &[&str] = &["repair", "opravit", "reparieren", "réparer", "reparar"];
const CANCEL_BUTTONS: &[&str] = &["cancel", "storno", "abbrechen", "annuler", "cancelar"];
const OK_BUTTONS: &[&str] = &["ok"];

#[derive(Clone, Debug)]
pub struct DialogHit {
	pub verdict: &'static str,
	pub text: String,
	pub followups: Vec<String>,
	pub clicked: Option<String>,
}

pub fn watch_dialogs(pid: u32, timeout: Duration, stop: Arc<AtomicBool>, out: Arc<Mutex<Option<DialogHit>>>) {
	if let Err(err) = watch_inner(pid, timeout, stop, &out) {
		let mut slot = out.lock().expect("dialog slot");
		if slot.is_none() {
			*slot = Some(DialogHit {
				verdict: "error",
				text: format!("uia: {err}"),
				followups: Vec::new(),
				clicked: None,
			});
		}
	}
}

fn watch_inner(
	pid: u32,
	timeout: Duration,
	stop: Arc<AtomicBool>,
	out: &Arc<Mutex<Option<DialogHit>>>,
) -> Result<()> {
	let uia: IUIAutomation = unsafe { CoCreateInstance(&CUIAutomation, None, CLSCTX_INPROC_SERVER)? };
	let root = unsafe { uia.GetRootElement()? };
	let pid_var = VARIANT::from(pid as i32);
	let cond = if pid == 0 {
		unsafe { uia.CreateTrueCondition()? }
	} else {
		unsafe { uia.CreatePropertyCondition(UIA_ProcessIdPropertyId, &pid_var)? }
	};
	let deadline = Instant::now() + timeout;
	let mut seen = HashSet::new();

	while Instant::now() < deadline && !stop.load(Ordering::Relaxed) {
		let windows = unsafe { root.FindAll(TreeScope_Children, &cond)? };
		let count = unsafe { windows.Length()? };
		for i in 0..count {
			let window = unsafe { windows.GetElement(i)? };
			if let Some(found) = classify_window(&uia, &window)? {
				if !seen.insert(found.text.clone()) {
					// Same blob can linger after Repair while a follow-up OK is up.
					let _ = dismiss_dialog(&window, "followup");
					continue;
				}
				let clicked = dismiss_dialog(&window, found.verdict)?;
				let mut slot = out.lock().expect("dialog slot");
				if let Some(existing) = slot.as_mut() {
					existing.followups.push(found.text);
				} else {
					*slot = Some(DialogHit {
						clicked,
						followups: Vec::new(),
						..found
					});
				}
			}
		}
		std::thread::sleep(Duration::from_millis(120));
	}
	Ok(())
}

fn classify_window(uia: &IUIAutomation, window: &IUIAutomationElement) -> Result<Option<DialogHit>> {
	let names = descendant_names(uia, window)?;
	let blob = names.join(" | ");
	let lower = blob.to_lowercase();
	let has_repair_btn = names.iter().any(|n| REPAIR_BUTTONS.contains(&n.to_lowercase().as_str()));
	let is_repair = has_repair_btn || REPAIR_TEXT.iter().any(|needle| lower.contains(needle));
	let is_reject = !is_repair && REJECT_TEXT.iter().any(|needle| lower.contains(needle));
	if is_repair {
		Ok(Some(DialogHit {
			verdict: "repair",
			text: blob,
			followups: Vec::new(),
			clicked: None,
		}))
	} else if is_reject {
		Ok(Some(DialogHit {
			verdict: "reject",
			text: blob,
			followups: Vec::new(),
			clicked: None,
		}))
	} else {
		Ok(None)
	}
}

fn descendant_names(uia: &IUIAutomation, window: &IUIAutomationElement) -> Result<Vec<String>> {
	let true_cond = unsafe { uia.CreateTrueCondition()? };
	let all = unsafe { window.FindAll(TreeScope_Descendants, &true_cond)? };
	let count = unsafe { all.Length()? };
	let mut names = Vec::new();
	for i in 0..count {
		let el = unsafe { all.GetElement(i)? };
		if let Ok(name) = unsafe { el.CurrentName() } {
			let text = name.to_string();
			if !text.is_empty() {
				names.push(text);
			}
		}
	}
	if let Ok(name) = unsafe { window.CurrentName() } {
		let text = name.to_string();
		if !text.is_empty() {
			names.insert(0, text);
		}
	}
	Ok(names)
}

fn dismiss_dialog(window: &IUIAutomationElement, verdict: &str) -> Result<Option<String>> {
	let order: &[&[&str]] = if verdict == "repair" {
		&[REPAIR_BUTTONS, OK_BUTTONS, CANCEL_BUTTONS]
	} else {
		&[OK_BUTTONS, CANCEL_BUTTONS]
	};
	for group in order {
		if let Some(clicked) = invoke_named(window, group)? {
			return Ok(Some(clicked));
		}
	}
	Ok(None)
}

fn invoke_named(window: &IUIAutomationElement, names: &[&str]) -> Result<Option<String>> {
	let uia: IUIAutomation = unsafe { CoCreateInstance(&CUIAutomation, None, CLSCTX_INPROC_SERVER)? };
	let true_cond = unsafe { uia.CreateTrueCondition()? };
	let all = unsafe { window.FindAll(TreeScope_Descendants, &true_cond)? };
	let count = unsafe { all.Length()? };
	for i in 0..count {
		let el = unsafe { all.GetElement(i)? };
		let Ok(current) = (unsafe { el.CurrentName() }) else { continue };
		let text = current.to_string();
		if names.iter().any(|name| text.eq_ignore_ascii_case(name)) {
			if let Ok(pattern) = unsafe { el.GetCurrentPatternAs::<IUIAutomationInvokePattern>(UIA_InvokePatternId) } {
				unsafe { pattern.Invoke()? };
				return Ok(Some(text));
			}
		}
	}
	let _ = UIA_NamePropertyId;
	Ok(None)
}
