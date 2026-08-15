# #79 Fix auto-paged table headers and rowspan alignment

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/79](https://github.com/NeomaVerwaltung/PptxGenJS/issues/79)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Mark repeated table headers with firstRow semantics and preserve rowspan column alignment across continuation slides. Add regression coverage for both conditions.

## Cited lofcz commits (already in this repo)

- `5ceee89` — fix: mark firstRow when autoPageRepeatHeader (Issue #1299) — https://github.com/lofcz/PptxGenJS/commit/5ceee89
- `5d4a9ba` — fixed issue 1231 — https://github.com/lofcz/PptxGenJS/commit/5d4a9ba

## Sourced documents (local markdown / extracts)

- **ECMA-376 PresentationML slides / tables** — `standards/ecma/part-20_presentationml-reference-material-slides.txt`
- **ECMA-376 WordprocessingML tables (rowspan analogue)** — `standards/ecma/part-06_wordprocessingml-reference-material-tables.txt`

## Agent notes

Both cited fixes are in this fork. Agent should add or confirm regression tests for firstRow + rowspan across autoPage continuation slides.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
