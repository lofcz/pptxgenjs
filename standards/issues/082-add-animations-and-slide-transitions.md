# #82 Add animations and slide transitions

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/82](https://github.com/NeomaVerwaltung/PptxGenJS/issues/82)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Introduce a small additive API for supported animation presets and slide transitions. Validate timing and transition XML structurally and with Office round-trip tests; do not wholesale-import the fork generator.

## Sourced documents (local markdown / extracts)

- **ECMA-376 PresentationML animation** — `standards/ecma/part-21_presentationml-reference-material-animation.txt`
- **MS-PPTX §2.2.1 Slide Transition Extensions** — `standards/ms-pptx/sections/021_slide-transition-extensions.md`
- **MS-PPTX §2.2.2 Animation Info Extensions** — `standards/ms-pptx/sections/022_animation-info-extensions.md`
- **MS-PPTX §3.1 Slide Transitions examples** — `standards/ms-pptx/sections/142_slide-transitions.md`
- **Prior gap notes** — `standards/pptx/MS-PPTX-GAPS.md`

## Agent notes

NEOMA explicitly says do not wholesale-import the fork generator. This repo already has gen-animations and some transition work — audit current API, keep it small/additive, and add Office round-trip coverage.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
