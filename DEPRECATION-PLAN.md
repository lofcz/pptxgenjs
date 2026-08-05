# Deprecation & API-Cleanup Plan

Audit date: 2026-07-23 · Package version: 4.0.1

## Findings

### F1 — `compression: boolean` is a boolean trap
`WriteBaseProps.compression?: boolean` (src/core-interfaces.ts:1692) maps to a JSZip
strategy choice (`DEFLATE` vs `STORE`) in src/pptxgen.ts:563/569. A boolean can't
express compression *level* and reads as noise at call sites.

### F2 — Bug: compression silently ignored for explicit output types
`write({ outputType: 'base64', compression: true })` hits the middle branch at
src/pptxgen.ts:566, which calls `zip.generateAsync({ type })` **without** the
compression option. Only STREAM and the browser-blob default honor it.

### F3 — Deprecated union-typed method params (marked "remove in v4.0.0", still present)
- `write(props?: WriteProps | WRITE_OUTPUT_TYPE)` — string form deprecated v3.5.0
- `writeFile(props?: WriteFileProps | string)` — string form deprecated v3.5.0

### F4 — v4.0 deprecation cleanup never executed
~30 `@deprecated` aliases from v3.3–v3.11 remain in src/core-interfaces.ts plus
their runtime shims in src/gen-objects.ts (lines 332–334, 732–738, 1081):
`line` as color string, `lineSize/lineDash/lineHead/lineTail`, `bkgd`,
`autoFit/shrinkText` (→ `fit`), `inset` (→ `margin`), chart `border`/`fill`
(→ `plotArea.*`), `dashType` on old paths, bullet `code/startAt/style`, etc.

### F5 — Minor
- `strike?: boolean | 'dblStrike' | 'sngStrike'` — mixed bool/enum.
- `verbose?: boolean` on TableToSlidesProps — undocumented.
- Plain on/off booleans (`bold`, `flipH`, `showLegend`, …) are **fine**; leave them.

## Plan

### Phase 1 — bug fix (now, patch release)
Fix F2: pass the compression option in the explicit-outputType branch too, so all
three `zip.generateAsync` calls behave the same. One-line change + one test.

> **Status 2026-08-04**: Phase 1 shipped (PR #50). Phase 2 shipped: `pptx.compression`
> enum, per-call boolean deprecated with one-time warning, warn-once on all v3.x shims
> (`line` string, `lineSize/lineDash/lineHead/lineTail`, chart `border`/`fill`, `bkgd`,
> `strike: true`). Phase 3 remains for the next major. The breaking remainder of
> issue #29 (margin inches-vs-points, alignment vocab collapse) is folded into Phase 3.

### Phase 2 — deprecate, don't break (next minor)
1. Move compression to presentation-level config and kill the boolean in one move:
   `new PptxGenJS({ compression: 'none' | 'fast' | 'best' })` (maps to STORE /
   DEFLATE level 1 / DEFLATE level 9). Export methods stop growing options; the
   setting is document config like layout, not a per-call flag.
   Keep the old per-call `compression: boolean` working (`true` → `'best'`,
   overrides the constructor value) but mark it
   `@deprecated - set compression on the PptxGenJS constructor` and warn once.
2. Emit a single `console.warn` (once per process) when any deprecated alias from
   F3/F4 is used — today most shims are silent, so users have no migration signal.
3. Document `verbose` or mark it `@deprecated`.

### Phase 3 — removal (next major, v5.0)
1. Remove the per-call `compression` prop from `WriteBaseProps` entirely; the
   constructor enum is the only knob.
2. Remove string/union overloads of `write()` / `writeFile()` — options object only.
3. Delete all F4 aliases from interfaces and their shims in gen-objects.ts.
4. Normalize `strike` to enum-only (`'dblStrike' | 'sngStrike'`), map `true` removed.
5. Issue #29 remainder: standardize `margin` on inches everywhere (SlideNumberProps is
   points today), remove `BorderProps.pt`, collapse the alignment vocab to the public
   string unions and internalize `TEXT_HALIGN`/`TEXT_VALIGN`.
5. Ship a MIGRATION.md table: old prop → new prop (the `@deprecated` JSDoc tags
   already contain the mapping; generate the table from them).

### Non-goals
- Renaming the flat chart-axis namespace (`catAxisLabelFontBold`, …). It's ugly but
  pervasive, documented, and a rewrite would churn every chart user for zero
  functional gain. Revisit only if a chart-options overhaul is planned anyway.
