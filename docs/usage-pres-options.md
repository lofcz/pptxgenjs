---
title: Presentation Options
---

## Metadata

### Metadata Properties

These optional metadata properties correspond to built-in PowerPoint document properties (visible under File > Info). They help describe the presentation’s content and ownership.

| Name       | Description                  |
| :--------- | :--------------------------- |
| `title`    | title shown in PowerPoint UI |
| `author`   | presentation author          |
| `subject`  | presentation subject         |
| `company`  | company name                 |
| `revision` | revision number (as string)  |

## Library Version

> You can also check the current PptxGenJS library version using the read-only `version` property

```typescript
console.log(pptx.version); // e.g. "4.0.0"
```

### Metadata Properties Examples

PptxGenJS uses ES6-style getters/setters.

```typescript
pptx.title = 'My Awesome Presentation';
pptx.author = 'Brent Ely';
pptx.subject = 'Annual Report';
pptx.company = 'Computer Science Chair';
pptx.revision = '15';
```

## Slide Layouts (Sizes)

Layout option applies to all slides in the current Presentation.

### Slide Layout Syntax

```typescript
pptx.layout = 'LAYOUT_NAME';
```

### Standard Slide Layouts

| Layout Name    | Default | Layout Slide Size |
| :------------- | :------ | :---------------- |
| `LAYOUT_16x9`  | Yes     | 10 x 5.625 inches |
| `LAYOUT_16x10` | No      | 10 x 6.25 inches  |
| `LAYOUT_4x3`   | No      | 10 x 7.5 inches   |
| `LAYOUT_WIDE`  | No      | 13.3 x 7.5 inches |

### Custom Slide Layouts

Custom layouts of any size are supported.

* Use the `defineLayout()` method to create a custom layout of any size
* Multiple layouts are supported. For example, define both an 'A3' and an 'A4' layout, then apply whichever is required

### Custom Slide Layout Example

```typescript
// Define new layout for the Presentation
pptx.defineLayout({ name:'A3', width:16.5, height:11.7 });

// Set presentation to use new layout
pptx.layout = 'A3';
```

> To inspect the current layout size:

```typescript
console.log(pptx.presLayout); // { width: 10, height: 5.625 }
```

## Text Direction

### Text Direction Options

Right-to-Left (RTL) text is supported. Set the RTL mode presentation property to enable it.

### Text Direction Examples

```typescript
pptx.rtlMode = true; // set RTL text mode to true
pptx.theme = { lang: "he" }; // set RTL language to use (default is 'EN-US')
```

Notes:

* You may also need to set an RTL lang value such as `lang='he'` as the default lang is 'EN-US'
* See [Issue#600](https://github.com/gitbrent/PptxGenJS/issues/600) for more

## Default Font

### Default Font Options

Use the `headFontFace` and `bodyFontFace` properties to set the default font used in the presentation.

### Default Font Examples

```typescript
pptx.theme = { headFontFace: "Arial Light" };
pptx.theme = { bodyFontFace: "Arial" };
```
