# #86 Establish an MS-PPTX 25.0 extension conformance profile and schema matrix

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/86](https://github.com/NeomaVerwaltung/PptxGenJS/issues/86)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/pptxgenjs-plus`). Do not impersonate NEOMA.

## Ask

Define the supported MS-PPTX 25.0 profile and validate every emitted extension against its schema. For each supported extension, record namespace, part/content type/relationship, required Markup Compatibility wrapper, API, semantic package contract, and Office round-trip fixture. This is a tracker; child implementation issues carry feature work.

## Sourced documents (local markdown / extracts)

- **MS-PPTX §1.5 Applicability Statement** — `standards/ms-pptx/sections/009_applicability-statement.md`
- **MS-PPTX §2 Structures / Extensions (mc:Ignorable | AlternateContent | extLst)** — `standards/ms-pptx/sections/020_extensions.md`
- **MS-PPTX §2.1 Part Enumerations** — `standards/ms-pptx/sections/013_part-enumerations.md`
- **MS-PPTX Appendix A §5 Full XML Schemas** — `standards/ms-pptx/sections/150_http-schemas-microsoft-com-office-powerpoint-2010-main-schema.md`
- **Schema index** — `standards/ms-pptx/sections/_index.md`
- **Prior gap analysis** — `standards/pptx/MS-PPTX-GAPS.md`

## Agent notes

Tracker issue. Produce a matrix (markdown + maybe a typed registry) covering #87–#93. Do not implement child features here.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
