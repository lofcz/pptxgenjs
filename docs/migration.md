---
title: Migrating from pptxgenjs
---

# Migrating to `pptxgenjs-plus`

`pptxgenjs-plus` is a **drop-in replacement** for the original `pptxgenjs` package and for the
previous `@lofcz/pptxgenjs` publish name. The public API, the default export, and the `PptxGenJS`
class are unchanged — the only required change is the package name in your install command and imports.

## 1. Swap the dependency

From the original package:

```bash
npm uninstall pptxgenjs
npm install pptxgenjs-plus
```

From the previous scoped name:

```bash
npm uninstall @lofcz/pptxgenjs
npm install pptxgenjs-plus
```

Or with yarn:

```bash
yarn remove pptxgenjs
yarn add pptxgenjs-plus
```

## 2. Update imports

The import specifier is the only code change. The imported value is identical.

```diff
- import pptxgen from "pptxgenjs"
+ import pptxgen from "pptxgenjs-plus"
```

From `@lofcz/pptxgenjs`:

```diff
- import pptxgen from "@lofcz/pptxgenjs"
+ import pptxgen from "pptxgenjs-plus"
```

CommonJS:

```diff
- const pptxgen = require("pptxgenjs")
+ const pptxgen = require("pptxgenjs-plus")
```

Everything after the import stays the same:

```typescript
const pres = new pptxgen()
const slide = pres.addSlide()
slide.addText("Unchanged API", { x: 1, y: 1, fontSize: 24 })
await pres.writeFile({ fileName: "Sample.pptx" })
```

A project-wide find-and-replace of `"pptxgenjs"` or `"@lofcz/pptxgenjs"` → `"pptxgenjs-plus"` is usually the entire migration.

## 3. Update the browser `<script>` tag

If you load the bundle from a CDN, point it at the npm package:

```diff
- <script src="https://cdn.jsdelivr.net/npm/pptxgenjs@4/dist/pptxgen.bundle.js"></script>
+ <script src="https://cdn.jsdelivr.net/npm/pptxgenjs-plus@4/dist/pptxgen.bundle.js"></script>
```

The global remains `PptxGenJS` (`new PptxGenJS()`), so no script code changes.

## TypeScript

Type definitions ship inside the package (`types/index.d.ts` via the `types` field), so you do **not**
need a separate `@types/pptxgenjs` dependency. If you installed one for the old package, remove it:

```bash
npm uninstall @types/pptxgenjs
```

Editor autocomplete and inline documentation require no additional configuration.

## What is different from the original

The fork keeps the same version line and API surface, and adds:

- **XML-correctness fixes** that produce cleaner files and avoid PowerPoint "needs repair" prompts:
  - matching close tag for the inner-shadow effect,
  - XML-encoded company name in `app.xml`,
  - dropped phantom `slideMaster` overrides and corrected JPEG MIME type.
- A **modern build and test suite** (Rslib / Rsbuild ESM/CJS/UMD builds, typechecks, unit/e2e/package-contract tests run in CI).
- This **documentation site**, maintained in-repo so it tracks the code.

There are no known breaking API changes relative to `pptxgenjs` 4.x. If you encounter a difference in
behavior, [open an issue](https://github.com/lofcz/pptxgenjs-plus/issues/new) with a short reproduction.

## Rollback

Because the API is identical, rolling back is the reverse swap — reinstall `pptxgenjs` and revert the
import specifier. No code using the library needs to change.
