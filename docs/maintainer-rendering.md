---
title: Rendering Architecture
---

# Rendering Architecture

This guide is for maintainers changing the code that serializes a presentation into a `.pptx` package. It documents the responsibilities, ordering rules, and validation strategy for the XML, chart, media, and table renderers. It is not public API documentation: use the [API reference](./api-text) when changing an option exposed to library users.

## The one rule that matters

The renderer has observable behavior beyond its TypeScript return types. XML element order, relationship IDs, package part names, and selected mutations of internal rendering objects are all part of the generated OOXML contract. A refactor must preserve them unless the change deliberately fixes a compatibility defect and has a regression test.

Do not rewrite a renderer while splitting it. Extract its existing sequential phases into helpers, keep the public entry point as the orchestration layer, and preserve the order of calls and object mutations.

## Export pipeline

`PptxGenJS.exportPresentation()` in `src/pptxgen.ts` owns the top-level sequence:

```text
Presentation and slides
        |
        +-- encode media relations
        |     +-- load local/remote/browser media bytes
        |     +-- propagate duplicate media data
        |
        +-- size images with no w/h from loaded bytes
        +-- add missing layout placeholders
        |
        +-- create package folders and static OOXML parts
        +-- serialize slides, layouts, master, relationships, charts, and media
        |     +-- chart serialization creates embedded XLSX workbooks
        |
        +-- JSZip emits the requested Buffer/Blob/base64/stream
```

The media pass must finish before slide XML is built: an image with `_sizeFromImage` needs encoded bytes to calculate its final dimensions. Chart workbooks must be added before the final package is emitted because chart XML refers to an embedded workbook relationship.

The stable public XML/chart entry points are re-exported by `src/xml/index.ts` and `src/charts/index.ts`. Keep those facades stable; private helpers belong beside the renderer they support.

## Source map

| Area | Public entry point | Primary output | Supporting helpers |
| --- | --- | --- | --- |
| Slide XML | `slideObjectToXml()` in `src/xml/slide.ts` | `p:cSld` content for slides, layouts, and masters | background, shape tree, objects, slide number, closing tags |
| Relationships | `makeXmlSlideRel()` and related functions in `src/xml/relationships.ts` | `.rels` parts | dynamic slide/chart/media relations plus default relations |
| Package XML | `makeXml*()` functions in `src/xml/package.ts` | content types, presentation, layouts, master, notes, metadata | delegates slide bodies to `slideObjectToXml()` |
| Media | `encodeSlideMediaRels()` in `src/gen-media.ts` | base64 data on media relationships | candidate selection, duplicate propagation, Node file/HTTP and browser loaders, SVG preview generation |
| Tables | `getSlidesForTableRows()` in `src/gen-tables.ts` | paginated internal table-row models | margin, width, column, height, and row-pagination calculations |
| Chart XML | `makeXmlCharts()` in `src/charts/xml.ts` | `ppt/charts/chart*.xml` | chart-space start, chart types, axes, plot area/legend, chart-space end |
| Chart workbook | `createExcelWorksheet()` in `src/charts/workbook.ts` | embedded `.xlsx` and chart relationship parts | folders, fixed package files, shared strings, table XML, worksheet XML, final embedding |

## Slide XML

`slideObjectToXml(slide)` produces the body of a slide-like part. The order is intentional:

1. `genXmlSlideBackground()` writes one background representation. An image background takes precedence over a color; the default master layout gets the scheme-colour background used by Keynote and Finder previews.
2. `genXmlSlideTreeStart()` emits the required group shape tree and its non-visual/group properties.
3. `genXmlSlideObjects()` serializes `_slideObjects` in insertion order. It also retains the historical internal contract of assigning a normalized `options` object back to each stored slide object before type-specific rendering.
4. `genXmlSlideNumber()` appends the slide-number placeholder last, if configured.
5. `genXmlSlideEnd()` closes `p:spTree` and `p:cSld`.

The object phase owns the table counter and the non-visual object IDs. Do not move a shape, table, chart, image, or media object into a separate pass unless every affected ID and relationship ordering rule is explicitly preserved.

### Geometry and placeholders

`resolveSlideObjectContext()` resolves `x`, `y`, `w`, `h`, flips, rotation, image dimensions, and placeholder geometry before the type switch. Placeholder geometry overrides regular object geometry, but image source dimensions are captured first because image sizing and placeholder layout are different concerns.

Text and shape output may normalize the internal `_bodyProp` object for margins. Table-cell rendering expands `colspan` and `rowspan` into an actual grid and inherits selected table options into cell options. These mutations are established rendering behavior; do not replace them with cloned data without verifying repeated export and auto-pagination behavior.

### Slide compatibility constraints

- Keep `p:cNvPr` IDs numeric and stable for the emitted order. Invalid IDs can produce a PowerPoint repair prompt.
- Every `r:id`, `r:embed`, and `r:link` in slide XML must have a matching relationship in the corresponding `.rels` part.
- Table style flags only render when the table properties are structurally valid. Empty table properties are still emitted deliberately.
- Slide-number output depends on master/layout/slide compatibility, not only the individual slide XML.
- Escape caller-provided XML text and attributes through the existing XML helpers.

## Media encoding

`encodeSlideMediaRels(layout)` returns the promises the export pipeline waits on. It does not itself await them because the caller aggregates all media work across slides, layouts, and the master.

The helper sequence is:

1. `getMediaCandidates()` excludes online and already-encoded/preencoded relations.
2. `markDuplicateMedia()` marks repeated source paths so one relation loads bytes and `copyMediaToDuplicates()` propagates the result to the others.
3. `encodeMediaRelation()` selects the runtime path:
   - `readNodeMediaFile()` for Node paths that do not begin with `http`;
   - `loadNodeMediaUrl()` for Node HTTP(S) sources;
   - `loadBrowserMedia()` for browser requests.
4. Any failed load calls `markMediaBroken()` before rejecting, so duplicates receive the same sentinel state.
5. `addSvgPreviewPromises()` handles the preview relation required for SVG images. Node intentionally marks previews as broken because it cannot rasterize SVG in this path; browsers use `createSvgPngPreview()`.

### Media invariants

- Start Node built-in imports only in Node. Browser bundles must not execute Node file/network paths.
- Preserve `IMG_BROKEN` on every failure path; downstream packaging relies on it.
- Preserve zeros and empty source data as distinct values. Do not replace explicit checks with a broad truthiness check.
- Keep SVG-preview promises appended synchronously. The caller snapshots the returned array immediately.
- `applyNaturalImageSizes()` runs only after encoding. It is best-effort: unreadable image data leaves the existing 1×1 inch default unchanged.

## Table pagination

`getSlidesForTableRows()` transforms normalized table cells into `TableRowSlide[]` instances for auto-paging. It intentionally mutates `tableProps`: defaulting `slideMargin`, materializing `colW`, and passing `autoPageCharWeight` into cell options are part of the established flow.

Its phases are:

1. Parse table dimensions in EMUs and log them when debug mode is enabled.
2. Resolve margins, preferring a master-slide margin over table options.
3. Count columns with `colspan` support, derive a total width, and materialize missing column widths.
4. `paginateTableRows()` converts each cell to wrapped lines, computes row height including margins, and moves work to another slide only when the next line no longer fits.
5. On continuation slides, `getAvailableTableHeight()` applies the configured start position/margins and repeated header rows are added before remaining content.

### Table invariants

- Cell margins support legacy point-like values as well as inch values. Preserve that compatibility rule.
- A `rowspan` cell does not add its normal line height while calculating overflow.
- Empty cell content still needs a valid empty table cell in the XML; omitting it can lead to a repair prompt.
- Repeated headers consume height on every continuation slide.
- Auto-paging one table must not move sibling tables; this is covered by a regression test.

## Chart XML and embedded workbooks

`makeXmlCharts(rel)` is the chart-XML orchestrator. Its five helpers write contiguous OOXML regions in this fixed order:

1. `makeChartSpaceStart()` writes `c:chartSpace`, title/auto-title state, optional 3D view, and `c:plotArea` plus layout.
2. `makeChartTypes()` writes one or more chart-type blocks and reports whether any multi-chart series uses the secondary value axis.
3. `makeChartAxes()` validates multi-chart axis configuration, writes category/value axes, and adds a 3D series axis when required.
4. `makePlotAreaAndLegend()` completes the plot area and appends data-table, fill, border, and legend output.
5. `makeChartSpaceEnd()` writes chart-level display settings, chart-area styling, the embedded-workbook relationship, and closes the document.

`createExcelWorksheet(chartObject, zip)` constructs the `.xlsx` chart data source in a separate `JSZip` before adding it to the presentation zip. Its helpers are deliberately organized by workbook part:

- `addWorkbookFolders()` creates the required archive directories.
- `addCoreWorkbookFiles()` writes fixed package metadata, styles, theme, workbook, and relationship parts.
- `addSharedStringsFile()` creates the shared-string table, including series names and category labels.
- `addTableFile()` defines the worksheet table metadata and range.
- `addWorksheetFile()` writes chart values, including bubble, scatter, normal category, and multi-level category layouts.
- `addWorkbookToPresentation()` generates the nested archive, adds it beneath `ppt/embeddings/`, creates the chart `.rels` part, and emits the chart XML.

### Chart and workbook invariants

- The chart XML's external-data `rId1` must match the chart relationship written beside the chart file.
- Multi-type charts require matching category/value axis arrays and a declared secondary-axis user when multiple value axes are present.
- Bubble, scatter, normal category, and multi-level category sheets intentionally have different ranges and shared-string layouts.
- Preserve numeric zero values. `0` is chart data, not absence.
- Multi-level category labels have explicit shared-string indexes and vertical merge ranges. Changes here require embedded-XLSX contract coverage.
- Do not import implementation modules through their facade index; that can reintroduce circular dependencies.

## Relationships and package validity

The package is more than a collection of XML strings. Changes to slide, chart, or media output must preserve these cross-part links:

```text
slide XML --r:id/r:embed/r:link--> slide .rels --Target--> chart, media, layout, notes, or hyperlink
chart XML --externalData rId1--> chart .rels --Target--> embedded XLSX
[Content_Types].xml ----------- declares -----------> every package part's content type
```

`test/pptx-contracts.ts` validates well-formed XML, required package parts, content-type declarations, unique relationship IDs, relationship targets, and every referenced relationship ID. Feature assertions belong beside the test that builds the relevant object rather than in a whole-file XML snapshot.

## Safe change procedure

1. Trace from the public add-method through object construction, the renderer, relationships, and package creation. Search every caller before changing a shared helper.
2. State the behavior being preserved or changed. For a refactor, the answer should be “same output and mutation order.”
3. Extract only a complete sequential phase with clear inputs and outputs. Keep its helper private unless another module genuinely needs it.
4. Preserve the original call order in the public orchestrator. Avoid opportunistic formatting, naming, or algorithm changes in the same patch.
5. Add a semantic regression test when behavior changes or existing coverage does not exercise the branch. Prefer assertions about OOXML semantics, relationships, or embedded-XLSX structure to serialized snapshots.
6. Run the checks below. If available, also open the resulting file in a real Office consumer before release.

## Verification

Run the standard pre-merge check for every renderer change:

```bash
npm run check
npm run build
git diff --check
```

`npm run check` runs ESLint, TypeScript type checking, and the unit/end-to-end/package-contract suite. `npm run build` verifies that the browser, CommonJS, and ESM bundles can be produced. These checks do not replace real Office-consumer validation.

For release-level confidence on a machine with LibreOffice installed:

```bash
PPTXGENJS_OFFICE_BIN="$(command -v libreoffice || command -v soffice)" npm run test:office
```

See the repository [Testing guide](https://github.com/NeomaVerwaltung/PptxGenJS/blob/master/TESTING.md) for the manual Node, Vite, Webpack, and Office verification procedures. If PowerPoint displays a repair prompt, start with the [Needs Repair Errors](./needs-repair-errors) guide and then inspect the package relationships and content types before changing rendering code.

## Ownership boundaries

- Keep public user behavior, option definitions, and examples in API/usage documentation.
- Keep internal renderer structure, OOXML ordering, and verification rules in this guide.
- Keep reusable OOXML element builders in their focused modules (`src/xml/text.ts`, `src/xml/slide.ts`, `src/charts/axes.ts`, `src/charts/title.ts`, and `src/charts/utils.ts`).
- Keep package-level assembly in `src/pptxgen.ts`, `src/xml/package.ts`, and `src/xml/relationships.ts`.

When a renderer grows again, split at these documented phase boundaries. Do not add a wrapper that merely forwards the whole method; the helper should own a coherent OOXML region or a complete data-preparation step.
