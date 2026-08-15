# #76 Restore explicit slide content-type overrides

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/76](https://github.com/NeomaVerwaltung/PptxGenJS/issues/76)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Ensure every generated /ppt/slides/slideN.xml is declared as a PresentationML slide Override in [Content_Types].xml. Add a semantic package-contract regression test and verify npm run check.

## Cited lofcz commits (already in this repo)

- `ce476c0` — fix: restore slide Overrides in [Content_Types].xml — https://github.com/lofcz/PptxGenJS/commit/ce476c0

## Sourced documents (local markdown / extracts)

- **ECMA-376 / ISO 29500 content types** — `standards/ecma/part-01_front-matter.txt`
- **PresentationML slides** — `standards/ecma/part-20_presentationml-reference-material-slides.txt`

## Agent notes

Already landed in this fork as ce476c0. Agent should verify the Override is still emitted and the package-contract test exists; do not re-implement if present.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
