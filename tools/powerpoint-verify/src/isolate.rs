use windows::core::{w, Result, PCWSTR};
use windows::Win32::Foundation::{CloseHandle, HANDLE, HWND};
use windows::Win32::System::JobObjects::{
	AssignProcessToJobObject, CreateJobObjectW, JobObjectExtendedLimitInformation,
	SetInformationJobObject, JOBOBJECT_EXTENDED_LIMIT_INFORMATION, JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE,
};
use windows::Win32::System::StationsAndDesktops::{
	CloseDesktop, CreateDesktopW, OpenDesktopW, SetThreadDesktop, DESKTOP_CONTROL_FLAGS, HDESK,
};
use windows::Win32::System::Threading::{
	OpenProcess, PROCESS_QUERY_LIMITED_INFORMATION, PROCESS_SET_QUOTA, PROCESS_TERMINATE,
};
use windows::Win32::UI::WindowsAndMessaging::GetWindowThreadProcessId;

const DESKTOP_ACCESS: u32 = 0x01FF;

pub struct Isolation {
	desktop: HDESK,
	job: HANDLE,
	adopted: Option<HANDLE>,
	pub pid: u32,
}

impl Isolation {
	pub fn new() -> Result<Self> {
		unsafe {
			let desktop = match CreateDesktopW(
				w!("pptxgen-ppt-verify"),
				None,
				None,
				DESKTOP_CONTROL_FLAGS(0),
				DESKTOP_ACCESS,
				None,
			) {
				Ok(desktop) => desktop,
				Err(_) => OpenDesktopW(w!("pptxgen-ppt-verify"), DESKTOP_CONTROL_FLAGS(0), false, DESKTOP_ACCESS)?,
			};
			let job = CreateJobObjectW(None, PCWSTR::null())?;
			let mut limit = JOBOBJECT_EXTENDED_LIMIT_INFORMATION::default();
			limit.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
			SetInformationJobObject(
				job,
				JobObjectExtendedLimitInformation,
				&limit as *const _ as *const _,
				std::mem::size_of::<JOBOBJECT_EXTENDED_LIMIT_INFORMATION>() as u32,
			)?;
			Ok(Self {
				desktop,
				job,
				adopted: None,
				pid: 0,
			})
		}
	}

	pub fn bind_current_thread() -> Result<()> {
		unsafe {
			let desk = OpenDesktopW(w!("pptxgen-ppt-verify"), DESKTOP_CONTROL_FLAGS(0), false, DESKTOP_ACCESS)?;
			SetThreadDesktop(desk)
		}
	}

	pub fn adopt_hwnd(&mut self, hwnd: i64) -> Result<u32> {
		if hwnd == 0 {
			return Err(windows::core::Error::new(
				windows::core::HRESULT(0x80004005u32 as i32),
				"PowerPoint HWND is 0",
			));
		}
		let mut pid = 0u32;
		unsafe { GetWindowThreadProcessId(HWND(hwnd as *mut _), Some(&mut pid)) };
		if pid == 0 {
			return Err(windows::core::Error::new(
				windows::core::HRESULT(0x80004005u32 as i32),
				"could not resolve PowerPoint pid from HWND",
			));
		}
		unsafe {
			let process = OpenProcess(PROCESS_SET_QUOTA | PROCESS_TERMINATE | PROCESS_QUERY_LIMITED_INFORMATION, false, pid)?;
			// Office Click-to-Run already owns a job; assigning a second job fails with ERROR_BUSY.
			if AssignProcessToJobObject(self.job, process).is_err() {
				eprintln!("powerpoint-verify: PowerPoint is already in a job; cleanup will TerminateProcess");
			}
			self.adopted = Some(process);
		}
		self.pid = pid;
		Ok(pid)
	}

}

impl Drop for Isolation {
	fn drop(&mut self) {
		unsafe {
			if let Some(process) = self.adopted.take() {
				use windows::Win32::System::Threading::TerminateProcess;
				let _ = TerminateProcess(process, 0);
				let _ = CloseHandle(process);
			}
			if !self.job.is_invalid() {
				let _ = CloseHandle(self.job);
			}
			if !self.desktop.is_invalid() {
				let _ = CloseDesktop(self.desktop);
			}
		}
	}
}

