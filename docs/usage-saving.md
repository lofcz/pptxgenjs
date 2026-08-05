---
title: Saving Presentations
---

Several methods are available for generating a presentation.

- All methods return a Promise

## Saving as a File (writeFile)

Save the presentation as a PowerPoint .pptx file.

- In browser-based apps, this triggers a download using the correct pptx MIME-type.
- In Node.js, it saves to disk via the native fs module.

### Write File Props (`WriteFileProps`)

| Option        | Type    | Default             | Description                                                            |
| :------------ | :------ | :------------------ | :--------------------------------------------------------------------- |
| `compression` | boolean | false               | apply zip compression (exports take longer but save significant space) |
| `fileName`    | string  | 'Presentation.pptx' | output filename                                                        |

### Write File Example

```typescript
// For simple cases, you can omit `then`
pptx.writeFile({ fileName: 'Browser-PowerPoint-Demo.pptx' });

// Using Promise to determine when the file has actually completed generating
pptx.writeFile({ fileName: 'Browser-PowerPoint-Demo.pptx' });
    .then(fileName => {
        console.log(`created file: ${fileName}`);
    });
```

## Generating Other Formats (write)

Generate the presentation in various formats (e.g., base64, arraybuffer) — useful for uploading to cloud storage or handling in-memory.

### Write Props (`WriteProps`)

| Option        | Type    | Default | Description                                                                 |
| :------------ | :------ | :------ | :-------------------------------------------------------------------------- |
| `compression` | boolean | false   | apply zip compression (exports take longer but save significant space)      |
| `outputType`  | string  | blob    | 'arraybuffer', 'base64', 'binarystring', 'blob', 'nodebuffer', 'uint8array' |

### Write Output Types

| `outputType` | Description                                  |
| :----------- | :------------------------------------------- |
| blob         | Default for browsers                         |
| arraybuffer  | Often used with WebAssembly or binary tools  |
| base64       | Useful for uploads to APIs like Google Drive |
| nodebuffer   | Use in Node.js with fs.writeFile()           |

### Write Example

```typescript
pptx.write({ outputType: "base64" })
    .then((data) => {
        console.log("write as base64: Here are 0-100 chars of `data`:\n");
        console.log(data.substring(0, 100));
    })
    .catch((err) => {
        console.error(err);
    });
```

## Streaming in Node.js (stream)

Returns the presentation as a binary string, suitable for streaming in HTTP responses or writing directly to disk in Node.js environments.

### Stream Example

Stream the generated file in an HTTP response (shown here with Express):

```typescript
import express from "express"
import pptxgen from "@neo-ma/pptxgenjs"

const app = express()

app.get("/download", async (req, res) => {
    const pptx = new pptxgen()
    pptx.addSlide().addText("Streamed with PptxGenJS", { x: 1, y: 1 })

    const data = await pptx.stream()
    res.writeHead(200, {
        "Content-disposition": "attachment;filename=Presentation.pptx",
        "Content-Length": data.length,
    })
    res.end(Buffer.from(data as string, "binary"))
})

app.listen(3000)
```

## Saving Multiple Presentations

### In the Browser

> Each new presentation should use a fresh new PptxGenJS() instance to avoid reusing slides or metadata.

```typescript
let pptx = null;

// Presentation 1:
pptx = new PptxGenJS();
pptx.addSlide().addText("Presentation 1", { x: 1, y: 1 });
pptx.writeFile({ fileName: "PptxGenJS-Browser-1" });

// Presentation 2:
pptx = new PptxGenJS();
pptx.addSlide().addText("Presentation 2", { x: 1, y: 1 });
pptx.writeFile({ fileName: "PptxGenJS-Browser-2" });
```

### In Node.js

```typescript
import pptxgen from "@neo-ma/pptxgenjs"

// Presentation 1:
let pptx = new pptxgen()
pptx.addSlide().addText("Presentation 1", { x: 1, y: 1 })
await pptx.writeFile({ fileName: "PptxGenJS-Node-1.pptx" })

// Presentation 2 — a fresh instance:
pptx = new pptxgen()
pptx.addSlide().addText("Presentation 2", { x: 1, y: 1 })
await pptx.writeFile({ fileName: "PptxGenJS-Node-2.pptx" })
```

```typescript
import pptxgen from "@neo-ma/pptxgenjs";

// Presentation 1:
let pptx1 = new pptxgen();
pptx1.addSlide().addText("Presentation 1", { x: 1, y: 1 });
pptx1.writeFile({ fileName: "PptxGenJS-NodePres-1" });

// Presentation 2:
let pptx2 = new pptxgen();
pptx2.addSlide().addText("Presentation 2", { x: 1, y: 1 });
pptx2.writeFile({ fileName: "PptxGenJS-NodePres-2" });
```
