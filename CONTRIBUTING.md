# Contributing

This document describes how to set up a development environment and submit changes to `pptxgenjs-plus`. Contributions are welcome and reviewed by the maintainers.

## Development setup

Requires [Bun canary](https://bun.sh) (`bun upgrade --canary`). Node.js 24+ is still accepted by consumers of the published package; this repository's scripts and CI use Bun only.

```bash
bun upgrade --canary
bun ci            # install exact locked dependencies
bun run check     # lint + typecheck + tests — run before every PR
```

## Before opening a PR

`bun run check` must pass. It runs:

- `bun run lint` — ESLint
- `bun run typecheck` — full-project TypeScript (`strictNullChecks` is enabled)
- `bun run test` — unit, e2e, and OOXML package-contract tests

Build the distributables locally with `bun run build` (or `bun run dist` for
the full minified/bundled `dist/` artifacts).

For a release candidate, also run `bun run test:office` on a machine with
LibreOffice installed and `PPTXGENJS_OFFICE_BIN` set to its executable.
The CI workflow performs this check on every pull request.

On Windows with Microsoft PowerPoint installed, `bun run test:powerpoint`
opens generated and deliberately broken decks in a hidden PowerPoint instance
and reports `ok` / `repair` / `reject`. Close any interactive PowerPoint window
first. A `repair` result includes `repairSummary` (the Office dialog
sentence). `packageDiff` is included when Repair leaves a living
presentation that can be saved and compared.

## Tests

Tests live in `test/`. When you change XML generation, add or update the
semantic contract that describes the intended OOXML behavior; no generated XML
fixtures need to be regenerated. Coverage can be inspected with `bun run test:coverage`.

## Type safety

`strictNullChecks` is enabled in `tsconfig.json` and enforced by
`bun run typecheck`. Keep new code null-safe; prefer real guards over
non-null assertions (`!`) except where a value is genuinely invariant.

## Coding style

Match the surrounding code. ESLint and the stylistic plugin enforce
formatting — run `bun run lint` and fix reported issues before pushing.
