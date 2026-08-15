# #93 Add MS-PPTX chart tracking reference extension

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/93](https://github.com/NeomaVerwaltung/PptxGenJS/issues/93)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/pptxgenjs-plus`). Do not impersonate NEOMA.

## Ask

Add opt-in chartTrackingRefBased presentation property support for PowerPoint chart compatibility. Emit the required presentationPr/extLst URI, validate it semantically, and preserve current chart output when unset.

## Sourced documents (local markdown / extracts)

- **MS-PPTX §2.2.12 Charting Extensions** — `standards/ms-pptx/sections/032_charting-extensions.md`
- **MS-PPTX §2.4.1.1 chartTrackingRefBased** — `standards/ms-pptx/elements/2_4_1_1_chartTrackingRefBased.md`
- **2012 main schema** — `standards/ms-pptx/sections/151_http-schemas-microsoft-com-office-powerpoint-2012-main-schema.md`
- **ECMA-376 DrawingML charts** — `standards/ecma/part-23_drawingml-reference-material-drawingml-charts.txt`

## Agent notes

URI {FD5EFAAD-0ECE-453E-9831-46B23BE46B34} on presentationPr/extLst. Opt-in; unset must not change current chart XML.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
