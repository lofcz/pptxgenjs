# #88 Add MS-PPTX sections, guides, and Zoom extension support

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/88](https://github.com/NeomaVerwaltung/PptxGenJS/issues/88)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/pptxgenjs-plus`). Do not impersonate NEOMA.

## Ask

Add typed support for presentation sections, slide/notes guides, and section/slide/summary zoom. Preserve the required AlternateContent fallbacks for Zoom objects.

## Sourced documents (local markdown / extracts)

- **MS-PPTX §2.2.5 Section Extensions** — `standards/ms-pptx/sections/025_section-extensions.md`
- **MS-PPTX §2.2.11 Guide Extensions** — `standards/ms-pptx/sections/031_guide-extensions.md`
- **MS-PPTX §2.2.15 Zoom Extensions** — `standards/ms-pptx/sections/035_zoom-extensions.md`
- **MS-PPTX §2.3.1.25 sectionLst** — `standards/ms-pptx/elements/2_3_1_25_sectionLst.md`
- **MS-PPTX §2.4.1.3 notesGuideLst** — `standards/ms-pptx/elements/2_4_1_3_notesGuideLst.md`
- **MS-PPTX §2.4.1.6 sldGuideLst** — `standards/ms-pptx/elements/2_4_1_6_sldGuideLst.md`
- **MS-PPTX §2.9.1.1 sectionZm** — `standards/ms-pptx/elements/2_9_1_1_sectionZm.md`
- **MS-PPTX §2.10.1.1 sldZm** — `standards/ms-pptx/elements/2_10_1_1_sldZm.md`
- **MS-PPTX §2.11.1.1 summaryZm** — `standards/ms-pptx/elements/2_11_1_1_summaryZm.md`
- **Zoom schemas** — `standards/ms-pptx/sections/157_http-schemas-microsoft-com-office-powerpoint-2016-sectionzoom-schema.md`
- **MS-PPTX §3.3 Sections examples** — `standards/ms-pptx/sections/144_sections.md`

## Agent notes

This fork already emits sections and stubs sldGuideLst. Zoom objects MUST keep AlternateContent fallbacks. See MS-PPTX-GAPS.md items 2–3.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
