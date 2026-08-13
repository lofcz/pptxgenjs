# PptxGenJS

Fork of [PptxGenJS](https://github.com/gitbrent/PptxGenJS) published as [`@lofcz/pptxgenjs`](https://www.npmjs.com/package/@lofcz/pptxgenjs) on npm.

![PptxGenJS Sample Slides](https://raw.githubusercontent.com/gitbrent/PptxGenJS/gh-pages/img/readme_banner.png)

![GitHub Repo stars](https://img.shields.io/github/stars/lofcz/PptxGenJS?style=flat-square)
![GitHub License](https://img.shields.io/github/license/lofcz/PptxGenJS?style=flat-square)
[![npm version](https://img.shields.io/npm/v/%40lofcz/pptxgenjs?style=flat-square)](https://www.npmjs.com/package/@lofcz/pptxgenjs)

PptxGenJS is a JavaScript library for generating PowerPoint presentations programmatically. It runs in Node.js, browsers, and bundler-based environments (React, Angular, Vite, Webpack, Electron), and requires no PowerPoint installation or license. Output is standards-compliant [Open Office XML (OOXML)](https://ecma-international.org/publications-and-standards/standards/ecma-376/), compatible with Microsoft PowerPoint, Apple Keynote, LibreOffice Impress, and Google Slides (via import). For PowerPoint-specific behavior, see Microsoft's [Office implementation notes](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oi29500/1fd4a662-8623-49c0-82f0-18fa91b413b8).

## About this fork

This repository is a fork of [gitbrent/PptxGenJS](https://github.com/gitbrent/PptxGenJS), maintained for the PPTist / ScioBot stack and published as `@lofcz/pptxgenjs`. It tracks hardening work from [NEOMA GmbH](https://neo-ma.de)'s distribution (`@neo-ma/pptxgenjs`):

- **Strict null-safety** — the entire source compiles under TypeScript `strictNullChecks` with zero non-null assertions (`!`) and zero unchecked `as` casts; null-safety is enforced through explicit types, guard clauses, and validated defaults
- **Continuous integration** — unit, end-to-end, OOXML package-contract tests, and an optional LibreOffice consumer check run on Node.js 20 and 22
- **Security** — no known vulnerabilities in the published package, and a published [security policy](SECURITY.md)

The public API remains compatible with upstream PptxGenJS; existing code and documentation continue to apply.

## Requirements

- Node.js 20 or newer

## Installation

```bash
npm install @lofcz/pptxgenjs
```

```bash
yarn add @lofcz/pptxgenjs
```

The package ships dual ES Module and CommonJS builds. Bundlers select the correct build automatically via the `exports` field in `package.json`. The `.pptx` output can be delivered as a browser download, base64 string, Blob, Buffer, or Node stream.

## Quick start

A presentation is created in four steps: instantiate, add a slide, add content, save.

```typescript
import pptxgen from "@lofcz/pptxgenjs";

// 1. Create a presentation
const pres = new pptxgen();

// 2. Add a slide
const slide = pres.addSlide();

// 3. Add content (text, tables, shapes, images, charts, media)
slide.addText("Quarterly Results", { x: 0.5, y: 0.5, fontSize: 24, bold: true });
slide.addText("Revenue up 12% year over year", { x: 0.5, y: 1.3, fontSize: 14, color: "363636" });

// 4. Write the .pptx file
await pres.writeFile({ fileName: "quarterly-results.pptx" });
```

When loading the library via a `<script>` tag rather than a module import, the constructor is the global `PptxGenJS` (for example, `const pres = new PptxGenJS()`); the remaining steps are identical.

## Documentation

Complete API reference, tutorials, and integration guides are available on the official docs site: [https://gitbrent.github.io/PptxGenJS](https://gitbrent.github.io/PptxGenJS).

Local VitePress docs under [`docs/`](docs) can be previewed with `npm run docs:dev`.

## Issues and support

Report defects and feature requests on the [issue tracker](https://github.com/lofcz/PptxGenJS/issues/new), or [submit a pull request](https://github.com/lofcz/PptxGenJS/pulls). When reporting an issue, include a code snippet or a link that demonstrates the problem. See [CONTRIBUTING.md](CONTRIBUTING.md) for build and test instructions.

## Contributors

Thanks to everyone who contributed to the original project and this distribution.

Notable contributions:

- [Dzmitry Dulko](https://github.com/DzmitryDulko) — initial NPM publication
- [Michal Kacerovský](https://github.com/kajda90) — Master Slide layouts and chart expertise
- [Connor Bowman](https://github.com/conbow) — placeholder support
- [Reima Frgos](https://github.com/ReimaFrgos) — chart and general functionality patches
- [Matt King](https://github.com/kyrrigle) — chart expertise
- [Mike Wilcox](https://github.com/clubajax) — chart expertise
- [Joonas](https://github.com/wyozi) — [react-pptx](https://github.com/wyozi/react-pptx)

PowerPoint shape definitions and portions of the XML generation are derived from the [Officegen Project](https://github.com/Ziv-Barber/officegen).

## License

Copyright &copy; 2015-present [Brent Ely](https://github.com/gitbrent/), &copy; 2026-present [lofcz](https://github.com/lofcz)

Licensed under the [MIT License](https://github.com/lofcz/PptxGenJS/blob/master/LICENSE).
