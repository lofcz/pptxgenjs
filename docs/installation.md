---
title: Installation
---

Install **PptxGenJS** using one of the following methods.

### Quick Install (Node-based)

```bash
npm install @neo-ma/pptxgenjs
```

```bash
yarn add @neo-ma/pptxgenjs
```

### CDN (Browser Usage)

Use the bundled or minified version via [jsDelivr](https://www.jsdelivr.com/package/npm/@neo-ma/pptxgenjs):

```html
<script src="https://cdn.jsdelivr.net/npm/@neo-ma/pptxgenjs@4/dist/pptxgen.bundle.js"></script>
```

> Includes the sole dependency (JSZip) in one file.

> The CDN path resolves against the **npm** package. `dist/` is not committed to git, so a
> `cdn.jsdelivr.net/gh/...` path against this repository does not resolve.

Advanced: separate files, direct download.

```html
<script src="PptxGenJS/libs/jszip.min.js"></script>
<script src="PptxGenJS/dist/pptxgen.min.js"></script>
```

### Direct download

Every release attaches the built bundles as release assets, so no build toolchain is needed:

- `pptxgen.bundle.js` - library + JSZip in one file
- `pptxgen.min.js` - minified library (load JSZip separately)
- `pptxgen.cjs.js` / `pptxgen.es.js` - CommonJS and ES module builds

```bash
curl -LO https://github.com/NeomaVerwaltung/PptxGenJS/releases/latest/download/pptxgen.bundle.js
```

Building from a git checkout also works: `npm ci` runs the build via the `prepare` script.

## Source Code and Examples

Download from GitHub: [Latest Release](https://github.com/NeomaVerwaltung/PptxGenJS/releases/latest)
