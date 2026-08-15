# #80 Support pie-label positions and per-point chart data labels

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/80](https://github.com/NeomaVerwaltung/PptxGenJS/issues/80)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Complete chart-label compatibility: pie data-label positions and additive per-point data-label settings. Preserve current series-level behavior and validate generated chart XML.

## Cited lofcz commits (already in this repo)

- `ad63cdc` — fix: honor dataLabelPosition for pie charts (outEnd) — https://github.com/lofcz/PptxGenJS/commit/ad63cdc
- `6c0eec6` — feat: per-point custom chart dataLabels (from yukosgiti, selective) — https://github.com/lofcz/PptxGenJS/commit/6c0eec6

## Sourced documents (local markdown / extracts)

- **ECMA-376 DrawingML charts** — `standards/ecma/part-23_drawingml-reference-material-drawingml-charts.txt`

## Agent notes

Both cited commits are in this fork. Agent should verify pie outEnd positions and per-point labels still emit valid c:dLbls without breaking series-level defaults.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
