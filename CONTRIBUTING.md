# Contributing

This document describes how to set up a development environment and submit changes to the NEOMA distribution of PptxGenJS. Contributions are welcome and reviewed by the maintainers.

## Development setup

Requires Node.js **24 or newer** (matches CI and the `engines` field).

```bash
npm ci        # install exact locked dependencies
npm run check # lint + typecheck + strict typecheck + tests — run before every PR
```

## Before opening a PR

`npm run check` must pass. It runs:

- `npm run lint` — ESLint
- `npm run typecheck` — full-project TypeScript (`strictNullChecks` is enabled)
- `npm test` — unit, e2e, and OOXML package-contract tests

Build the distributables locally with `npm run build` (or `npm run dist` for
the full minified/bundled `dist/` artifacts).

For a release candidate, also run `npm run test:office` on a machine with
LibreOffice installed and `PPTXGENJS_OFFICE_BIN` set to its executable.
The CI workflow performs this check on every pull request.

## Tests

Tests live in `test/`. When you change XML generation, add or update the
semantic contract that describes the intended OOXML behavior; no generated XML
fixtures need to be regenerated. Coverage can be inspected with `npm run test:coverage`.

## Type safety

`strictNullChecks` is enabled in `tsconfig.json` and enforced by
`npm run typecheck`. Keep new code null-safe; prefer real guards over
non-null assertions (`!`) except where a value is genuinely invariant.

## Coding style

Match the surrounding code. ESLint and the stylistic plugin enforce
formatting — run `npm run lint` and fix reported issues before pushing.
