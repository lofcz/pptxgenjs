# #83 Add media playback controls through the timing tree

Source: [https://github.com/NeomaVerwaltung/PptxGenJS/issues/83](https://github.com/NeomaVerwaltung/PptxGenJS/issues/83)
State: OPEN on NeomaVerwaltung/PptxGenJS
Target repo: this fork (`lofcz/PptxGenJS`). Do not impersonate NEOMA.

## Ask

Add additive autoplay, loop, fullscreen, and mute media options. Specify defaults and invalid combinations; validate timing-tree XML, relationships, and Office playback.

## Cited lofcz commits (already in this repo)

- `6009328` — feat: add media autoplay/loop/fullScreen/mute via timing tree — https://github.com/lofcz/PptxGenJS/commit/6009328

## Sourced documents (local markdown / extracts)

- **ECMA-376 PresentationML animation / timing** — `standards/ecma/part-21_presentationml-reference-material-animation.txt`
- **MS-PPTX §2.2.4 Media Extensions** — `standards/ms-pptx/sections/024_media-extensions.md`
- **MS-PPTX §3.2 Media examples** — `standards/ms-pptx/sections/143_media.md`

## Agent notes

Already landed as 6009328. Agent should specify defaults/invalid combos and add timing-tree + Office playback tests if missing.

Official spec downloads:
- `[MS-PPTX]` v25.0 / 2024-08-20 — `standards/ms-pptx/MS-PPTX-25.0.md` (from official DOCX)
- `[MS-OWEXML]` v11.0 / 2024-08-20 — `standards/ms-owexml/MS-OWEXML-11.0.md`
- Learn hub: https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
