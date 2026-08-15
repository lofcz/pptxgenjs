# #78 Support DrawingML gradient fills

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/78](https://github.com/NeomaVerwaltung/PptxGenJS/issues/78)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/pptxgenjs-plus`). Do not impersonate NEOMA.

## Ask

Add validated gradient fill stops and color transforms without regressing solid, pattern, or modified-theme fills. Add semantic OOXML contracts and run npm run check.

## Cited lofcz commits (already in this repo)

- `18b233c` — expand gradient fill support and demo coverage — https://github.com/lofcz/pptxgenjs-plus/commit/18b233c

## Sourced documents (local markdown / extracts)

- **ECMA-376 DrawingML main (fills / gradFill)** — `standards/ecma/part-22_drawingml-reference-material-drawingml-main.txt`

## Agent notes

Gradient fills already expanded in this fork (18b233c). Agent should confirm stop/transform validation and contracts, then close remaining gaps only.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
