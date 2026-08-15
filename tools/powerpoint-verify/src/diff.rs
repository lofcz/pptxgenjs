use std::collections::{BTreeMap, BTreeSet};
use std::fs::File;
use std::io::Read;
use std::path::Path;

use serde::Serialize;
use zip::ZipArchive;

#[derive(Serialize, Clone, Debug, Default)]
pub struct PartChange {
	pub part: String,
	pub hint: String,
}

#[derive(Serialize, Clone, Debug, Default)]
pub struct PackageDiff {
	pub added: Vec<String>,
	pub removed: Vec<String>,
	pub changed: Vec<PartChange>,
}

pub fn diff_pptx(original: &Path, repaired: &Path) -> Result<PackageDiff, String> {
	let left = read_parts(original)?;
	let right = read_parts(repaired)?;
	let left_names: BTreeSet<_> = left.keys().cloned().collect();
	let right_names: BTreeSet<_> = right.keys().cloned().collect();

	let mut diff = PackageDiff {
		added: right_names.difference(&left_names).cloned().collect(),
		removed: left_names.difference(&right_names).cloned().collect(),
		changed: Vec::new(),
	};
	for name in left_names.intersection(&right_names) {
		let a = &left[name];
		let b = &right[name];
		if a == b {
			continue;
		}
		diff.changed.push(PartChange {
			part: name.clone(),
			hint: change_hint(name, a, b),
		});
	}
	Ok(diff)
}

fn read_parts(path: &Path) -> Result<BTreeMap<String, Vec<u8>>, String> {
	let file = File::open(path).map_err(|err| format!("open {}: {err}", path.display()))?;
	let mut zip = ZipArchive::new(file).map_err(|err| format!("zip {}: {err}", path.display()))?;
	let mut parts = BTreeMap::new();
	for i in 0..zip.len() {
		let mut entry = zip.by_index(i).map_err(|err| err.to_string())?;
		if !entry.is_file() {
			continue;
		}
		let name = entry.name().replace('\\', "/");
		let mut bytes = Vec::new();
		entry.read_to_end(&mut bytes).map_err(|err| err.to_string())?;
		parts.insert(name, bytes);
	}
	Ok(parts)
}

fn change_hint(name: &str, before: &[u8], after: &[u8]) -> String {
	if name.ends_with(".xml") || name.ends_with(".rels") {
		let left = String::from_utf8_lossy(before);
		let right = String::from_utf8_lossy(after);
		if let Some(hint) = first_xml_hint(&left, &right) {
			return hint;
		}
	}
	format!("{} bytes -> {} bytes", before.len(), after.len())
}

fn first_xml_hint(before: &str, after: &str) -> Option<String> {
	let left: Vec<&str> = before.lines().collect();
	let right: Vec<&str> = after.lines().collect();
	let max = left.len().max(right.len());
	for i in 0..max {
		let a = left.get(i).copied().unwrap_or("");
		let b = right.get(i).copied().unwrap_or("");
		if a.trim() == b.trim() {
			continue;
		}
		return Some(format!(
			"line {}: {} → {}",
			i + 1,
			clip(a.trim(), 80),
			clip(b.trim(), 80)
		));
	}
	None
}

fn clip(text: &str, max: usize) -> String {
	if text.chars().count() <= max {
		text.to_string()
	} else {
		format!("{}…", text.chars().take(max).collect::<String>())
	}
}

pub fn compact_dialog(blob: &str) -> String {
	const MARKERS: &[&str] = &[
		"PowerPoint found a problem",
		"PowerPoint can't open",
		"PowerPoint cannot open",
		"našel problém",
		"Problem mit dem Inhalt",
	];
	for marker in MARKERS {
		if let Some(start) = blob.find(marker) {
			let rest = &blob[start..];
			let end = rest
				.find(" | Repair")
				.or_else(|| rest.find(" | Opravit"))
				.or_else(|| rest.find(" | Cancel"))
				.unwrap_or(rest.len().min(500));
			return rest[..end].replace(" | ", " ").trim().to_string();
		}
	}
	blob.chars().take(240).collect()
}
