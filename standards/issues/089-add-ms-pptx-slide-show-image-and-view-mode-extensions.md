# #89 Add MS-PPTX slide-show, image, and view-mode extensions

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/89](https://github.com/NeomaVerwaltung/PptxGenJS/issues/89)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/pptxgenjs-plus`). Do not impersonate NEOMA.

## Ask

Add typed slide-show browse/laser/event options, image-edit-data and default-DPI settings, and read-only recommendation. Test extLst URI, namespace, and PowerPoint behavior.

## Sourced documents (local markdown / extracts)

- **MS-PPTX §2.2.6 Slide Show Extensions** — `standards/ms-pptx/sections/026_slide-show-extensions.md`
- **MS-PPTX §2.2.7 Image Extensions** — `standards/ms-pptx/sections/027_image-extensions.md`
- **MS-PPTX §2.2.16 View Mode Extensions** — `standards/ms-pptx/sections/036_view-mode-extensions.md`
- **MS-PPTX §2.3.1.2 browseMode** — `standards/ms-pptx/elements/2_3_1_2_browseMode.md`
- **MS-PPTX §2.3.1.5 defaultImageDpi** — `standards/ms-pptx/elements/2_3_1_5_defaultImageDpi.md`
- **MS-PPTX §2.3.1.6 discardImageEditData** — `standards/ms-pptx/elements/2_3_1_6_discardImageEditData.md`
- **MS-PPTX §2.3.1.16 laserClr** — `standards/ms-pptx/elements/2_3_1_16_laserClr.md`
- **MS-PPTX §2.3.1.17 laserTraceLst** — `standards/ms-pptx/elements/2_3_1_17_laserTraceLst.md`
- **MS-PPTX §2.14.1.1 readonlyRecommended** — `standards/ms-pptx/elements/2_14_1_1_readonlyRecommended.md`
- **MS-PPTX §3.4 Slide Show examples** — `standards/ms-pptx/sections/145_slide-show.md`

## Agent notes

Mostly presentationPr/extLst attributes. Keep opt-in. Validate URI + namespace on each ext.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
