use windows::core::{GUID, PCWSTR, Result};
use windows::Win32::System::Com::{
	DISPATCH_FLAGS, DISPATCH_METHOD, DISPATCH_PROPERTYGET, DISPATCH_PROPERTYPUT, DISPPARAMS, EXCEPINFO,
	IDispatch,
};
use windows::Win32::System::Ole::DISPID_PROPERTYPUT;
use windows::Win32::System::Variant::VARIANT;

const LOCALE_USER_DEFAULT: u32 = 0x0400;

pub fn dispid(disp: &IDispatch, name: &str) -> Result<i32> {
	unsafe {
		let wide: Vec<u16> = name.encode_utf16().chain(std::iter::once(0)).collect();
		let mut ptr = PCWSTR(wide.as_ptr());
		let mut id = 0i32;
		disp.GetIDsOfNames(&GUID::zeroed(), &mut ptr, 1, LOCALE_USER_DEFAULT, &mut id)?;
		Ok(id)
	}
}

fn invoke(disp: &IDispatch, name: &str, flags: DISPATCH_FLAGS, mut args: Vec<VARIANT>) -> Result<VARIANT> {
	unsafe {
		let id = dispid(disp, name)?;
		args.reverse();
		let mut named = DISPID_PROPERTYPUT;
		let params = DISPPARAMS {
			rgvarg: args.as_mut_ptr(),
			rgdispidNamedArgs: if flags == DISPATCH_PROPERTYPUT {
				&mut named
			} else {
				std::ptr::null_mut()
			},
			cArgs: args.len() as u32,
			cNamedArgs: if flags == DISPATCH_PROPERTYPUT { 1 } else { 0 },
		};
		let mut result = VARIANT::default();
		let mut excep = EXCEPINFO::default();
		disp.Invoke(
			id,
			&GUID::zeroed(),
			LOCALE_USER_DEFAULT,
			flags,
			&params,
			Some(&mut result),
			Some(&mut excep),
			None,
		)
		.map_err(|err| {
			if excep.bstrDescription.is_empty() {
				err
			} else {
				windows::core::Error::new(err.code(), excep.bstrDescription.to_string())
			}
		})?;
		Ok(result)
	}
}

pub fn prop_get(disp: &IDispatch, name: &str) -> Result<VARIANT> {
	invoke(disp, name, DISPATCH_PROPERTYGET, Vec::new())
}

pub fn prop_put(disp: &IDispatch, name: &str, value: VARIANT) -> Result<()> {
	invoke(disp, name, DISPATCH_PROPERTYPUT, vec![value])?;
	Ok(())
}

pub fn method(disp: &IDispatch, name: &str, args: Vec<VARIANT>) -> Result<VARIANT> {
	invoke(disp, name, DISPATCH_METHOD, args)
}

pub fn as_dispatch(value: &VARIANT) -> Result<IDispatch> {
	IDispatch::try_from(value)
}

pub fn as_i32(value: &VARIANT) -> Option<i32> {
	i32::try_from(value).ok()
}

pub fn as_string(value: &VARIANT) -> Option<String> {
	windows::core::BSTR::try_from(value).ok().map(|b| b.to_string())
}

pub fn vt_bstr(text: &str) -> VARIANT {
	VARIANT::from(text)
}

pub fn vt_i4(value: i32) -> VARIANT {
	VARIANT::from(value)
}

pub fn vt_bool(value: bool) -> VARIANT {
	VARIANT::from(value)
}
