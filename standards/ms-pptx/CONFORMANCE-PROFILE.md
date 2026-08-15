# MS-PPTX 25.0 extension conformance profile

Tracker for [NEOMA #86](https://github.com/NeomaVerwaltung/PptxGenJS/issues/86) on this fork (`@lofcz/pptxgenjs`). This document defines the **supported profile** and the **schema / package matrix**. Child issues **#87–#93** implement features. This file does not add emitters.

Typed registry (same catalog): [`src/ms-pptx-profile.ts`](../../src/ms-pptx-profile.ts).

| Field | Value |
|---|---|
| Spec | [MS-PPTX] PowerPoint (.pptx) Extensions |
| Version | **25.0** / 2024-08-20 |
| Learn hub | https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f |
| Local full text | `standards/ms-pptx/MS-PPTX-25.0.md` (when present in the working tree) |
| Companion | [MS-OWEXML] 11.0 / 2024-08-20 |
| Prior gap list | [`standards/pptx/MS-PPTX-GAPS.md`](../pptx/MS-PPTX-GAPS.md) |
| Section map | [`SECTION-MAP.md`](SECTION-MAP.md) |

**42 extensions** are catalogued (supported, partial, and planned).

---

## 1. Profile statement

[MS-PPTX] §1.5: these structures **extend** ISO/IEC 29500-1:2016 PresentationML. They are **not** a stand-alone file format. Every structure is integrated so that ISO/IEC 29500-1:2016 implementations remain compatible. Extensions do not require other extensions and do not prohibit other extensions in the same package.

[MS-PPTX] §2: **one** of the following Markup Compatibility mechanisms **MUST** be used for every emitted extension:

| Wrapper | Spec | When this profile uses it |
|---|---|---|
| `mc:Ignorable` | ISO/IEC 29500-3:2015 §7.2 | Prefixes on the part root (`a14`, `p14`, …) so unknown attrs/elements are skipped |
| `mc:AlternateContent` | ISO/IEC 29500-3:2015 §7.5 | Choice + mandated Fallback (transitions, zooms, contentPart, ink, Office Apps, math) |
| `p:ext` / `p:extLst` | ISO/IEC 29500-1:2016 §19.2.1.11–12 | URI-addressed child in a known host (`presentation`, `presentationPr`, `nvPr`, `sld`, `showPr`, `sldId`, `cSld`) |

This library’s profile:

| Class | Policy |
|---|---|
| **Supported** | Emitted by a public API; semantic package contract covered by `test/issues.test.ts` (or equivalent). Office COM/LibreOffice round-trip is required before calling the row “Office-proven”. |
| **Partial** | Some of the spec surface is emitted (or emitted incidentally). Child issue completes the rest. |
| **Planned** | Recorded here; implemented only in the listed child issue. Opt-in unless noted. |
| **Classification / Designer / Office App / ink** | Planned and **opt-in**. Do not emit by default. |

ISO/IEC 29500 PresentationML (slides, layouts, charts, tables, media binaries, relationships) remains the base. MS-PPTX rows below are **additive**.

---

## 2. Appendix A schema matrix

Namespaces from [MS-PPTX] Appendix A §5 (`sections/150_*.md`–`169_*.md`). Prefixes are the conventional Office ones used in this profile.

| Appendix | Prefix | Namespace | Schema file | Used by |
|---|---|---|---|---|
| 5.1 | `p14` | `http://schemas.microsoft.com/office/powerpoint/2010/main` | `150_…2010-main-schema.md` | transitions, media, sections, slide-show, image, modId/creationId, contentPart |
| 5.2 | `p15` | `http://schemas.microsoft.com/office/powerpoint/2012/main` | `151_…2012-main-schema.md` | guides, narration, chartTrackingRefBased, legacy comment exts |
| 5.3 | `pc` | `http://schemas.microsoft.com/office/powerpoint/2013/main/command` | `152_…2013-main-command-schema.md` | chgInfo, comment slide monikers |
| 5.4 | `p159` | `http://schemas.microsoft.com/office/powerpoint/2015/09/main` | `153_…2015-09-main-schema.md` | transition Choice (prstTrans era) |
| 5.5 | `p1510` | `http://schemas.microsoft.com/office/powerpoint/2015/10/main` | `154_…2015-10-main-schema.md` | Revision Information part (`revInfo`) |
| 5.6 | `p15m` | `http://schemas.microsoft.com/office/powerpoint/2015/main` | `155_…2015-main-schema.md` | designElem |
| 5.7 | `p166` | `http://schemas.microsoft.com/office/powerpoint/2016/6/main` | `156_…2016-6-main-schema.md` | zoom `zmPr` |
| 5.8 | `p16` | `http://schemas.microsoft.com/office/powerpoint/2016/sectionzoom` | `157_…2016-sectionzoom-schema.md` | sectionZm |
| 5.9 | `p16` | `http://schemas.microsoft.com/office/powerpoint/2016/slidezoom` | `158_…2016-slidezoom-schema.md` | sldZm |
| 5.10 | `p16` | `http://schemas.microsoft.com/office/powerpoint/2016/summaryzoom` | `159_…2016-summaryzoom-schema.md` | summaryZm |
| 5.11 | `p1710` | `http://schemas.microsoft.com/office/powerpoint/2017/10/main` | `160_…2017-10-main-schema.md` | readonlyRecommended |
| 5.12 | `p173` | `http://schemas.microsoft.com/office/powerpoint/2017/3/main` | `161_…2017-3-main-schema.md` | (reserved / imported by 2010 schema) |
| 5.13 | `p184` | `http://schemas.microsoft.com/office/powerpoint/2018/4/main` | `162_…2018-4-main-schema.md` | classification |
| 5.14 | `p188` | `http://schemas.microsoft.com/office/powerpoint/2018/8/main` | `163_…2018-8-main-schema.md` | authorLst, cmLst |
| 5.15 | `p199c` | `http://schemas.microsoft.com/office/powerpoint/2019/9/main/command` | `164_…2019-9-main-command-schema.md` | cmMkLst |
| 5.16 | `p2020` | `http://schemas.microsoft.com/office/powerpoint/2020/02/main` | `165_…2020-02-main-schema.md` | designPr, designTagLst |
| 5.17 | `p2203` | `http://schemas.microsoft.com/office/powerpoint/2022/03/main` | `166_…2022-03-main-schema.md` | reactions |
| 5.18 | `p2206c` | `http://schemas.microsoft.com/office/powerpoint/2022/06/main/command` | `167_…2022-06-main-command-schema.md` | cmChg |
| 5.19 | `p2208` | `http://schemas.microsoft.com/office/powerpoint/2022/08/main` | `168_…2022-08-main-schema.md` | taskDetails |
| 5.20 | `p2302` | `http://schemas.microsoft.com/office/powerpoint/2023/02/main` | `169_…2023-02-main-schema.md` | phTypeExt |

Additional namespaces used by this profile but **not** in Appendix A:

| Prefix | Namespace | Role |
|---|---|---|
| `mc` | `http://schemas.openxmlformats.org/markup-compatibility/2006` | Ignorable / AlternateContent |
| `p16` (morph) | `http://schemas.microsoft.com/office/powerpoint/2016/main` | `p16:morph` (§2.6.1.1) |
| `a14` | `http://schemas.microsoft.com/office/drawing/2010/main` | OMML `a14:m` |
| `m` | `http://schemas.openxmlformats.org/officeDocument/2006/math` | OMML |
| `we` | `http://schemas.microsoft.com/office/webextensions/webextension/2010/11` | Office App Choice |
| `p13app` | `http://schemas.microsoft.com/office/powerpoint/2013/contentapp` | Office App Choice |
| `inkAction` | `http://schemas.microsoft.com/office/powerpoint/2014/inkAction` | Ink Choice ([MS-ODRAWXML]) |

---

## 3. Part enumerations (§2.1)

New parts this profile must honor when the matching extension is emitted.

| Part | Content type | Root NS / element | Relationship | Cardinality | TargetMode | Outbound rels |
|---|---|---|---|---|---|---|
| Media | ISO/IEC 29500 audio/video types | (binary) | `http://schemas.microsoft.com/office/2007/relationships/media` | 0..n; explicit from Slide / Layout / Master | Internal or External | **none** |
| Revision Information | `application/vnd.ms-powerpoint.revisioninfo+xml` | 2015/10/main `revInfo` | `http://schemas.microsoft.com/office/2015/10/relationships/revisionInfo` | **0..1**; implicit from Presentation | **Internal** | **none** |
| Track | `text/vtt` | (WebVTT text) | `http://schemas.microsoft.com/office/2017/04/relationships/track` | 0..n; explicit from Slide / Layout / Master | Internal or External | **none** |
| Changes Information | `application/vnd.ms-powerpoint.changesinfo+xml` | 2013/main/command `chgInfo` | `http://schemas.microsoft.com/office/2016/11/relationships/changesInfo` | **0..1**; implicit from Presentation | **Internal** | **none** |
| Comment (modern) | `application/vnd.ms-powerpoint.comments+xml` | 2018/8/main `cmLst` | `http://schemas.microsoft.com/office/2018/10/relationships/comments` | 0..n; **explicit from Slide** | **Internal** | (slide monikers only) |
| Author (modern) | `application/vnd.ms-powerpoint.authors+xml` | 2018/8/main `authorLst` | `http://schemas.microsoft.com/office/2018/10/relationships/authors` | **0..1**; implicit from Presentation | **Internal** | **none** |

---

## 4. Extension catalog

Columns match the #86 ask. **Office fixture** is the named semantic test today plus the Office open/save proof still required for “Office-proven”.

| ID | Spec | Status | Issue | Namespace | Wrapper | Part / content type / rel | API | Package contract | Office fixture |
|---|---|---|---|---|---|---|---|---|---|
| `transition-modern` | §2.2.1 | supported | #82 | p14 / p15 / p16 (2016/main for morph) | **AlternateContent** + root `mc:Ignorable` | Slide part; ECMA slide CT + slide rel | `slide.addTransition({ type, duration })` | Choice modern transition; Fallback ECMA `p:transition`; optional `p14:dur` | `test/issues.test.ts` `#transition:*`. Office: morph+fade survive save |
| `animation-timing` | §2.2.2 | partial | #82 | p14 | **AlternateContent** | Slide `p:timing` | existing animation APIs | Choice MAY add `bmkTgt` / `bounceEnd`; current emit is ECMA timing | animation e2e; bounceEnd fixture with #83 |
| `content-part` | §2.2.3 | planned | **#87** | p14 | **AlternateContent** | Slide + content-part rel | planned `addContentPart` | Choice `contentPart` (`nvContentPartPr`, `xfrm`); Fallback **`p:sp`** | planned `content-part.roundtrip.pptx` |
| `ink` | §2.2.3.1 | planned | **#87** | p14 + inkAction | **AlternateContent** | Slide + ink part | planned `addInk` | Choice ink `contentPart`; Fallback **`p:pic`** | planned `ink.roundtrip.pptx` |
| `media-part` | §2.1.1 | supported | — | (binary) + p14 host | **extLst** `{DAA4B4D4-…}` | `ppt/media/*`; office/2007/relationships/media; Internal\|External | `addMedia` | Explicit rel from Slide/Layout/Master; no outbound rels | `#gap6`, coverage-objects; Office: media plays |
| `media-p14` | §2.2.4 | supported | — | p14 | **extLst** `{DAA4B4D4-…}` | `nvPr` on slide | `addMedia({ trim, fade, bookmarks })` | `p14:media` children; `r:embed` must resolve | `#gap6`. Office: trim/fade/bookmarks survive |
| `media-show-controls` | §2.2.4 | planned | — | p14 | **extLst** `{2FDB2607-…}` | `presProps` / `showPr` | planned `pptx.showMediaCtrls` | Opt-in; unset does not change presProps | planned `show-media-ctrls.roundtrip.pptx` |
| `media-tracks` | §2.1.3 / §2.2.4 | planned | — | p14 + `text/vtt` | **extLst** `{3AFAAA56-…}` | Track part; office/2017/04/relationships/track | planned `addMedia({ tracks })` | Explicit rel; no outbound rels | planned `media-tracks.roundtrip.pptx` |
| `narration` | §2.2.14 | supported | — | p15 | **extLst** `{42D2F446-…}` | `nvPr` on media | `addMedia({ isNarration })` | `p15:isNarration val="1"` | `#gap6` |
| `sections` | §2.2.5 | supported | **#88** | p14 | **extLst** `{521415D9-…}` | `ppt/presentation.xml` | `pptx.addSection({ title })` | `sectionLst`; stable GUID; `sldId` is ST_SlideId | zoom tests (GUID). Office: section pane |
| `slideshow-browse` | §2.2.6 | planned | **#89** | p14 | **extLst** `{F99C55AA-…}` | `presProps` `showPr` | planned `pptx.browseMode` | Opt-in | planned `browse-mode.roundtrip.pptx` |
| `slideshow-laser-color` | §2.2.6 | planned | **#89** | p14 | **extLst** `{EC167BDD-…}` | `presProps` `showPr` | planned `pptx.laserColor` | `laserClr` is `a:CT_Color` | planned `laser-color.roundtrip.pptx` |
| `slideshow-laser-trace` | §2.2.6 | planned | **#89** | p14 | **extLst** `{3A86A75C-…}` | `sld` extLst | planned (usually omit) | Recorded traces; generators MAY skip | planned preserve-on-round-trip |
| `slideshow-events` | §2.2.6 | planned | **#89** | p14 | **extLst** `{E180D4A7-…}` | `sld` extLst | planned `slide.showEvents` | Opt-in | planned `show-events.roundtrip.pptx` |
| `image-default-dpi` | §2.2.7 | supported | **#89** | p14 | **extLst** `{D31A062A-…}` | `presProps` | `pptx.defaultImageDpi` | Emit only when `> 0` | `#gap4` |
| `image-discard-edit` | §2.2.7 | supported | **#89** | p14 | **extLst** `{E76CE94A-…}` | `presProps` | `pptx.discardImageEditData` | Emit only when true | `#gap4` (set path) |
| `math-omml` | §2.2.8 | supported | #77 | a14 + m | **AlternateContent** / `a14:m` | slide text | math / `omml` runs | Bare `m:oMath` is stripped; wrap `a14:m` | PowerPoint 16 COM (see `src/xml/text.ts`) |
| `revision-info-part` | §2.1.2 | planned | **#90** | 2015/10/main | part + Internal rel | `revisioninfo+xml` / `…/revisionInfo` | planned `pptx.revisionInfo` | **0..1**; implicit from Presentation; no outbound rels; root `revInfo` | planned `revision-info.roundtrip.pptx` |
| `changes-info-part` | §2.1.4 | planned | **#90** | pc | part + Internal rel | `changesinfo+xml` / `…/changesInfo` | planned `pptx.changesInfo` | **0..1**; implicit; Internal; root `chgInfo`; no outbound rels | planned `changes-info.roundtrip.pptx` |
| `change-mod-id` | §2.2.9 | partial | **#90** | p14 | **extLst** `{D42A27DB-…}` | `nvPr` | none (hardcoded on some tables) | MUST be unique per slide; #90 replaces the constant | planned uniqueness + Office reshape |
| `change-creation-id` | §2.2.9 | planned | **#90** | p14 | **extLst** `{BB962C8B-…}` | `cSld` | planned `slide.creationId` | Opt-in | planned `creation-id.roundtrip.pptx` |
| `comments-author-part` | §2.1.6 | supported | **#91** | p188 | part + Internal rel | `authors+xml` / `…/2018/10/…/authors` | `pptx.commentAuthors` | **0..1**; implicit; root `authorLst`; no outbound rels | `#gap5`. Office: authors pane |
| `comments-comment-part` | §2.1.5 | supported | **#91** | p188 | part + Internal rel | `comments+xml` / `…/2018/10/…/comments` | `slide.addComment` | Explicit from Slide; root `cmLst`; `pc:sldMkLst` + `replyLst` | `#gap5`. Office: thread+reply |
| `comments-comment-rel` | §2.2.10 | planned | **#91** | p188 | **extLst** `{6950BFC3-…}` | `sld` extLst | auto with `addComment` | `commentRel` rId MUST match the comments rel | planned `#gap5` extension |
| `comments-presence` | §2.2.10 | planned | **#91** | p15 | **extLst** `{19B8F6BF-…}` | legacy `cmAuthor` | only if legacy authors are kept | Do not mix with p188 unless Office requires both | planned if legacy path exists |
| `comments-threading` | §2.2.10 | planned | **#91** | p15 | **extLst** `{C676402C-…}` | legacy `p:cm` | n/a on p188 (`replyLst`) | Modern path does not use this | planned if legacy path exists |
| `comments-changes` | §2.18–2.19 | planned | **#91** | p2206c + p199c | part / ext | Changes Info + `cmChg` / `cmMkLst` | planned opt-in change log | Depends on #90 Changes part | planned `comment-changes.roundtrip.pptx` |
| `comments-tasks` | §2.20 | planned | **#91** | p2208 | **extLst** | comment/task host | planned `comment.task` | Opt-in; no empty lists | planned `tasks.roundtrip.pptx` |
| `comments-reactions` | §2.21 | planned | **#91** | p2203 | **extLst** | parent extLst | planned `comment.reactions` | Opt-in; no empty lists | planned `reactions.roundtrip.pptx` |
| `guides-slide` | §2.2.11 | partial | **#88** | p15 | **extLst** `{EFAFB233-…}` | `presentation.xml` | `pptx.guides` | `pos` EMU; required `p15:clr`. Other hosts (layout/master/handout/notes) have **different URIs** — not emitted yet | `#gap3`. Office: ruler guides |
| `guides-notes` | §2.2.11 | planned | **#88** | p15 | **extLst** `{2D200454-…}` | `presentation.xml` | planned `pptx.notesGuides` | `notesGuideLst` | planned `notes-guides.roundtrip.pptx` |
| `chart-tracking` | §2.2.12 | planned | **#93** | p15 | **extLst** `{FD5EFAAD-…}` | `presProps` | planned `pptx.chartTrackingRefBased` | Opt-in; unset MUST NOT change chart XML | planned `chart-tracking.roundtrip.pptx` |
| `office-app` | §2.2.13 | planned | **#87** | we + p13app | **AlternateContent** | slide + [MS-OWEXML] webextension part | planned `addWebExtension` | Fallback **`p:pic`**; validate webextension rels | planned `office-app.roundtrip.pptx` |
| `zoom-slide` | §2.2.15 / §2.10 | supported | **#88** | 2016/slidezoom | **AlternateContent** | slide + cover image rel | `slide.addZoom` | Choice `sldZm`; Fallback **`p:pic`**; `sldId` | issues zoom test. Office: click-through |
| `zoom-section` | §2.2.15 / §2.9 | supported | **#88** | 2016/sectionzoom | **AlternateContent** | slide + cover image rel | `slide.addSectionZoom` | `sectionId` == section GUID; Fallback **`p:pic`** | issues section GUID. Office: section nav |
| `zoom-summary` | §2.2.15 / §2.11 | supported | **#88** | 2016/summaryzoom | **AlternateContent** | slide + cover image rel | `slide.addSummaryZoom` | required `gridLayout`\|`fixedLayout`; Fallback **`p:grpSp`** | semantic summary-zoom. Office: layout choice |
| `view-readonly` | §2.2.16 | supported | **#89** | p1710 | **extLst** `{1BD7E111-…}` | `presProps` | `pptx.readonlyRecommended` | Emit only when true | `#gap4`. Office: read-only prompt |
| `design-elem` | §2.2.17 | planned | **#92** | 2015/main | **extLst** `{386F3935-…}` | `nvPr` | planned opt-in | Designer flag | planned `design-elem.roundtrip.pptx` |
| `classification` | §2.2.18 | planned | **#92** | 2018/4/main | **extLst** `{1162E1C5-…}` | `nvPr` | planned **opt-in only** | MUST NOT default on | planned `classification.roundtrip.pptx` |
| `designer-props` | §2.2.19 | planned | **#92** | 2020/02/main | **extLst** `{E7BDC344-…}` | `nvPr` | planned opt-in | `designPr` | planned `design-pr.roundtrip.pptx` |
| `designer-tags` | §2.2.20 | planned | **#92** | 2020/02/main | **extLst** `{E3EDB536-…}` | `sldId` extLst | planned opt-in | On **sldId**, not nvPr | planned `design-tags.roundtrip.pptx` |
| `placeholder-type-ext` | §2.22 | planned | **#92** | 2023/02/main | **extLst** | typically slideLayout `p:ph` | planned opt-in | Unset keeps ECMA `ph@type` | planned `ph-type-ext.roundtrip.pptx` |

Guide host URIs not yet emitted (still #88):

| Host | URI |
|---|---|
| `sldLayout` | `{DCECCB84-F9BA-43D5-87BE-67443E8EF086}` |
| `sldMaster` | `{27BBF7A9-308A-43DC-89C8-2F10F3537804}` |
| `handoutMaster` | `{56416CCD-93CA-4268-BC5B-53C4BB910035}` |
| `notesMaster` | `{620B2872-D7B9-4A21-9093-7833F8D536E1}` |

---

## 5. Child issues (#87–#93)

Do **not** implement these in #86.

| Issue | Title | Catalog IDs | Notes |
|---|---|---|---|
| [#87](https://github.com/NeomaVerwaltung/PptxGenJS/issues/87) | Content-part, ink, Office App | `content-part`, `ink`, `office-app` | Mandated Fallbacks: **sp** / **pic** / **pic**. Validate package rels + [MS-OWEXML] webextensionref. |
| [#88](https://github.com/NeomaVerwaltung/PptxGenJS/issues/88) | Sections, guides, Zoom | `sections`, `guides-slide`, `guides-notes`, `zoom-*` | Sections + three zooms + presentation `sldGuideLst` already emit. Remaining: notes guides, other-host guide URIs, typed completeness. |
| [#89](https://github.com/NeomaVerwaltung/PptxGenJS/issues/89) | Slide-show, image, view-mode | `slideshow-*`, `image-*`, `view-readonly` | Image DPI / discard / readonly already emit. Remaining: browse / laser / events. |
| [#90](https://github.com/NeomaVerwaltung/PptxGenJS/issues/90) | Revision + change tracking | `revision-info-part`, `changes-info-part`, `change-mod-id`, `change-creation-id` | Enforce 0..1, Internal, no outbound rels. Replace hardcoded table `modId`. |
| [#91](https://github.com/NeomaVerwaltung/PptxGenJS/issues/91) | Authors, comments, collaboration | `comments-*` | Modern `authorLst`/`cmLst` already emit. Remaining: `commentRel`, tasks, reactions, cmChg; legacy presence/threading only if needed. |
| [#92](https://github.com/NeomaVerwaltung/PptxGenJS/issues/92) | Design, classification, phTypeExt | `design-elem`, `classification`, `designer-props`, `designer-tags`, `placeholder-type-ext` | Classification **MUST** stay opt-in. |
| [#93](https://github.com/NeomaVerwaltung/PptxGenJS/issues/93) | Chart tracking reference | `chart-tracking` | URI `{FD5EFAAD-0ECE-453E-9831-46B23BE46B34}` on `presentationPr`. Unset = no chart XML change. |

Unassigned planned rows (`media-show-controls`, `media-tracks`) are in the matrix so the 25.0 surface is complete; they are not #87–#93 work.

---

## 6. Office round-trip fixture policy

A row is **Office-proven** only when all of the following pass:

1. **Semantic package contract** — `[Content_Types].xml` Override (if a new part), relationship Type + TargetMode, root element / namespace, and the required MC wrapper (URI or Choice/Fallback) match this matrix.
2. **Schema** — emitted elements/attributes exist in the Appendix A file listed for that namespace.
3. **Office open/save** — PowerPoint (or `npm run test:office` / COM) opens the deck, the feature is visible, and a save does not drop the extension or the Fallback.

Existing semantic fixtures live in `test/issues.test.ts` (`#transition:*`, `#gap3`–`#gap6`, zoom). The shared LibreOffice smoke test (`test/office-open.test.ts`) is **not** a per-extension proof.

Planned per-row artifacts: `test/fixtures/ms-pptx/<id>.roundtrip.pptx` (checked in or generated by the child issue).

---

## 7. Status counts

| Status | Count | Meaning |
|---|---|---|
| supported | 14 | Public API + semantic test |
| partial | 3 | `animation-timing`, `change-mod-id`, `guides-slide` |
| planned | 25 | Child issue or unassigned |

Source of counts: `MS_PPTX_EXTENSIONS` in `src/ms-pptx-profile.ts` (42 rows).
