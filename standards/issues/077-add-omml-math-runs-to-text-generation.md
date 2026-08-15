# #77 Add OMML math runs to text generation

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/77](https://github.com/NeomaVerwaltung/PptxGenJS/issues/77)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/pptxgenjs-plus`). Do not impersonate NEOMA.

## Ask

Define a small additive typed API for Office Math Markup Language runs. Emit valid OMML within text paragraphs and add package plus Office round-trip coverage.

## Cited lofcz commits (already in this repo)

- `c09ee49` — omml — https://github.com/lofcz/pptxgenjs-plus/commit/c09ee49
- `30ab241` — math — https://github.com/lofcz/pptxgenjs-plus/commit/30ab241

## Sourced documents (local markdown / extracts)

- **ECMA-376 Shared MLs — Math / OMML** — `standards/ecma/part-27_shared-mls-reference-material-math.txt`
- **MS-PPTX §2.2.8 Math Extensions** — `standards/ms-pptx/sections/028_math-extensions.md`

## Agent notes

OMML work already exists in this fork (c09ee49 / 30ab241). Agent should audit the public API, XML validity, and tests rather than importing a second generator.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
