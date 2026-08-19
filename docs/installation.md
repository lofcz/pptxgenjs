---
title: Installation
---

Install **pptxgenjs** using one of the following methods.

### Quick Install (Node-based)

```bash
npm install pptxgenjs-plus
```

```bash
yarn add pptxgenjs-plus
```

### JSX (optional)

The workspace package `pptxgenjs-plus-jsx` wraps this library in a declarative JSX tree (`<Deck>`, `<Slide>`, `<Text>`, charts, shapes, …). From this repo it is already linked via Bun workspaces. From npm:

```bash
npm install pptxgenjs-plus pptxgenjs-plus-jsx
```

See `packages/pptxgenjs-jsx/README.md` for `jsxImportSource` setup and the component API.

### CDN (Browser Usage)

Use the bundled or minified version via [jsDelivr](https://www.jsdelivr.com/package/npm/pptxgenjs-plus):

```html
<script src="https://cdn.jsdelivr.net/npm/pptxgenjs-plus@4/dist/pptxgen.bundle.js"></script>
```

> Includes the sole dependency (JSZip) in one file.

> The CDN path resolves against the **npm** package. `dist/` is not committed to git, so a
> `cdn.jsdelivr.net/gh/...` path against this repository does not resolve.

Advanced: separate files, direct download.

```html
<script src="PptxGenJS/libs/jszip.min.js"></script><!-- @node-projects/jszip + pako 3 -->
<script src="PptxGenJS/dist/pptxgen.min.js"></script>
```

### Direct download

Every release attaches the built bundles as release assets, so no build toolchain is needed:

- `pptxgen.bundle.js` - library + JSZip in one file
- `pptxgen.min.js` - minified library (load JSZip separately)
- `pptxgen.cjs.js` / `pptxgen.es.js` - CommonJS and ES module builds

```bash
curl -LO https://github.com/lofcz/pptxgenjs-plus/releases/latest/download/pptxgen.bundle.js
```

Building from a git checkout also works: `bun ci` runs the build via the `prepare` script.

## Source Code and Examples

Download from GitHub: [Latest Release](https://github.com/lofcz/pptxgenjs-plus/releases/latest)
