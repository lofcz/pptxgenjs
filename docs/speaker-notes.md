---
title: Speaker Notes
---

Speaker notes are the private text shown to the presenter in PowerPoint's Presenter View and printed on
notes pages — the audience never sees them. Use them for talking points, source citations, or cues. Any
slide can have notes; call `addNotes()` once per slide (a second call replaces the previous notes).

## Syntax

```typescript
slide.addNotes("Text shown only to the presenter")
```

## Example

```typescript
import pptxgen from "@neo-ma/pptxgenjs"

const pres = new pptxgen()
const slide = pres.addSlide()

slide.addText("Hello World!", { x: 1.5, y: 1.5, fontSize: 18, color: "363636" })
slide.addNotes("Remember to mention the Q3 numbers here.")

await pres.writeFile({ fileName: "Speaker-Notes.pptx" })
```

Notes are plain text. Line breaks (`\n`) are preserved, but rich formatting (bold, color, bullets) is not
applied to notes — for formatted on-slide content use [`addText`](./api-text) instead.
