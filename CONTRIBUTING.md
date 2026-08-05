# Contributing

This document describes how to set up a development environment and submit changes to the NEOMA distribution of PptxGenJS. Contributions are welcome and reviewed by the maintainers.

## Development setup

Requires Node.js **20 or newer** (matches CI and the `engines` field).

```bash
npm ci        # install exact locked dependencies
npm run check # lint + typecheck + strict typecheck + tests — run before every PR
```

## Before opening a PR

`npm run check` must pass. It runs:

- `npm run lint` — ESLint
- `npm run typecheck` — full-project TypeScript (`strictNullChecks` is enabled)
- `npm test` — unit, e2e, and XML snapshot tests

Build the distributables locally with `npm run build` (or `npm run dist` for
the full minified/bundled `dist/` artifacts).

## Tests

Tests live in `test/`. When you change XML generation, update or add a
golden-file snapshot (`test/__snapshots__/`) and include the regenerated
snapshot in your PR. Coverage can be inspected with `npm run test:coverage`.

## Type safety

`strictNullChecks` is enabled in `tsconfig.json` and enforced by
`npm run typecheck`. Keep new code null-safe; prefer real guards over
non-null assertions (`!`) except where a value is genuinely invariant.

## Coding style

Match the surrounding code. ESLint and the stylistic plugin enforce
formatting — run `npm run lint` and fix reported issues before pushing.
