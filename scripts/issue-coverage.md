# PptxGenJS fork — upstream issue coverage matrix

Triage of open issues at <https://github.com/gitbrent/PptxGenJS/issues> against this fork.
Goal: maximize "what are we missing" by capturing each **genuinely uncovered, reproducible bug**
as a **failing regression test** in `test/issues.test.ts` (the `#NNNN:` blocks at the bottom).

Last updated: 2026-08-10.

## Legend

- **COVERED** — fix present in `src/` and/or regression-tested in `test/`.
- **GAP (failing test)** — reproducible bug NOT covered; a failing test now exists in
  `test/issues.test.ts`. Fixing the bug turns the test green.
- **COVERED (probe)** — behavior verified correct in `src/` (emits valid XML); not a clean gap.
- **FEATURE** — feature request, not a bug (no failing test by design).
- **QUESTION/ENV** — usage question or environment-specific (Apple Numbers, Qiankun, NX, RTL
  mixed text); not reproducible here.

---

## FIXED in this fork (each has a passing regression test in `test/issues.test.ts`)

All previously-identified gaps are now fixed and green (full suite 138 pass / 0 fail).

MS-PPTX extension grind — all six prioritized gaps now implemented and regression-tested
(`standards/pptx/MS-PPTX-GAPS.md`):

| Gap | Feature | API |
|-----|---------|-----|
| 1 | Slide transitions (base + 20 modern incl. morph) | `slide.addTransition({ type, duration, direction })` |
| 2 | Slide/Section/Summary zoom | `slide.addZoom({ slideNum,… })` / `addSectionZoom({ sectionTitle,… })` / `addSummaryZoom({ sectionTitle,… })` |
| 3 | Guides | `pptx.guides = [{ orient, pos, color }]` |
| 4 | Presentation opts | `pptx.defaultImageDpi` / `readonlyRecommended` / `discardImageEditData` |
| 5 | Threaded comments + authors | `slide.addComment({ text, author, replies })` + `pptx.commentAuthors` |
| 6 | Media trim/fade/bookmarks/narration | `addMedia({ trim, fade, bookmarks, isNarration })` |

Deferred sub-item: none — slide, section, and summary zoom are all emitted (§2.9–§2.11).

| Issue | Fix (ECMA-376 grounded) |
|-------|--------------------------|
| #1472 | Verified correct behavior; regression test locks slide-1 dual-table + overflow isolation. |
| #1443 | §4.4.1.24 `CT_NotesMaster` — empty spTree (bg+clrMap+notesStyle), placeholders removed. |
| #1245 | §5.7.2.33/34 — numeric `valAxisCrossesAt` emits `crossesAt` (double) via `??`, not `crosses=autoZero`. |
| #856/#1135 | §4.4.1.33/§4.8.14 — `<p:ph type="tbl"/>` emitted on the table graphicFrame nvPr. |
| #1291 | §5.1.6.13 `CT_TableProperties` — `rtl` attribute on `<a:tblPr>` via `rtlMode`. |
| #1339 | OPC Part 2 — identical base64 image `data` dedupes to a single media part. |
| #1405 | Autopage slides inherit the parent slide's actual section (any position), not `Default-1`. |
| #1399 | §5.1.10.55 `srcRect` — crop keeps the independent `<a:ext>` frame w/h; frame no longer collapses. |
| #1309 | §5.7.2.122 `CT_NumFmt` — custom `formatCode` uses `sourceLinked="0"` (linked=true ignores the mask). |
| #1474 | `image-size` runtime dep removed; self-contained header parser (PNG/JPEG/GIF/BMP) + dimension-bomb clamp. |
| #1416 | Master/layout media use `layout-image-N` stem (PresSlide vs SlideLayout via `_rId`); never collide with slide #1000+ `image-N-M`. |
| #1286 | Mixed-unit image dims (`w>=100` EMU, `h<100` in) coerced to consistent EMU before sizing ratio; `srcRect` no longer corrupt (was offsets in the billions). |
| #1440 | NaN guard on cell margin — confirmed already fixed (`gen-xml.ts` non-number/array → DEF + isFinite map). |
| #1441 | Minimal `<p:txBody>` on text-less `<p:sp>` — confirmed already fixed. |
| #1442 | `<a:effectLst/>` on solid `<p:bgPr>` — confirmed already fixed. |
| #1444 | Single slideMaster Override (no phantom per-slide entries) — confirmed already fixed. |
| #1446/#1448 | `createColorElement` accepts `{color,type}` objects — confirmed already fixed. |
| #1453 | `addPlaceholdersToSlideLayouts` passes `isPlaceholder=true` — confirmed already fixed. |
| #1466 | Flat string cats use `c:strRef` (single-level branch) — confirmed already fixed. |
| #1432 | `bullet:{type:'bullet'}` falls through to char bullet — confirmed already fixed. |
| #996 | Placeholder-bound image inherits placeholder w/h (imgWidth/imgHeight re-synced after placeholder block) + skipped from natural-px sizing; frame no longer collapses to ~px/96in or 1x1. |
| #1239 | Image hyperlink `&` escaped to `&amp;` — confirmed already fixed. |
| #1048 | Every autopage cell `<a:txBody>` emits `<a:p>` — confirmed already fixed. |
| #1234 | TableCell hyperlink emits rel + `hlinkClick` (escaped) — confirmed already fixed. |
| #1312 | FEATURE — `caps:'none'|'small'|'all'` → `cap` attr on run properties (§5.1.12.64 `ST_TextCapsType`). Implemented. |
| #1320 | FEATURE — `columns`/`columnGap` → `numCol`/`spcCol` on `<a:bodyPr>` (§5.1.5.1.4 `CT_TextBodyProperties`). Implemented. |
| #1199 | FEATURE — `fit:{type:'shrink',fontScale,lnSpcReduction}` → `<a:normAutofit>` % attrs (§5.1.5.1.3). Implemented. |
| #782 | FEATURE — `line.cap:'flat'|'sq'|'rnd'` → `<a:ln>@cap` (§5.1.2.1.34 `ST_LineCap`). Implemented. |
| #1328 | FEATURE — `custGeom` custom geometry — already fully implemented (`gen-xml.ts` pathLst branch). |

---

## COVERED — fix present and/or regression-tested

| Issue | Where covered |
|-------|----------------|
| #1466 flat string cats use `c:strRef` | `gen-charts.ts` single-vs-multi-level branch |
| #1453 placeholder created as TEXT not PLACEHOLDER | `gen-objects.ts` `addTextDefinition(..., isPlaceholder=true)` |
| #1449 invalid shape presets / PowerPoint-only errors | `gen-objects.ts` `VALID_SHAPE_PRESETS` runtime validation |
| #1448 combo chart fill-object throw | `createColorElement` accepts `{color,type}` objects |
| #1446 pie/doughnut global dLbls font opts | `gen-charts.ts` uses `dataLabelFontFace/Size` |
| #1444 phantom slideMaster overrides in Content_Types | `gen-xml.ts` emits one slideMaster Override |
| #1442 solid bg missing `<a:effectLst/>` | `gen-xml.ts` adds `<a:effectLst/>` |
| #1441 shapes w/o text missing `<p:txBody>` | `gen-xml.ts` returns minimal valid `<p:txBody>` |
| #1440 table cell margin NaN attrs | `gen-xml.ts` guards non-number/NaN margins |
| #1436 scatter/bubble inherit value formatting | `test/issues.test.ts` `#1436` catLabelFormatCode test |
| #1430 currency/percent format lost + zero blank | `test/issues.test.ts` `#1430` zero-values test |
| #1366 text shadow angle/blur (blur=0 crisp) | `gen-xml.ts` uses `?? 8` (not `\|\|`) for blur |
| #1348 scatter data-label font size | `gen-charts.ts` honors `dataLabelFontSize` in dLbls |
| #1322 align attr leaking to following runs | `gen-xml.ts` regroups runs by align change |
| #1318 TOP border not displayed for row | `gen-xml.ts` emits real-width `a:lnT` (idx 0) |
| #1319 autopage not respecting newly-added slide | `gen-tables.ts` `newSlideStartY`/`autoPageSlideStartY` |
| #1294 sub/superscript in table cell | `gen-xml.ts` `baseline` attr (`-40000`/`30000`) |
| #1293 inner shadow breaks pptx | `gen-xml.ts`/`gen-charts.ts` well-formed `innerShdw` effectLst |
| #1290 extra cells when colspan>1 | `gen-tables.ts`/`gen-xml.ts` correct `gridSpan` + cell count |
| #1231 rowspan+autoPage column alignment | `test/issues.test.ts` `#1231` |
| #1299 autoPageRepeatHeader firstRow a11y | `test/issues.test.ts` `#1299` |
| #1139 text array w/o breakLine duplicated | `test/issues.test.ts` `#1139` |
| #913 empty first text run / repair dialog | `genXmlTextRun` emits `<a:r>` even for empty text |

---

## FEATURE (not bugs — no failing test)

#1456 LaTeX/OMML math · #1434 video loop · #1425 · #1424 per-series line styles ·
#1417 custom property · #1360 nested bullet styles in master · #1329 series line ·
#1328 custGeom ShapeType · #1320 text-body columns · #1317 image shape fill ·
#1451 auto-fit table columns to width.

## QUESTION / ENVIRONMENT (not reproducible here)

#1450 load existing slide · #1423 Excel-edit dimensions · #1422 shape for placeholder ·
#1419 NX Angular microfrontend · #1396 Apple Numbers charts · #1394 `shapes` TS type ·
#1378 custom fonts · #1376 pie leader-line color · #1375 bar label=series color ·
#1365 image hyperlink url restrictions · #1363 chart title centered · #1349 mixed RTL/LTR ·
#1316 Qiankun sub-app · #1410 svg gradient fidelity · #1399 image `sizing:crop` container ·
#1351 base64 image aspect (renders, needs explicit w/h) · #1355 bar+scatter combo ·
#1357 stacked bar (emits valid grouping) · #1405 autopage slide in wrong section ·
#1402 bullet in OSS renderers (fork emits buChar) · #1420 chart CJK font (fontFace written).
