# #81 Add opt-in embedded-font support

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/81](https://github.com/NeomaVerwaltung/PptxGenJS/issues/81)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Evaluate font embedding as an opt-in feature with explicit third-party-license provenance and no cost to non-users. Test font parts, relationships, and content types.

## Cited lofcz commits (already in this repo)

- `3c611bd` — Update gen-fonts.ts — https://github.com/lofcz/PptxGenJS/commit/3c611bd
- `4dbc4df` — fonts — https://github.com/lofcz/PptxGenJS/commit/4dbc4df

## Sourced documents (local markdown / extracts)

- **ECMA-376 PresentationML / package parts** — `standards/ecma/part-20_presentationml-reference-material-slides.txt`
- **MS-PPTX media / part enumerations (related packaging)** — `standards/ms-pptx/sections/013_part-enumerations.md`

## Agent notes

Font embedding already exists in this fork. Agent must keep it opt-in, document license provenance, and verify font parts + content types + rels. Do not embed fonts by default.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
