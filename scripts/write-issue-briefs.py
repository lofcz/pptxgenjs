"""Extract cited spec slices and write agent briefs for NEOMA issues >= #76."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PPTX_MD = ROOT / 'standards' / 'ms-pptx' / 'MS-PPTX-25.0.md'
OWEXML_MD = ROOT / 'standards' / 'ms-owexml' / 'MS-OWEXML-11.0.md'
OWEXML_SECTIONS = ROOT / 'standards' / 'ms-owexml' / 'sections'
ELEMENTS = ROOT / 'standards' / 'ms-pptx' / 'elements'
ISSUES = ROOT / 'standards' / 'issues'

HEADING_RE = re.compile(r'^(#{1,4})\s+(?:<a[^>]+></a>)*(.+?)\s*$')


def slug(title: str) -> str:
	title = re.sub(r'<[^>]+>', '', title).strip().lower()
	return re.sub(r'[^a-z0-9]+', '-', title).strip('-')[:80] or 'section'


def split_by_heading(text: str, levels: tuple[str, ...]) -> list[tuple[str, str, str]]:
	chunks: list[tuple[str, str, str]] = []
	cur_level, cur_title, buf = '', 'front-matter', []

	def flush() -> None:
		body = '\n'.join(buf).strip()
		if body:
			chunks.append((cur_level, cur_title, body))

	for line in text.splitlines():
		m = HEADING_RE.match(line)
		if m and m.group(1) in levels:
			flush()
			cur_level = m.group(1)
			cur_title = re.sub(r'<[^>]+>', '', m.group(2)).strip()
			buf = [f'{cur_level} {cur_title}', '']
			continue
		buf.append(line)
	flush()
	return chunks


def write_owexml_sections() -> None:
	OWEXML_SECTIONS.mkdir(parents=True, exist_ok=True)
	chunks = split_by_heading(OWEXML_MD.read_text(encoding='utf-8'), ('#', '##', '###'))
	index = ['# [MS-OWEXML] v11.0 section files', '', '| heading | file |', '|---|---|']
	n = 0
	for level, title, body in chunks:
		if level not in ('##', '###'):
			continue
		n += 1
		name = f'{n:03d}_{slug(title)}.md'
		path = OWEXML_SECTIONS / name
		path.write_text(
			f'<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->\n<!-- heading: {title} -->\n\n{body}\n',
			encoding='utf-8',
		)
		index.append(f'| {title} | `sections/{name}` |')
	(OWEXML_SECTIONS / '_index.md').write_text('\n'.join(index) + '\n', encoding='utf-8')
	print('owexml sections', n)


CITED_ELEMENTS = {
	'browseMode': '2.3.1.2',
	'creationId': '2.3.1.4',
	'defaultImageDpi': '2.3.1.5',
	'discardImageEditData': '2.3.1.6',
	'laserClr': '2.3.1.16',
	'laserTraceLst': '2.3.1.17',
	'modId': '2.3.1.19',
	'nvContentPartPr': '2.3.1.20',
	'sectionLst': '2.3.1.25',
	'xfrm': '2.3.1.34',
	'chartTrackingRefBased': '2.4.1.1',
	'notesGuideLst': '2.4.1.3',
	'sldGuideLst': '2.4.1.6',
	'designElem': '2.5.1.1',
	'revInfo': '2.7.1.1',
	'sectionZm': '2.9.1.1',
	'sldZm': '2.10.1.1',
	'summaryZm': '2.11.1.1',
	'chgInfo': '2.12.1.1',
	'readonlyRecommended': '2.14.1.1',
	'classification': '2.15.1.1',
	'authorLst': '2.16.1.1',
	'cmLst': '2.16.1.2',
	'designPr': '2.17.1.1',
	'designTagLst': '2.17.1.2',
	'cmMkLst': '2.18.1.1',
	'cmChg': '2.19.1.1',
	'taskDetails': '2.20.1.1',
	'reactions': '2.21.1.1',
	'phTypeExt': '2.22.1.1',
}


def write_elements() -> dict[str, str]:
	ELEMENTS.mkdir(parents=True, exist_ok=True)
	chunks = split_by_heading(PPTX_MD.read_text(encoding='utf-8'), ('####',))
	written: dict[str, str] = {}
	for _level, title, body in chunks:
		name = title.split()[0] if title else ''
		if name not in CITED_ELEMENTS:
			continue
		sec = CITED_ELEMENTS[name]
		fname = f'{sec.replace(".", "_")}_{name}.md'
		path = ELEMENTS / fname
		path.write_text(
			f'<!-- [MS-PPTX] v25.0 §{sec} {name} -->\n\n{body}\n',
			encoding='utf-8',
		)
		written[sec] = f'standards/ms-pptx/elements/{fname}'
	print('element slices', len(written))
	return written


ISSUES_DATA = [
	{
		'n': 76,
		'title': 'Restore explicit slide content-type overrides',
		'body': 'Ensure every generated /ppt/slides/slideN.xml is declared as a PresentationML slide Override in [Content_Types].xml. Add a semantic package-contract regression test and verify npm run check.',
		'commits': [('ce476c0', 'fix: restore slide Overrides in [Content_Types].xml')],
		'specs': [
			('ECMA-376 / ISO 29500 content types', 'standards/ecma/part-01_front-matter.txt'),
			('PresentationML slides', 'standards/ecma/part-20_presentationml-reference-material-slides.txt'),
		],
		'note': 'Already landed in this fork as ce476c0. Agent should verify the Override is still emitted and the package-contract test exists; do not re-implement if present.',
	},
	{
		'n': 77,
		'title': 'Add OMML math runs to text generation',
		'body': 'Define a small additive typed API for Office Math Markup Language runs. Emit valid OMML within text paragraphs and add package plus Office round-trip coverage.',
		'commits': [('c09ee49', 'omml'), ('30ab241', 'math')],
		'specs': [
			('ECMA-376 Shared MLs — Math / OMML', 'standards/ecma/part-27_shared-mls-reference-material-math.txt'),
			('MS-PPTX §2.2.8 Math Extensions', 'standards/ms-pptx/sections/028_math-extensions.md'),
		],
		'note': 'OMML work already exists in this fork (c09ee49 / 30ab241). Agent should audit the public API, XML validity, and tests rather than importing a second generator.',
	},
	{
		'n': 78,
		'title': 'Support DrawingML gradient fills',
		'body': 'Add validated gradient fill stops and color transforms without regressing solid, pattern, or modified-theme fills. Add semantic OOXML contracts and run npm run check.',
		'commits': [('18b233c', 'expand gradient fill support and demo coverage')],
		'specs': [
			('ECMA-376 DrawingML main (fills / gradFill)', 'standards/ecma/part-22_drawingml-reference-material-drawingml-main.txt'),
		],
		'note': 'Gradient fills already expanded in this fork (18b233c). Agent should confirm stop/transform validation and contracts, then close remaining gaps only.',
	},
	{
		'n': 79,
		'title': 'Fix auto-paged table headers and rowspan alignment',
		'body': 'Mark repeated table headers with firstRow semantics and preserve rowspan column alignment across continuation slides. Add regression coverage for both conditions.',
		'commits': [
			('5ceee89', 'fix: mark firstRow when autoPageRepeatHeader (Issue #1299)'),
			('5d4a9ba', 'fixed issue 1231'),
		],
		'specs': [
			('ECMA-376 PresentationML slides / tables', 'standards/ecma/part-20_presentationml-reference-material-slides.txt'),
			('ECMA-376 WordprocessingML tables (rowspan analogue)', 'standards/ecma/part-06_wordprocessingml-reference-material-tables.txt'),
		],
		'note': 'Both cited fixes are in this fork. Agent should add or confirm regression tests for firstRow + rowspan across autoPage continuation slides.',
	},
	{
		'n': 80,
		'title': 'Support pie-label positions and per-point chart data labels',
		'body': 'Complete chart-label compatibility: pie data-label positions and additive per-point data-label settings. Preserve current series-level behavior and validate generated chart XML.',
		'commits': [
			('ad63cdc', 'fix: honor dataLabelPosition for pie charts (outEnd)'),
			('6c0eec6', 'feat: per-point custom chart dataLabels (from yukosgiti, selective)'),
		],
		'specs': [
			('ECMA-376 DrawingML charts', 'standards/ecma/part-23_drawingml-reference-material-drawingml-charts.txt'),
		],
		'note': 'Both cited commits are in this fork. Agent should verify pie outEnd positions and per-point labels still emit valid c:dLbls without breaking series-level defaults.',
	},
	{
		'n': 81,
		'title': 'Add opt-in embedded-font support',
		'body': 'Evaluate font embedding as an opt-in feature with explicit third-party-license provenance and no cost to non-users. Test font parts, relationships, and content types.',
		'commits': [('3c611bd', 'Update gen-fonts.ts'), ('4dbc4df', 'fonts')],
		'specs': [
			('ECMA-376 PresentationML / package parts', 'standards/ecma/part-20_presentationml-reference-material-slides.txt'),
			('MS-PPTX media / part enumerations (related packaging)', 'standards/ms-pptx/sections/013_part-enumerations.md'),
		],
		'note': 'Font embedding already exists in this fork. Agent must keep it opt-in, document license provenance, and verify font parts + content types + rels. Do not embed fonts by default.',
	},
	{
		'n': 82,
		'title': 'Add animations and slide transitions',
		'body': 'Introduce a small additive API for supported animation presets and slide transitions. Validate timing and transition XML structurally and with Office round-trip tests; do not wholesale-import the fork generator.',
		'commits': [],
		'specs': [
			('ECMA-376 PresentationML animation', 'standards/ecma/part-21_presentationml-reference-material-animation.txt'),
			('MS-PPTX §2.2.1 Slide Transition Extensions', 'standards/ms-pptx/sections/021_slide-transition-extensions.md'),
			('MS-PPTX §2.2.2 Animation Info Extensions', 'standards/ms-pptx/sections/022_animation-info-extensions.md'),
			('MS-PPTX §3.1 Slide Transitions examples', 'standards/ms-pptx/sections/142_slide-transitions.md'),
			('Prior gap notes', 'standards/pptx/MS-PPTX-GAPS.md'),
		],
		'note': 'NEOMA explicitly says do not wholesale-import the fork generator. This repo already has gen-animations and some transition work — audit current API, keep it small/additive, and add Office round-trip coverage.',
	},
	{
		'n': 83,
		'title': 'Add media playback controls through the timing tree',
		'body': 'Add additive autoplay, loop, fullscreen, and mute media options. Specify defaults and invalid combinations; validate timing-tree XML, relationships, and Office playback.',
		'commits': [('6009328', 'feat: add media autoplay/loop/fullScreen/mute via timing tree')],
		'specs': [
			('ECMA-376 PresentationML animation / timing', 'standards/ecma/part-21_presentationml-reference-material-animation.txt'),
			('MS-PPTX §2.2.4 Media Extensions', 'standards/ms-pptx/sections/024_media-extensions.md'),
			('MS-PPTX §3.2 Media examples', 'standards/ms-pptx/sections/143_media.md'),
		],
		'note': 'Already landed as 6009328. Agent should specify defaults/invalid combos and add timing-tree + Office playback tests if missing.',
	},
	{
		'n': 84,
		'title': 'Consolidate shape glow, soft-edge, and reflection effects',
		'body': 'Serialize a single valid a:effectLst when multiple effects are configured, preserving current single-effect output. Add a semantic OOXML contract.',
		'commits': [('eaa14f2', 'feat: merge glow, softEdge, and reflection into shape effectLst')],
		'specs': [
			('ECMA-376 DrawingML main (effectLst / glow / softEdge / reflection)', 'standards/ecma/part-22_drawingml-reference-material-drawingml-main.txt'),
		],
		'note': 'Already landed as eaa14f2. Agent should confirm a single a:effectLst is emitted for combined effects and add/keep a semantic contract test.',
	},
	{
		'n': 85,
		'title': 'Replace Buffer references in browser-bundled base64 paths',
		'body': 'Remove Buffer identifiers from shared browser-bundled paths to avoid Vite buffer-polyfill breakage. Preserve byte-equivalent Node output and add browser-path coverage.',
		'commits': [('cc47ba5', 'fix: replace Buffer with portable base64 helpers')],
		'specs': [],
		'note': 'Already landed as cc47ba5. Agent should grep for remaining Buffer usage on browser-bundled paths and add a browser-path test. No OOXML spec work.',
	},
	{
		'n': 86,
		'title': 'Establish an MS-PPTX 25.0 extension conformance profile and schema matrix',
		'body': 'Define the supported MS-PPTX 25.0 profile and validate every emitted extension against its schema. For each supported extension, record namespace, part/content type/relationship, required Markup Compatibility wrapper, API, semantic package contract, and Office round-trip fixture. This is a tracker; child implementation issues carry feature work.',
		'commits': [],
		'specs': [
			('MS-PPTX §1.5 Applicability Statement', 'standards/ms-pptx/sections/009_applicability-statement.md'),
			('MS-PPTX §2 Structures / Extensions (mc:Ignorable | AlternateContent | extLst)', 'standards/ms-pptx/sections/020_extensions.md'),
			('MS-PPTX §2.1 Part Enumerations', 'standards/ms-pptx/sections/013_part-enumerations.md'),
			('MS-PPTX Appendix A §5 Full XML Schemas', 'standards/ms-pptx/sections/150_http-schemas-microsoft-com-office-powerpoint-2010-main-schema.md'),
			('Schema index', 'standards/ms-pptx/sections/_index.md'),
			('Prior gap analysis', 'standards/pptx/MS-PPTX-GAPS.md'),
		],
		'note': 'Tracker issue. Produce a matrix (markdown + maybe a typed registry) covering #87–#93. Do not implement child features here.',
	},
	{
		'n': 87,
		'title': 'Add MS-PPTX content-part, ink, and Office App extensions',
		'body': 'Implement additive support for content parts and ink fallbacks, then Office App content references. Use mc:AlternateContent with the mandated fallback and validate package relationships.',
		'commits': [],
		'specs': [
			('MS-PPTX §2.2.3 Content Part Extensions', 'standards/ms-pptx/sections/023_content-part-extensions.md'),
			('MS-PPTX §2.2.3.1 Ink Extensions (in same file)', 'standards/ms-pptx/sections/023_content-part-extensions.md'),
			('MS-PPTX §2.2.13 Office App Extensions', 'standards/ms-pptx/sections/033_office-app-extensions.md'),
			('MS-PPTX §2.3.1.20 nvContentPartPr', 'standards/ms-pptx/elements/2_3_1_20_nvContentPartPr.md'),
			('MS-PPTX §2.3.1.34 xfrm', 'standards/ms-pptx/elements/2_3_1_34_xfrm.md'),
			('MS-OWEXML §2.1.3 webextensionref', 'standards/ms-owexml/sections/016_webextensionref.md'),
			('MS-OWEXML CT_WebExtensionPartRef', 'standards/ms-owexml/sections/027_ct-webextensionpartref.md'),
			('MS-OWEXML full', 'standards/ms-owexml/MS-OWEXML-11.0.md'),
		],
		'note': 'Must emit mc:AlternateContent with the mandated fallback (sp for contentPart, pic for ink). Validate package relationships. Office App refs go through MS-OWEXML webextensionref.',
	},
	{
		'n': 88,
		'title': 'Add MS-PPTX sections, guides, and Zoom extension support',
		'body': 'Add typed support for presentation sections, slide/notes guides, and section/slide/summary zoom. Preserve the required AlternateContent fallbacks for Zoom objects.',
		'commits': [],
		'specs': [
			('MS-PPTX §2.2.5 Section Extensions', 'standards/ms-pptx/sections/025_section-extensions.md'),
			('MS-PPTX §2.2.11 Guide Extensions', 'standards/ms-pptx/sections/031_guide-extensions.md'),
			('MS-PPTX §2.2.15 Zoom Extensions', 'standards/ms-pptx/sections/035_zoom-extensions.md'),
			('MS-PPTX §2.3.1.25 sectionLst', 'standards/ms-pptx/elements/2_3_1_25_sectionLst.md'),
			('MS-PPTX §2.4.1.3 notesGuideLst', 'standards/ms-pptx/elements/2_4_1_3_notesGuideLst.md'),
			('MS-PPTX §2.4.1.6 sldGuideLst', 'standards/ms-pptx/elements/2_4_1_6_sldGuideLst.md'),
			('MS-PPTX §2.9.1.1 sectionZm', 'standards/ms-pptx/elements/2_9_1_1_sectionZm.md'),
			('MS-PPTX §2.10.1.1 sldZm', 'standards/ms-pptx/elements/2_10_1_1_sldZm.md'),
			('MS-PPTX §2.11.1.1 summaryZm', 'standards/ms-pptx/elements/2_11_1_1_summaryZm.md'),
			('Zoom schemas', 'standards/ms-pptx/sections/157_http-schemas-microsoft-com-office-powerpoint-2016-sectionzoom-schema.md'),
			('MS-PPTX §3.3 Sections examples', 'standards/ms-pptx/sections/144_sections.md'),
		],
		'note': 'This fork already emits sections and stubs sldGuideLst. Zoom objects MUST keep AlternateContent fallbacks. See MS-PPTX-GAPS.md items 2–3.',
	},
	{
		'n': 89,
		'title': 'Add MS-PPTX slide-show, image, and view-mode extensions',
		'body': 'Add typed slide-show browse/laser/event options, image-edit-data and default-DPI settings, and read-only recommendation. Test extLst URI, namespace, and PowerPoint behavior.',
		'commits': [],
		'specs': [
			('MS-PPTX §2.2.6 Slide Show Extensions', 'standards/ms-pptx/sections/026_slide-show-extensions.md'),
			('MS-PPTX §2.2.7 Image Extensions', 'standards/ms-pptx/sections/027_image-extensions.md'),
			('MS-PPTX §2.2.16 View Mode Extensions', 'standards/ms-pptx/sections/036_view-mode-extensions.md'),
			('MS-PPTX §2.3.1.2 browseMode', 'standards/ms-pptx/elements/2_3_1_2_browseMode.md'),
			('MS-PPTX §2.3.1.5 defaultImageDpi', 'standards/ms-pptx/elements/2_3_1_5_defaultImageDpi.md'),
			('MS-PPTX §2.3.1.6 discardImageEditData', 'standards/ms-pptx/elements/2_3_1_6_discardImageEditData.md'),
			('MS-PPTX §2.3.1.16 laserClr', 'standards/ms-pptx/elements/2_3_1_16_laserClr.md'),
			('MS-PPTX §2.3.1.17 laserTraceLst', 'standards/ms-pptx/elements/2_3_1_17_laserTraceLst.md'),
			('MS-PPTX §2.14.1.1 readonlyRecommended', 'standards/ms-pptx/elements/2_14_1_1_readonlyRecommended.md'),
			('MS-PPTX §3.4 Slide Show examples', 'standards/ms-pptx/sections/145_slide-show.md'),
		],
		'note': 'Mostly presentationPr/extLst attributes. Keep opt-in. Validate URI + namespace on each ext.',
	},
	{
		'n': 90,
		'title': 'Add MS-PPTX revision and change-tracking extensions',
		'body': 'Implement revision information and change information parts plus creation/modification identifiers. Enforce the zero-or-one part cardinality, internal target mode, and relationship constraints stated in section 2.1.',
		'commits': [],
		'specs': [
			('MS-PPTX §2.1.2 Revision Information Part', 'standards/ms-pptx/sections/015_revision-information-part.md'),
			('MS-PPTX §2.1.4 Changes Information Part', 'standards/ms-pptx/sections/017_changes-information-part.md'),
			('MS-PPTX §2.2.9 Change Tracking Extensions', 'standards/ms-pptx/sections/029_change-tracking-extensions.md'),
			('MS-PPTX §2.3.1.4 creationId', 'standards/ms-pptx/elements/2_3_1_4_creationId.md'),
			('MS-PPTX §2.3.1.19 modId', 'standards/ms-pptx/elements/2_3_1_19_modId.md'),
			('MS-PPTX §2.7.1.1 revInfo', 'standards/ms-pptx/elements/2_7_1_1_revInfo.md'),
			('MS-PPTX §2.12.1.1 chgInfo', 'standards/ms-pptx/elements/2_12_1_1_chgInfo.md'),
			('2013 command schema', 'standards/ms-pptx/sections/152_http-schemas-microsoft-com-office-powerpoint-2013-main-command-schema.md'),
		],
		'note': 'Zero-or-one part cardinality, Internal target mode, relationship constraints from §2.1. Niche feature — keep opt-in.',
	},
	{
		'n': 91,
		'title': 'Add MS-PPTX authors, comments, and modern collaboration extensions',
		'body': 'Add typed authors/comments/replies, comment-change records, tasks, and reactions. Validate author/comment part content types and relationship constraints from sections 2.1.5-2.1.6.',
		'commits': [],
		'specs': [
			('MS-PPTX §2.1.5 Comment Part', 'standards/ms-pptx/sections/018_comment-part.md'),
			('MS-PPTX §2.1.6 Author Part', 'standards/ms-pptx/sections/019_author-part.md'),
			('MS-PPTX §2.2.10 Comment Extensions', 'standards/ms-pptx/sections/030_comment-extensions.md'),
			('MS-PPTX §2.16 authorLst / cmLst', 'standards/ms-pptx/elements/2_16_1_1_authorLst.md'),
			('MS-PPTX §2.16.1.2 cmLst', 'standards/ms-pptx/elements/2_16_1_2_cmLst.md'),
			('MS-PPTX §2.18 comment monikers', 'standards/ms-pptx/elements/2_18_1_1_cmMkLst.md'),
			('MS-PPTX §2.19 comment changes', 'standards/ms-pptx/elements/2_19_1_1_cmChg.md'),
			('MS-PPTX §2.20 tasks', 'standards/ms-pptx/elements/2_20_1_1_taskDetails.md'),
			('MS-PPTX §2.21 reactions', 'standards/ms-pptx/elements/2_21_1_1_reactions.md'),
			('2018/8 comments schema', 'standards/ms-pptx/sections/163_http-schemas-microsoft-com-office-powerpoint-2018-8-main-schema.md'),
		],
		'note': 'Modern threaded comments, not legacy cmAuthorLst. Validate content types + rels from §2.1.5–2.1.6.',
	},
	{
		'n': 92,
		'title': 'Add MS-PPTX design, classification, and modern placeholder extensions',
		'body': 'Add typed support for design elements/properties/tags, classification outcomes, and modern placeholder type extensions. Treat compliance metadata as opt-in and validate the extLst integration.',
		'commits': [],
		'specs': [
			('MS-PPTX §2.2.17 Design Element Extensions', 'standards/ms-pptx/sections/037_design-element-extensions.md'),
			('MS-PPTX §2.2.18 Classification Element Extensions', 'standards/ms-pptx/sections/038_classification-element-extensions.md'),
			('MS-PPTX §2.2.19 Designer Properties Extensions', 'standards/ms-pptx/sections/039_designer-properties-extensions.md'),
			('MS-PPTX §2.2.20 Designer Tags Extensions', 'standards/ms-pptx/sections/040_designer-tags-extensions.md'),
			('MS-PPTX §2.5.1.1 designElem', 'standards/ms-pptx/elements/2_5_1_1_designElem.md'),
			('MS-PPTX §2.15.1.1 classification', 'standards/ms-pptx/elements/2_15_1_1_classification.md'),
			('MS-PPTX §2.17.1.1 designPr', 'standards/ms-pptx/elements/2_17_1_1_designPr.md'),
			('MS-PPTX §2.17.1.2 designTagLst', 'standards/ms-pptx/elements/2_17_1_2_designTagLst.md'),
			('MS-PPTX §2.22.1.1 phTypeExt', 'standards/ms-pptx/elements/2_22_1_1_phTypeExt.md'),
		],
		'note': 'Classification / compliance metadata MUST stay opt-in. Validate extLst URI integration.',
	},
	{
		'n': 93,
		'title': 'Add MS-PPTX chart tracking reference extension',
		'body': 'Add opt-in chartTrackingRefBased presentation property support for PowerPoint chart compatibility. Emit the required presentationPr/extLst URI, validate it semantically, and preserve current chart output when unset.',
		'commits': [],
		'specs': [
			('MS-PPTX §2.2.12 Charting Extensions', 'standards/ms-pptx/sections/032_charting-extensions.md'),
			('MS-PPTX §2.4.1.1 chartTrackingRefBased', 'standards/ms-pptx/elements/2_4_1_1_chartTrackingRefBased.md'),
			('2012 main schema', 'standards/ms-pptx/sections/151_http-schemas-microsoft-com-office-powerpoint-2012-main-schema.md'),
			('ECMA-376 DrawingML charts', 'standards/ecma/part-23_drawingml-reference-material-drawingml-charts.txt'),
		],
		'note': 'URI {FD5EFAAD-0ECE-453E-9831-46B23BE46B34} on presentationPr/extLst. Opt-in; unset must not change current chart XML.',
	},
]


def write_issue(issue: dict) -> str:
	n = issue['n']
	fname = f'{n:03d}-{slug(issue["title"])}.md'
	url = f'https://github.com/NeomaVerwaltung/PptxGenJS/issues/{n}'
	lines = [
		f'# #{n} {issue["title"]}',
		'',
		f'Source: [{url}]({url})',
		'State: OPEN on NeomaVerwaltung/PptxGenJS',
		'Target repo: this fork (`lofcz/pptxgenjs-plus`). Do not impersonate NEOMA.',
		'',
		'## Ask',
		'',
		issue['body'],
		'',
	]
	if issue['commits']:
		lines += ['## Cited lofcz commits (already in this repo)', '']
		for sha, msg in issue['commits']:
			lines.append(f'- `{sha}` — {msg} — https://github.com/lofcz/pptxgenjs-plus/commit/{sha}')
		lines.append('')
	if issue['specs']:
		lines += ['## Sourced documents (local markdown / extracts)', '']
		for label, path in issue['specs']:
			lines.append(f'- **{label}** — `{path}`')
		lines.append('')
	lines += [
		'## Agent notes',
		'',
		issue['note'],
		'',
		'Official spec downloads:',
		'- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)',
		'- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`',
		'- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f',
		'',
	]
	ISSUES.mkdir(parents=True, exist_ok=True)
	(ISSUES / fname).write_text('\n'.join(lines), encoding='utf-8')
	return fname


def write_index(files: list[tuple[int, str, str]]) -> None:
	rows = [
		'# NEOMA issues ≥ #76 — agent briefs',
		'',
		'Fetched from https://github.com/NeomaVerwaltung/PptxGenJS/issues (open, #76–#93).',
		'Official specs converted to markdown live under `standards/ms-pptx/` and `standards/ms-owexml/`.',
		'Older PDF text extracts remain under `standards/pptx/` and `standards/ecma/`.',
		'',
		'| issue | title | brief |',
		'|---|---|---|',
	]
	for n, title, fname in files:
		rows.append(f'| [#{n}](https://github.com/NeomaVerwaltung/PptxGenJS/issues/{n}) | {title} | [`{fname}`](issues/{fname}) |')
	rows += [
		'',
		'## Spec sources',
		'',
		'| document | version | local |',
		'|---|---|---|',
		'| [MS-PPTX] | 25.0 / 2024-08-20 | `ms-pptx/MS-PPTX-25.0.md` + `ms-pptx/sections/` + `ms-pptx/elements/` |',
		'| [MS-OWEXML] | 11.0 / 2024-08-20 | `ms-owexml/MS-OWEXML-11.0.md` + `ms-owexml/sections/` |',
		'| ECMA-376 | extracted PDF text | `ecma/` |',
		'| [MS-PPTX] PDF extract (older) | layout text | `pptx/` |',
		'',
	]
	(ROOT / 'standards' / 'ISSUES.md').write_text('\n'.join(rows), encoding='utf-8')
	(ROOT / 'standards' / 'README.md').write_text(
		'\n'.join(
			[
				'# standards/',
				'',
				'OOXML / PowerPoint extension specs used to implement NEOMA issues #76–#93.',
				'',
				'- Start here: [`ISSUES.md`](ISSUES.md) — one brief per issue.',
				'- Official [MS-PPTX] v25.0 markdown: [`ms-pptx/MS-PPTX-25.0.md`](ms-pptx/MS-PPTX-25.0.md)',
				'- Official [MS-OWEXML] v11.0 markdown: [`ms-owexml/MS-OWEXML-11.0.md`](ms-owexml/MS-OWEXML-11.0.md)',
				'- Split MS-PPTX headings: [`ms-pptx/sections/_index.md`](ms-pptx/sections/_index.md)',
				'- Cited element slices: [`ms-pptx/elements/`](ms-pptx/elements/)',
				'- ECMA-376 extracts: [`ecma/_index.md`](ecma/_index.md)',
				'- Older MS-PPTX PDF extracts: [`pptx/_index.md`](pptx/_index.md)',
				'',
				'DOCX originals: `ms-pptx/MS-PPTX-240820.docx`, `ms-owexml/MS-OWEXML-240820.docx`.',
				'',
			]
		),
		encoding='utf-8',
	)


def main() -> None:
	write_owexml_sections()
	write_elements()
	files = []
	for issue in ISSUES_DATA:
		fname = write_issue(issue)
		files.append((issue['n'], issue['title'], fname))
	write_index(files)
	print('issue briefs', len(files))


if __name__ == '__main__':
	main()
