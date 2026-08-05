---
title: Universal Compatibility
---

PptxGenJS runs in **modern web and Node environments**. Dual ESM and CJS builds and zero runtime dependencies allow the library to be used in CLI tools, Electron applications, and web-based presentation builders without stack-specific configuration.

### Supported Platforms

- **Node.js** – generate presentations in backend scripts, APIs, or CLI tools
- **React / Angular / Vite / Webpack** – import the package directly; no additional configuration is required
- **Electron** – build native applications with full filesystem access and PowerPoint output
- **Browser (Vanilla JS)** – embed in web applications with direct download support
- **Serverless / Edge Functions** – use in AWS Lambda, Vercel, Cloudflare Workers, etc.

> _Vite, Webpack, and modern bundlers automatically select the correct build via the `exports` field in `package.json`._
> **Note:** when in doubt, use the **ES module build** (`pptxgen.es.js`).
> All modern bundlers and runtimes support it, and it tree-shakes the Node-only code paths automatically.

### Builds Provided

- **CommonJS**: [`dist/pptxgen.cjs.js`](https://github.com/NeomaVerwaltung/PptxGenJS/blob/master/dist/pptxgen.cjs.js)
- **ES Module**: [`dist/pptxgen.es.js`](https://github.com/NeomaVerwaltung/PptxGenJS/blob/master/dist/pptxgen.es.js)
