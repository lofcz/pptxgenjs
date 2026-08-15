# #85 Replace Buffer references in browser-bundled base64 paths

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/85](https://github.com/NeomaVerwaltung/PptxGenJS/issues/85)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/pptxgenjs-plus`). Do not impersonate NEOMA.

## Ask

Remove Buffer identifiers from shared browser-bundled paths to avoid Vite buffer-polyfill breakage. Preserve byte-equivalent Node output and add browser-path coverage.

## Cited lofcz commits (already in this repo)

- `cc47ba5` — fix: replace Buffer with portable base64 helpers — https://github.com/lofcz/pptxgenjs-plus/commit/cc47ba5

## Agent notes

Already landed as cc47ba5. Agent should grep for remaining Buffer usage on browser-bundled paths and add a browser-path test. No OOXML spec work.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
