---
title: Integration by Environment
---

PptxGenJS can be used in various JavaScript environments. Select the integration method below that matches your project setup.

## Available Distributions

- ES6 Module `dist/pptxgen.es.js`
- CommonJS `dist/pptxgen.cjs.js`
- Browser `dist/pptxgen.min.js`

## Environment Guide

| Environment(s)                                                                                                | Import / Usage                                                                                                         | Notes / Details                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Node.js (Version 18 and higher)**| `import pptxgen from "@neo-ma/pptxgenjs"`| Automatically uses the appropriate Node.js build based on your project's module type (`package.json#type`). Both ESM and CommonJS formats are fully supported.|
| **Browser Bundlers** (Webpack, Vite, Rollup, Parcel, Browserify, Create React App, Next.js, Angular, Vue CLI) | `import pptxgen from '@neo-ma/pptxgenjs'`| Your bundler will automatically select the optimized ES Module build (`dist/pptxgen.es.js`). This enables effective tree-shaking to minimize your final bundle size. No extra bundler configuration is typically needed. |
| **Plain Browser (`<script>` tag, no bundler)**| Include the bundled script directly in your HTML: `<script src=".../pptxgen.bundle.js"></script>`| This provides a self-contained build (`dist/pptxgen.bundle.js`) that adds the `PptxGenJS` object to the global `window` scope. Useful for simple scripts or environments without a module bundler.|
| **Web Worker / Service Worker**| `import pptxgen from '@neo-ma/pptxgenjs'` (Requires a module worker (`type: "module"`) or the use of import maps)| Utilize the ES Module build (`dist/pptxgen.es.js`). Remember that data (like the final presentation `ArrayBuffer`) will need to be transferred back to the main thread using `postMessage`.|
| **Serverless Functions** (AWS Lambda, Cloudflare Workers, etc.)| `import pptxgen from '@neo-ma/pptxgenjs'` (for ESM runtimes) OR `const pptxgen = require('@neo-ma/pptxgenjs')` (for CommonJS runtimes) | Bundle your function code using a tool like esbuild or Vite SSR; Be mindful of function size limits and potential cold start impacts from larger dependencies.|
| **Electron (Main Process)**| Same as **Node.js**| In the main Electron process, you have full access to Node.js APIs, including the filesystem, which is useful for directly saving presentation files using the `writeFile()` method.|
| **Electron (Renderer Process)**| Same as **Browser Bundlers**| The renderer process is similar to a browser environment. If `nodeIntegration` is enabled and securely configured, you may also be able to use Node.js filesystem access from the renderer.|

The [Quick Start](./quick-start) shows the browser and Node code side by side, and each API
Reference page includes runnable snippets.

## Troubleshooting

### Webpack

The library has been tested with several framework and bundler combinations, including Vite and Webpack.
Most projects can install @neo-ma/pptxgenjs without additional configuration; however, build errors can
occur in some setups.

The following example is from Docusaurus v3.7, where Webpack v5 fails during the build process:

```text
[ERROR] Client bundle compiled with errors therefore further build is impossible.
Module build failed: UnhandledSchemeError: Reading from "node:fs" is not handled by plugins (Unhandled scheme).
Webpack supports "data:" and "file:" URIs by default.
You may need an additional plugin to handle "node:" URIs.
```

The error is being caused by the use of the "node:" prefix within "browser" field in pptxgenjs' `package.json` file.

```json
// @neo-ma/pptxgenjs package.json
{
  "name": "@neo-ma/pptxgenjs",
  "browser": {
    "fs": false,
    "image-size": false,
    "node:fs": false,
    "node:https": false,
    "os": false,
    "path": false
  }
}
```

Starting in version 4.0.0, node modules are excluded using this format in the library source, so most
bundlers resolve them to empty modules automatically.

### Excluding "node:" from Webpack Builds

Older Webpack setups (e.g. Docusaurus v3 on Webpack v5) may still fail on the `node:` scheme:

```text
UnhandledSchemeError: Reading from "node:fs" is not handled by plugins (Unhandled scheme).
```

Tell Webpack to ignore the `node:` prefix by adding a `NormalModuleReplacementPlugin` in your
`webpack.config.js` (or the equivalent hook in your framework's build config):

```typescript
const webpack = require("webpack")

module.exports = {
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "")
    }),
  ],
}
```

Webpack now resolves the `node:` items via the `browser` field and builds successfully.
