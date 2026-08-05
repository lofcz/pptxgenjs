---
title: Creating a Presentation
---

A "presentation" is a single `.pptx` file. Everything starts with one `pptxgen` instance — it is the
document you add slides to and eventually save. Create one instance per file you want to produce.

## Import and create

How you get the constructor depends on your environment, but the object it returns is identical.

### Node, or any bundler (React, Angular, Vue, Vite, Webpack)

Import the default export. This is the recommended path for application code — you get the typed API and
your bundler picks the correct build automatically.

```typescript
import pptxgen from "@neo-ma/pptxgenjs"

const pres = new pptxgen()
```

### Browser via `<script>` tag

When you load the bundle directly (no build step), the constructor is exposed as the global `PptxGenJS`:

```typescript
const pres = new PptxGenJS()
```

Everything after this line — `addSlide()`, `addText()`, `writeFile()` — is the same in both cases. The rest
of the docs use the `pres` instance created here.

## Coordinates and colors

Two conventions apply to every object added to a slide:

- **Position and size** are given as `x`, `y`, `w`, `h`. Numbers are **inches** from the top-left corner of
  the slide; strings like `"50%"` are a percentage of the slide's width/height. A default slide is
  10 × 5.63 inches (16:9) — see [Presentation Options](./usage-pres-options) to change the layout.
- **Colors** are hex strings **without** the leading `#`, e.g. `"363636"` or `"0088CC"`. You can also use
  theme-aware [scheme colors](./shapes-and-schemes#powerpoint-scheme-colors).

## One instance per file

Reusing a single instance across files can leak slides and metadata between them. To generate several
files, create a fresh instance for each — see
[Saving Multiple Presentations](./usage-saving#saving-multiple-presentations).
