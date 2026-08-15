# pptxgenjs-plus

[![npm](https://img.shields.io/npm/v/pptxgenjs-plus?style=flat-square&labelColor=3f3f46&color=71717a)](https://www.npmjs.com/package/pptxgenjs-plus)
[![license](https://img.shields.io/github/license/lofcz/pptxgenjs-plus?style=flat-square&labelColor=3f3f46&color=71717a)](https://github.com/lofcz/pptxgenjs-plus/blob/next/LICENSE)
[![node](https://img.shields.io/node/v/pptxgenjs-plus?style=flat-square&labelColor=3f3f46&color=71717a)](https://www.npmjs.com/package/pptxgenjs-plus)

```bash
                    _/|                                   \|\||
                   / | `_         generate pptx          -- |||/
                  /     =\   using typescript on node   /=   |||/
               _-'        \      or in the browser     /    |||||/
_____________-'        _`-/                            \-' |||||||/`-_____________
  \                   / --                              -|||||||||             /
   \                  \                                  |/||||              /
    |_____       _\    \_______                   _______/    /_       _____|
_________.\___,-'  \__________/                  \___________/  `-.___/,_________
```

## Getting started

```bash
npm install pptxgenjs-plus
```

```ts
import pptxgen from 'pptxgenjs-plus'

const pres = new pptxgen()
const slide = pres.addSlide()
slide.addText('Hello', { x: 0.5, y: 0.5, fontSize: 24 })
await pres.writeFile({ fileName: 'hello.pptx' })
```

`x` / `y` / `w` / `h` are inches. In a `<script>` tag the constructor is `PptxGenJS`.

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
- [NEOMA GmbH](https://neo-ma.de) — thank you for the `@neo-ma/pptxgenjs` hardening work (strict null-safety, OOXML package contracts, LibreOffice consumer checks) that this fork builds on

PowerPoint shape definitions and portions of the XML generation are derived from the [Officegen Project](https://github.com/Ziv-Barber/officegen).
