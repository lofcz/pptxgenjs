# [MS-PPTX] Extension Coverage — Gap Analysis

Cross-checked the extracted **[MS-PPTX] PowerPoint (.pptx) Extensions** spec (170 pages,
`standards/pptx/mspptx-full.txt`) against the library source. This lists what the spec defines
that PptxGenJS does **not** currently emit, ordered by user value and effort.

The spec is organized as extensions to ISO/IEC 29500 (ECMA-376) — each feature hangs off an
`extLst`/`AlternateContent` with a namespaced child. We already emit **object animations**
(`p:timing` + `gen-animations.ts`) and **sections** (`p14:sectionLst`), which are the two
biggest MS-extension surface areas. Below is what remains.

---

## 1. Slide Transitions — **largest gap, highest value**

Spec §2.2.1 extends `<p:transition>` on `sld`/`sldLayout`/`sldMaster`. PptxGenJS emits **no
`<p:transition>` element at all** (zero matches in `gen-xml.ts`).

ECMA-376 base transitions (`p:fade`, `p:push`, `p:wipe`, `p:split`, `p:cut`, `p:blinds`,
`p:checker`, `p:circle`, `p:diamond`, `p:dissolve`, `p:newsflash`, `p:none`, `p:plus`, `p:random`,
`p:randomBar`, `p:cover`, `p:pull`, `p:strips`, `p:wedge`, `p:wheel`, `p:zoom`) — none emitted.

**MS-PPTX 2010+ modern transitions** (in `<mc:AlternateContent>` fallback to a base transition):
`vortex`, `switch`, `flip`, `ripple`, `honeycomb`, `prism`, `doors`, `window`, `ferris`,
`gallery`, `conveyor`, `pan`, `glitter`, `warp`, `flythrough`, `flash`, `shred`, `reveal`,
`wheelReverse`, **`morph`** (§2.6.1.1, `p16:morph`), and generic `prstTrans` (§2.4.1.5).

- Effort: **medium**. New `gen-transition.ts`, a `TransitionType` enum, slide-level
  `addTransition()` API, emit `<p:transition>` (with `<mc:AlternateContent>` for modern types)
  in `makeXmlSlide`. Direction/duration/speed attributes per `CT_*Transition`.
- Impact: **high** — transitions are a core presentation feature; morph especially.

## 2. Slide Zoom / Section Zoom / Summary Zoom — **high value**

Spec §2.2.15 (`p16:slideZm`, `p16:sectionZm`, `p16:summaryZm`) — interactive zoom-to-slide
shapes (PowerPoint 2016+). Emitted via `<mc:AlternateContent>` in `spTree` with `pic` fallback.

- Effort: **medium-high** (new shape type, rId to target slide, thumbnail fallback).
- Impact: **high** for navigation-heavy decks.

## 3. Guides (ruler guides) — **low effort**

Spec §2.2.11: `p15:sldGuideLst` / `p15:notesGuideLst` (`CT_GuideList`) on presentation / layout /
master / handout / notes. A vertical/horizontal guide is just `{pos, orient}`.

- Effort: **low** — we already stub an empty `p15:sldGuideLst` (line 2208 of `gen-xml.ts`).
  Just expose a `guides` array and populate it.
- Impact: low-medium.

## 4. Comments (modern threaded) + Authors — **medium**

Spec §2.1.5/§2.1.6 + §2.2.10: a `comments` part (`cmLst`) + `authors` part (`authorLst`) with
threading (`threadingInfo`) and presence info. Distinct from the legacy `cmAuthorLst`.

- Effort: **medium** — two new parts, content types, rels, per-slide comment list.
- Impact: medium (collaboration workflows).

## 5. Slide-show / View extensions — **low effort, small**

Spec §2.2.6: `p14:browseMode`, `p14:laserClr`, `p14:laserTraceLst`, `p14:showEvtLst`.
Spec §2.2.16: `p14:readonlyRecommended` on `presentationPr`.
Spec §2.2.7: `p14:defaultImageDpi`, `p14:discardImageEditData` on `presentationPr`.

- Effort: **low** each — mostly single attributes in `extLst` on existing parts.
- Impact: low.

## 6. Media extensions — **low-medium**

Spec §2.2.4: media bookmarks (`bmkTgt`), `p14:media` (trim/bookmark/fade), `showMediaCtrls`.
Spec §2.2.14: `isNarration` flag.

- Effort: **low-medium**.
- Impact: low-medium (only relevant when embedding audio/video, which is already supported).

## 7. Change tracking / Revision info — **medium effort, niche**

Spec §2.1.2/§2.1.4 + §2.2.9: revision information parts, `modId`, `creationId`.

- Effort: **medium**. Impact: niche (document-diff tooling).

## 8. Content-part / Office-app / Ink / Designer / Classification — **out of scope**

Spec §2.2.3 (contentPart/ink), §2.2.13 (web extension app), §2.2.17 (designElem),
§2.2.18 (classification), §2.2.20 (designer tags). These are app-embedded / server-driven
features with no meaningful generation story for a programmatic library.

- Effort: high. Impact: negligible for PptxGenJS consumers. **Recommend: skip.**

---

## Recommended priority order

| # | Feature | Effort | Value | Spec ref |
|---|---------|--------|-------|----------|
| 1 | ~~**Slide transitions**~~ **DONE** — `addTransition()` + `slide.transition`, base ECMA set + all 20 modern types incl. morph, `mc:AlternateContent` fallback, `p14:dur` duration (`src/gen-transition.ts`) | medium | high | §2.2.1 |
| 2 | ~~**Slide/Section/Summary zoom**~~ **DONE** — `addZoom({ slideNum,… })` (§2.10 `sldZm`), `addSectionZoom({ sectionTitle,… })` (§2.9 `sectionZm`), `addSummaryZoom({ sectionTitle,… })` (§2.11 `summaryZm` + required `gridLayout`/`fixedLayout` choice). All emit `mc:AlternateContent` with `p166:zmPr` nav props + cover-image rel; `pic` fallback for slide/section zoom, `grpSp` fallback for summary zoom (§2.2.15). Section zooms anchor to a **stable section GUID** (`SectionProps._id`, assigned once at build). | med-high | high | §2.2.15/§2.9–2.11 |
| 3 | ~~**Guides**~~ **DONE** — `pptx.guides = [{ orient, pos, color, name, userDrawn }]` → `p15:sldGuideLst` under `<p:presentation>` extLst, `pos` inches→EMU, required `p15:clr` child (MS-PPTX §2.4.3.3) | low | low-med | §2.2.11 |
| 4 | ~~**Presentation/view opts**~~ **DONE** — `pptx.defaultImageDpi` / `discardImageEditData` (p14) + `readonlyRecommended` (p1710) on `presentationPr` extLst (`makeXmlPresProps`) | low | low | §2.2.7/2.2.16 |
| 5 | ~~**Threaded comments + authors**~~ **DONE** — `slide.addComment({ text, author, x, y, replies })` + `pptx.commentAuthors`; `ppt/authors.xml` (`authorLst`) + `ppt/comments/commentSlide<N>.xml` (`cmLst`), `pc:sldMkLst` slide anchor, replies (`src/gen-comments.ts`) | medium | medium | §2.1.5/2.1.6/§2.16 |
| 6 | ~~**Media bookmarks / narration**~~ **DONE** — `addMedia({ trim, fade, bookmarks, isNarration })` → `p14:media` children (`trim`/`fade`/`bmkLst`) + `p15:isNarration` ext on `nvPr` (`genXmlMediaExtras`) | low-med | low-med | §2.2.4/§2.3.3.14/§2.2.14 |
| — | Content-part/ink/designer/classification | — | **skip** | §2.2.3/13/17/18/20 |

**Status: all six prioritized gaps implemented and green (138 pass / 0 fail).** Slide, section,
and summary zoom are all emitted (§2.9–§2.11). Out-of-scope app-embedded extensions
(content-part/ink/web-app/designer/classification, §2.2.3/13/17/18/20) remain intentionally skipped.
