---
title: Shapes and Schemes
---

## PowerPoint Shape Types

The library ships every built-in PowerPoint shape — over 180 of them (rectangles, ovals, arrows, callouts,
stars, connectors, and more), originally provided by the [officegen project](https://github.com/Ziv-Barber/officegen).
Shapes are enumerated on the instance as `pptx.ShapeType`; editor autocompletion on this enum is the fastest
way to discover the available shapes. The complete enum is also defined in
[`index.d.ts`](https://github.com/NeomaVerwaltung/PptxGenJS/blob/master/types/index.d.ts).

Add a shape with `slide.addShape(type, options)`. The options control fill, line, and position:

```typescript
// A filled rounded rectangle
slide.addShape(pptx.ShapeType.roundRect, {
	x: 1, y: 1, w: 3, h: 1.5,
	fill: { color: "0088CC" },
	line: { color: "004466", width: 1 },
})

// Shapes can also back a text box — pass `shape` to addText
slide.addText("Label", { shape: pptx.ShapeType.ellipse, x: 5, y: 1, w: 2, h: 2, fill: { color: "ED7D31" }, align: "center" })
```

See [Shapes API](./api-shapes) for the full list of shape options.

## PowerPoint Scheme Colors

A scheme color is a reference to a slot in the presentation's theme rather than a fixed hex value. When a
viewer switches the theme (or you apply a different template), everything painted with a scheme color
updates automatically — so text stays readable against backgrounds and the deck keeps a consistent palette.
Prefer scheme colors over hardcoded hex when you want a deck to adapt to corporate templates.

The ten slots map to PowerPoint's theme: two text colors, two background colors, and six accents. Reference
them through `pptx.SchemeColor`; the complete enum is in
[`index.d.ts`](https://github.com/NeomaVerwaltung/PptxGenJS/blob/master/types/index.d.ts).

```typescript
slide.addText("Themed heading", { color: pptx.SchemeColor.accent1 })
slide.addShape(pptx.ShapeType.rect, { x: 1, y: 3, w: 4, h: 1, fill: { color: pptx.SchemeColor.background2 } })
```


![Scheme Demo](./assets/demo-scheme.png)

```typescript
export enum SchemeColor {
    "text1" = "tx1",
    "text2" = "tx2",
    "background1" = "bg1",
    "background2" = "bg2",
    "accent1" = "accent1",
    "accent2" = "accent2",
    "accent3" = "accent3",
    "accent4" = "accent4",
    "accent5" = "accent5",
    "accent6" = "accent6",
}
```
