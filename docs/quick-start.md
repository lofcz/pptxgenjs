---
title: Quick Start
---

# Quick Start

Create a PowerPoint presentation in four steps: create the presentation, add a slide, add content, save.

## Node, React, Angular, Vite (ES modules)

```typescript
import pptxgen from "@neo-ma/pptxgenjs"

// 1. Create a presentation
const pres = new pptxgen()

// 2. Add a slide
const slide = pres.addSlide()

// 3. Add one or more objects (text, tables, shapes, images, charts, media)
slide.addText("Hello World from PptxGenJS!", { x: 1, y: 1, w: "80%", h: 1, fontSize: 24, color: "363636" })

// 4. Save the presentation
await pres.writeFile({ fileName: "HelloWorld.pptx" })
```

## Browser (script tag)

Loaded from a `<script>` tag, the library is available as the `PptxGenJS` global. The API is identical:

```typescript
// 1. Create a presentation
const pres = new PptxGenJS()

// 2. Add a slide
const slide = pres.addSlide()

// 3. Add content
slide.addText("Hello World from PptxGenJS!", { x: 1, y: 1, w: "80%", h: 1, fontSize: 24, color: "363636" })

// 4. Save the presentation (triggers a download)
await pres.writeFile({ fileName: "HelloWorld.pptx" })
```

## Typed options and autocomplete

Every `addX` method is fully typed. Option objects are checked as you write them, and your editor
autocompletes property names, enum values, and expected types.

```typescript
import pptxgen from "@neo-ma/pptxgenjs"

const pres = new pptxgen()
const slide = pres.addSlide()

// `TextPropsOptions` is inferred: `align` only accepts "left" | "center" | "right",
// `fontSize` must be a number, and unknown properties are a compile error.
const textOptions: pptxgen.TextPropsOptions = {
	x: 1,
	y: 1,
	w: "80%",
	h: 1,
	align: "center",
	fontSize: 24,
	color: "363636",
	bold: true,
}

slide.addText("Typed and checked at compile time", textOptions)

await pres.writeFile({ fileName: "TypedOptions.pptx" })
```

This completes the basic workflow. Continue with [Installation](./installation), or see the API reference
in the sidebar for the options each object accepts.
