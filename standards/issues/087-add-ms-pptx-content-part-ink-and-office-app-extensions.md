# #87 Add MS-PPTX content-part, ink, and Office App extensions

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/87](https://github.com/NeomaVerwaltung/PptxGenJS/issues/87)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Implement additive support for content parts and ink fallbacks, then Office App content references. Use mc:AlternateContent with the mandated fallback and validate package relationships.

## Sourced documents (local markdown / extracts)

- **MS-PPTX §2.2.3 Content Part Extensions** — `standards/ms-pptx/sections/023_content-part-extensions.md`
- **MS-PPTX §2.2.3.1 Ink Extensions (in same file)** — `standards/ms-pptx/sections/023_content-part-extensions.md`
- **MS-PPTX §2.2.13 Office App Extensions** — `standards/ms-pptx/sections/033_office-app-extensions.md`
- **MS-PPTX §2.3.1.20 nvContentPartPr** — `standards/ms-pptx/elements/2_3_1_20_nvContentPartPr.md`
- **MS-PPTX §2.3.1.34 xfrm** — `standards/ms-pptx/elements/2_3_1_34_xfrm.md`
- **MS-OWEXML §2.1.3 webextensionref** — `standards/ms-owexml/sections/016_webextensionref.md`
- **MS-OWEXML CT_WebExtensionPartRef** — `standards/ms-owexml/sections/027_ct-webextensionpartref.md`
- **MS-OWEXML full** — `standards/ms-owexml/MS-OWEXML-11.0.md`

## Agent notes

Must emit mc:AlternateContent with the mandated fallback (sp for contentPart, pic for ink). Validate package relationships. Office App refs go through MS-OWEXML webextensionref.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
