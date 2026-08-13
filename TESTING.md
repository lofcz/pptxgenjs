# Testing Guide

This document describes how to manually verify PptxGenJS across supported platforms and environments prior to a release.

The automated suite (`npm run check`) covers linting, type checks, and unit/e2e/package-contract tests. The manual steps below validate real runtimes and bundlers.

## LibreOffice consumer test

On a release machine with LibreOffice installed, run:

```bash
PPTXGENJS_OFFICE_BIN="$(command -v libreoffice || command -v soffice)" npm run test:office
```

It opens a generated presentation and converts it to PDF, failing if the OOXML
cannot be consumed. CI runs this on every pull request; it stays separate from
`npm run check` so normal contributors do not need an office suite installed.

> **Note:** the checked-in `demos/` workspace was removed (issue #8). The manual tests below scaffold a throwaway
> project per platform instead, so nothing has to be kept current in this repository. Demos may return later in a
> form that carries no third-party assets.

Procedure:

1. Run `npm run ship`.
2. Execute the tests in each section below.

## Test suite overview

| Platform        | Tooling              |
| --------------- | -------------------- |
| Node.js         | Native CLI           |
| Vite/TypeScript | Modern front-end SPA |
| Webpack         | SharePoint Framework |

## Node.js tests

Purpose: validate the CommonJS build in a pure Node environment.

```bash
mkdir /tmp/pptxgenjs-node-test && cd /tmp/pptxgenjs-node-test
npm init -y
npm install /path/to/this/repo   # installs @neo-ma/pptxgenjs from the local checkout
```

Create `demo.cjs`:

```js
const pptxgen = require('@neo-ma/pptxgenjs')
const pptx = new pptxgen()
const slide = pptx.addSlide()
slide.addText('Node CJS smoke test', { x: 1, y: 1, w: 6, h: 1, fontSize: 24, color: '0088CC' })
slide.addChart(pptx.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [10, 20] }], { x: 1, y: 2.5, w: 6, h: 3 })
slide.addTable([['A', 'B'], ['1', '2']], { x: 1, y: 6, w: 6 })
pptx.writeFile({ fileName: 'node-test.pptx' }).then(name => console.log(`wrote ${name}`))
```

1. Run `node demo.cjs` and confirm the console output.
2. Open `node-test.pptx` in PowerPoint: it must open without a repair prompt and render correctly.

### Stream test

Swap the write call for `pptx.stream()` and serve the returned buffer from a small HTTP handler.

1. Confirm the streamed PPTX download is correct.
2. Open the stream URL on a mobile device and verify the download.

## Vite + TypeScript tests

Purpose: validate integration with modern front-end toolchains (Vite, TypeScript, React-compatible).

No Vite application is checked in, as a pinned SPA becomes outdated between releases. Scaffold a fresh application and link this repository:

```bash
npm create vite@latest pptxgenjs-vite-test -- --template react-ts
cd pptxgenjs-vite-test
npm install
npm install /path/to/this/repo   # installs @neo-ma/pptxgenjs from the local checkout
npm run dev
```

1. In a component, `import pptxgen from "@neo-ma/pptxgenjs"` and export a test slide.
2. Verify that IntelliSense autocompletes, for example, `pptxgen.ChartType.` (types resolve correctly).
3. Export a PowerPoint file and confirm it renders correctly.
4. Delete the scaffold when finished; nothing is retained.

## Completion checklist

Record the result of each test before release:

| Dist File      | Test      | Tested Via             | Result |
| -------------- | --------- | ---------------------- | ------ |
| pptxgen.es.js  | Webpack 4 | SPFx (v1.16.1) project |        |
| pptxgen.es.js  | Webpack 5 | SPFx (v1.19.1) project |        |
| pptxgen.es.js  | Rollup 4  | Vite (v6) scaffold     |        |
| pptxgen.cjs.js | Node/CJS  | Node scaffold          |        |
