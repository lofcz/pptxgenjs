# #91 Add MS-PPTX authors, comments, and modern collaboration extensions

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/91](https://github.com/NeomaVerwaltung/PptxGenJS/issues/91)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Add typed authors/comments/replies, comment-change records, tasks, and reactions. Validate author/comment part content types and relationship constraints from sections 2.1.5-2.1.6.

## Sourced documents (local markdown / extracts)

- **MS-PPTX §2.1.5 Comment Part** — `standards/ms-pptx/sections/018_comment-part.md`
- **MS-PPTX §2.1.6 Author Part** — `standards/ms-pptx/sections/019_author-part.md`
- **MS-PPTX §2.2.10 Comment Extensions** — `standards/ms-pptx/sections/030_comment-extensions.md`
- **MS-PPTX §2.16 authorLst / cmLst** — `standards/ms-pptx/elements/2_16_1_1_authorLst.md`
- **MS-PPTX §2.16.1.2 cmLst** — `standards/ms-pptx/elements/2_16_1_2_cmLst.md`
- **MS-PPTX §2.18 comment monikers** — `standards/ms-pptx/elements/2_18_1_1_cmMkLst.md`
- **MS-PPTX §2.19 comment changes** — `standards/ms-pptx/elements/2_19_1_1_cmChg.md`
- **MS-PPTX §2.20 tasks** — `standards/ms-pptx/elements/2_20_1_1_taskDetails.md`
- **MS-PPTX §2.21 reactions** — `standards/ms-pptx/elements/2_21_1_1_reactions.md`
- **2018/8 comments schema** — `standards/ms-pptx/sections/163_http-schemas-microsoft-com-office-powerpoint-2018-8-main-schema.md`

## Agent notes

Modern threaded comments, not legacy cmAuthorLst. Validate content types + rels from §2.1.5–2.1.6.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
