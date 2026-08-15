# #84 Consolidate shape glow, soft-edge, and reflection effects

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/84](https://github.com/NeomaVerwaltung/PptxGenJS/issues/84)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Serialize a single valid a:effectLst when multiple effects are configured, preserving current single-effect output. Add a semantic OOXML contract.

## Cited lofcz commits (already in this repo)

- `eaa14f2` — feat: merge glow, softEdge, and reflection into shape effectLst — https://github.com/lofcz/PptxGenJS/commit/eaa14f2

## Sourced documents (local markdown / extracts)

- **ECMA-376 DrawingML main (effectLst / glow / softEdge / reflection)** — `standards/ecma/part-22_drawingml-reference-material-drawingml-main.txt`

## Agent notes

Already landed as eaa14f2. Agent should confirm a single a:effectLst is emitted for combined effects and add/keep a semantic contract test.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
