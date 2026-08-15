# #90 Add MS-PPTX revision and change-tracking extensions

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/90](https://github.com/NeomaVerwaltung/PptxGenJS/issues/90)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Implement revision information and change information parts plus creation/modification identifiers. Enforce the zero-or-one part cardinality, internal target mode, and relationship constraints stated in section 2.1.

## Sourced documents (local markdown / extracts)

- **MS-PPTX §2.1.2 Revision Information Part** — `standards/ms-pptx/sections/015_revision-information-part.md`
- **MS-PPTX §2.1.4 Changes Information Part** — `standards/ms-pptx/sections/017_changes-information-part.md`
- **MS-PPTX §2.2.9 Change Tracking Extensions** — `standards/ms-pptx/sections/029_change-tracking-extensions.md`
- **MS-PPTX §2.3.1.4 creationId** — `standards/ms-pptx/elements/2_3_1_4_creationId.md`
- **MS-PPTX §2.3.1.19 modId** — `standards/ms-pptx/elements/2_3_1_19_modId.md`
- **MS-PPTX §2.7.1.1 revInfo** — `standards/ms-pptx/elements/2_7_1_1_revInfo.md`
- **MS-PPTX §2.12.1.1 chgInfo** — `standards/ms-pptx/elements/2_12_1_1_chgInfo.md`
- **2013 command schema** — `standards/ms-pptx/sections/152_http-schemas-microsoft-com-office-powerpoint-2013-main-command-schema.md`

## Agent notes

Zero-or-one part cardinality, Internal target mode, relationship constraints from §2.1. Niche feature — keep opt-in.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
