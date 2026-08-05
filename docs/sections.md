---
title: Slide Sections
---

Sections group slides in PowerPoint's slide navigator, giving long decks a collapsible outline (for
example "Intro", "Financials", "Appendix"). They are organizational only — they do not change how slides
render. Use them when a presentation is large enough that named groups help reviewers navigate it.

## Syntax

Define a section on the presentation, then assign slides to it by title when you add them:

```typescript
pptx.addSection({ title: "Tables" })
pptx.addSection({ title: "Charts", order: 3 })
```

## Section Options

| Option  | Type    | Description   | Notes                                                                              |
| :------ | :------ | :------------ | :--------------------------------------------------------------------------------- |
| `title` | string  | section title | Required. Shown in the PowerPoint navigator; must be unique.                       |
| `order` | integer | section order | Optional, `1`-based. Inserts the section at a specific index instead of appending. |

## Section Example

```typescript
import pptxgen from "@neo-ma/pptxgenjs";
let pptx = new pptxgen();

// STEP 1: Create a section
pptx.addSection({ title: "Tables" });

// STEP 2: Provide section title to a slide that you want in corresponding section
let slide = pptx.addSlide({ sectionTitle: "Tables" });

slide.addText("This slide is in the Tables section!", { x: 1.5, y: 1.5, fontSize: 18, color: "363636" });
pptx.writeFile({ fileName: "Section Sample.pptx" });
```
