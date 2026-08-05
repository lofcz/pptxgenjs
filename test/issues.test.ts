/**
 * PptxGenJS: Regression tests for fixed issues
 * One check per bug fixed - each fails if the bug comes back.
 *
 * Run with: `npm test` (node built-in test runner + tsx)
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import JSZip from 'jszip'
import pptxgen from '../src/pptxgen'

/** 4x2 px PNG - non-square on purpose, so a 1x1 inch default is obvious */
const PNG_4x2 = 'image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAADklEQVR4nGP4jwQYkDkANvEX6SAXxcIAAAAASUVORK5CYII='

async function writeZip (pptx: pptxgen): Promise<JSZip> {
	return await JSZip.loadAsync((await pptx.write({ outputType: 'nodebuffer' })) as Buffer)
}

/** the chart counter is module-global, so chart part numbering continues across tests */
async function readChart (zip: JSZip): Promise<string> {
	const file = zip.file(/ppt\/charts\/chart\d+\.xml$/)[0]
	assert.ok(file, 'missing chart part')
	return await file.async('string')
}

async function readPart (zip: JSZip, name: string): Promise<string> {
	const file = zip.file(name)
	assert.ok(file, `missing part: ${name}`)
	return await file.async('string')
}

/** Charts embed a whole .xlsx as a single part - open the inner zip to inspect the worksheet */
async function readEmbeddedXlsx (zip: JSZip): Promise<JSZip> {
	const file = zip.file(/ppt\/embeddings\/.*\.xlsx$/)[0]
	assert.ok(file, 'missing embedded chart workbook')
	return await JSZip.loadAsync(await file.async('nodebuffer'))
}

test('#19/#18: SVG image + hyperlink gets unique rIds and an escaped url', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addImage({ data: 'image/svg+xml;base64,PHN2Zy8+', x: 1, y: 1, w: 1, h: 1, hyperlink: { url: 'https://x.com/?a=1&b=2' } })

	const rels = await readPart(await writeZip(pptx), 'ppt/slides/_rels/slide1.xml.rels')
	const ids = [...rels.matchAll(/Id="(rId\d+)"/g)].map(match => match[1])
	assert.equal(new Set(ids).size, ids.length, `duplicate rIds in slide rels: ${ids.join(', ')}`)
	assert.ok(rels.includes('a=1&amp;b=2'), 'hyperlink url was not XML-escaped')
})

test('#20: shadow options are not mutated, so a second export matches the first', async () => {
	const shadow = { type: 'outer' as const, blur: 3, offset: 2, angle: 45, opacity: 0.5, color: '000000' }
	const pptx = new pptxgen()
	pptx.addSlide().addShape(pptx.ShapeType.rect, { x: 1, y: 1, w: 2, h: 1, fill: { color: 'FF0000' }, shadow })

	const first = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const second = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.equal(second, first, 'second export produced different shadow XML (options were mutated)')
	assert.equal(shadow.angle, 45, 'caller shadow options were mutated')
	assert.ok(first.includes('dir="2700000"'), 'shadow angle not converted for XML')
})

test('#18: slide master name is XML-escaped', async () => {
	const pptx = new pptxgen()
	pptx.defineSlideMaster({ title: 'R&D "Q3" Master', objects: [] })
	pptx.addSlide({ masterName: 'R&D "Q3" Master' })

	const xml = await readPart(await writeZip(pptx), 'ppt/slideMasters/slideMaster1.xml')
	assert.ok(!/name="[^"]*&(?!amp;|quot;|lt;|gt;|apos;)/.test(xml), 'unescaped entity in cSld name')
})

test('#21/#23: bubble chart workbook keeps zeros and has a valid table ref', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addChart(pptx.ChartType.bubble, [
		{ name: 'X-Axis', values: [1, 2, 3] },
		{ name: 'R&D', values: [0, 5, 6], sizes: [0, 2, 3] },
	], { x: 1, y: 1, w: 4, h: 3 })
	slide.addChart(pptx.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [1, 2] }], { x: 1, y: 4, w: 4, h: 2 })

	const zip = await writeZip(pptx)
	const bubbleXlsx = await JSZip.loadAsync(await zip.file(/ppt\/embeddings\/.*\.xlsx$/)[0].async('nodebuffer'))
	const sheet = await readPart(bubbleXlsx, 'xl/worksheets/sheet1.xml')
	assert.ok(sheet.includes('<v>0</v>'), 'bubble worksheet dropped a legitimate zero value')
	const table = await readPart(bubbleXlsx, 'xl/tables/table1.xml')
	assert.ok(table.includes('name="R&amp;D"'), 'bubble series name was not XML-escaped')

	for (const name of Object.keys(zip.files).filter(key => key.endsWith('.xlsx'))) {
		const inner = await JSZip.loadAsync(await zip.file(name)!.async('nodebuffer'))
		const tableXml = await readPart(inner, 'xl/tables/table1.xml')
		assert.ok(!/ref="[^"]*'/.test(tableXml), `stray apostrophe in table ref: ${name}`)
	}
})

test('#38: multi-level category chart writes a coherent worksheet', async () => {
	const LABELS = [
		['Gear', 'Berg', 'Motr', 'Swch', 'Plug', 'Cord'],
		['Mech', '', '', 'Elec', '', ''],
	]
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [
		{ name: 'West', labels: LABELS, values: [11, 8, 3, 0, 11, 3] },
		{ name: 'East', labels: LABELS, values: [1, 2, 3, 4, 5, 6] },
	], { x: 1, y: 1, w: 6, h: 4 })

	const xlsx = await readEmbeddedXlsx(await writeZip(pptx))
	const sheet = await readPart(xlsx, 'xl/worksheets/sheet1.xml')
	const strings = await readPart(xlsx, 'xl/sharedStrings.xml')
	const arrStrings = [...strings.matchAll(/<si>(.*?)<\/si>/g)].map(match => /<t[^>]*>([^<]*)<\/t>/.exec(match[1])?.[1] ?? '')

	// series names occupy the two header cells right of the label levels
	assert.ok(sheet.includes('<c r="C1" t="s"><v>1</v></c>'), 'series header cell missing/misplaced')
	assert.equal(arrStrings[1], 'West')
	// outer label of row 2 ("Mech") sits in col A, inner label ("Gear") in col B
	const idxMech = arrStrings.indexOf('Mech')
	const idxGear = arrStrings.indexOf('Gear')
	assert.ok(sheet.includes(`<c r="A2" t="s"><v>${idxMech}</v></c>`), 'outer label cell wrong')
	assert.ok(sheet.includes(`<c r="B2" t="s"><v>${idxGear}</v></c>`), 'inner label cell wrong')
	// zeros survive, and outer labels are merged over their three rows
	assert.ok(sheet.includes('<c r="C5"><v>0</v></c>'), 'multi-cat worksheet dropped a zero value')
	assert.ok(sheet.includes('<mergeCell ref="A2:A4"/>') && sheet.includes('<mergeCell ref="A5:A7"/>'), 'outer label rows were not merged')
})

test('#25: multi-type chart honors the options argument', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		[{ type: pptx.ChartType.bar, data: [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [1, 2] }], options: {} }],
		[{ name: 'Sales', labels: ['Q1', 'Q2'], values: [1, 2] }],
		{ x: 1, y: 1, w: 4, h: 3, showLegend: true }
	)

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('<c:legend>'), 'options argument was discarded')
})

test('#26: serAxisLabelPos is honored', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar3d, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [1, 2] }], {
		x: 1, y: 1, w: 4, h: 3, barDir: 'col', serAxisLabelPos: 'high',
	})

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('val="high"'), 'serAxisLabelPos was ignored')
})

test('#34: image without w/h is sized from the image itself', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addImage({ data: PNG_4x2, x: 1, y: 1 })

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const pic = /<p:pic>[\s\S]*?<\/p:pic>/.exec(xml)?.[0] ?? ''
	const ext = /<a:ext cx="(\d+)" cy="(\d+)"\/>/.exec(pic)
	assert.ok(ext, 'no image extent found')
	// 4x2 px at 96 DPI = 0.0417 x 0.0208 inch; 1 inch = 914400 EMU
	assert.equal(Number(ext[1]), Math.round((4 / 96) * 914400))
	assert.equal(Number(ext[2]), Math.round((2 / 96) * 914400))
})

test('#39: auto-paged tables account for cell margins', async () => {
	const rows = Array.from({ length: 30 }, (_, idx) => [`Row ${idx} cell A`, `Row ${idx} cell B`])
	const pageCount = (margin: number): number => {
		const pptx = new pptxgen()
		pptx.addSlide().addTable(rows, { x: 0.5, y: 0.5, w: 8, autoPage: true, margin })
		return pptx.slides.length
	}

	assert.ok(pageCount(0.5) > pageCount(0), 'large cell margins did not increase the page count')
})

test('#29: BorderProps accepts `width` (points) alongside the deprecated `pt`', async () => {
	const cellXml = async (border: Record<string, unknown>): Promise<string> => {
		const pptx = new pptxgen()
		pptx.addSlide().addTable([[{ text: 'A', options: { border: [border, border, border, border] } }]], { x: 1, y: 1, w: 4 })
		return await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	}

	assert.equal(await cellXml({ color: 'FF0000', width: 3 }), await cellXml({ color: 'FF0000', pt: 3 }), '`width` and `pt` produced different borders')
	assert.ok((await cellXml({ color: 'FF0000', width: 3 })).includes('w="38100"'), '3pt border not emitted')
})

test('#29: defineLayout accepts `w`/`h` as aliases of `width`/`height`', () => {
	const pptx = new pptxgen()
	pptx.defineLayout({ name: 'A3_WH', width: 16.5, height: 11.7 })
	pptx.defineLayout({ name: 'A3_SHORT', w: 16.5, h: 11.7 })

	pptx.layout = 'A3_WH'
	const viaWidth = { w: pptx.presLayout.width, h: pptx.presLayout.height }
	pptx.layout = 'A3_SHORT'
	assert.deepEqual({ w: pptx.presLayout.width, h: pptx.presLayout.height }, viaWidth)
})

test('#33: picture/chart/table placeholders emit their `p:ph` type on the layout', async () => {
	const pptx = new pptxgen()
	pptx.defineSlideMaster({
		title: 'PH_MASTER',
		objects: [
			{ placeholder: { options: { name: 'pic1', type: 'pic', x: 0.5, y: 0.5, w: 3, h: 2 }, text: '' } },
			{ placeholder: { options: { name: 'chart1', type: 'chart', x: 4, y: 0.5, w: 3, h: 2 }, text: '' } },
			{ placeholder: { options: { name: 'tbl1', type: 'tbl', x: 0.5, y: 3, w: 3, h: 2 }, text: '' } },
		],
	})
	const slide = pptx.addSlide({ masterName: 'PH_MASTER' })
	slide.addImage({ data: PNG_4x2, placeholder: 'pic1' })

	const zip = await writeZip(pptx)
	const layouts = await Promise.all([1, 2].map(async num => await readPart(zip, `ppt/slideLayouts/slideLayout${num}.xml`)))
	const layout = layouts.find(xml => xml.includes('PH_MASTER')) ?? ''
	for (const type of ['pic', 'chart', 'tbl']) {
		assert.match(layout, new RegExp(`type="${type}"`), `${type} placeholder has no p:ph type`)
	}

	// the image placed into the picture placeholder inherits its position and references the placeholder
	const pic = /<p:pic>[\s\S]*?<\/p:pic>/.exec(await readPart(zip, 'ppt/slides/slide1.xml'))?.[0] ?? ''
	assert.match(pic, /type="pic"/, 'slide image does not reference the picture placeholder')
	assert.ok(pic.includes(`<a:off x="${Math.round(0.5 * 914400)}"`), 'slide image did not inherit the placeholder position')
})

test('#32: masters accept any shape type, tables and media', async () => {
	const pptx = new pptxgen()
	pptx.defineSlideMaster({
		title: 'RICH_MASTER',
		objects: [
			{ shape: { type: pptx.ShapeType.triangle, options: { x: 0.5, y: 0.5, w: 1, h: 1, fill: { color: '00AA00' } } } },
			{ table: { rows: [['A', 'B']], options: { x: 2, y: 0.5, w: 4 } } },
			{ media: { type: 'audio', data: 'audio/mp3;base64,QQ==', x: 7, y: 0.5, w: 1, h: 1 } },
		],
	})
	pptx.addSlide({ masterName: 'RICH_MASTER' })

	const zip = await writeZip(pptx)
	// layout1 is the built-in DEFAULT layout; the defined master gets its own
	const idx = (await Promise.all([1, 2].map(async num => await readPart(zip, `ppt/slideLayouts/slideLayout${num}.xml`)))).findIndex(xml => xml.includes('RICH_MASTER')) + 1
	assert.ok(idx > 0, 'no layout generated for the defined master')
	const layout = await readPart(zip, `ppt/slideLayouts/slideLayout${idx}.xml`)
	assert.ok(layout.includes('prst="triangle"'), 'shape not rendered on the master layout')
	assert.ok(layout.includes('<a:tbl>'), 'table not rendered on the master layout')
	assert.ok(layout.includes('<a:videoFile'), 'media not rendered on the master layout')
	assert.match(await readPart(zip, `ppt/slideLayouts/_rels/slideLayout${idx}.xml.rels`), /media\/media/, 'media rel missing from the layout')
})

test('#28: friendly dataLabelPosition names are translated to OOXML codes', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [{ name: 'S', labels: ['A'], values: [1] }], { x: 1, y: 1, w: 4, h: 3, showValue: true, dataLabelPosition: 'outsideEnd' })

	assert.ok((await readChart(await writeZip(pptx))).includes('<c:dLblPos val="outEnd"/>'), 'friendly name not translated')
})

test('#28: a dataLabelPosition invalid for the chart type is dropped with a warning', async () => {
	const warnings: string[] = []
	const orig = console.warn
	console.warn = (msg: string) => warnings.push(msg)
	try {
		const pptx = new pptxgen()
		// 'bestFit' is pie-only - on a bar chart it makes PowerPoint offer to repair the file
		pptx.addSlide().addChart(pptx.ChartType.bar, [{ name: 'S', labels: ['A'], values: [1] }], { x: 1, y: 1, w: 4, h: 3, showValue: true, dataLabelPosition: 'bestFit' })

		assert.ok(!(await readChart(await writeZip(pptx))).includes('<c:dLblPos'), 'invalid dLblPos was emitted')
		assert.ok(warnings.some(msg => msg.includes('dataLabelPosition')), `no warning logged: ${warnings.join(' | ')}`)
	} finally {
		console.warn = orig
	}
})

test('#31: `compression` is honoured for every outputType, not just STREAM', async () => {
	const build = async (compression: boolean): Promise<number> => {
		const pptx = new pptxgen()
		// repetitive text compresses well, so the two sizes are clearly different
		pptx.addSlide().addText('compress me '.repeat(500), { x: 0.5, y: 0.5, w: 9, h: 5 })
		return ((await pptx.write({ outputType: 'nodebuffer', compression })) as Buffer).byteLength
	}

	assert.ok(await build(true) < await build(false), '`compression: true` was ignored for outputType: nodebuffer')
})

test('#37: a per-series color overrides the chartColors cycle', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [
		{ name: 'A', labels: ['Q1'], values: [1] },
		{ name: 'B', labels: ['Q1'], values: [2], color: 'FF0000' },
	], { x: 1, y: 1, w: 4, h: 3 })

	const xml = await readChart(await writeZip(pptx))
	const sers = [...xml.matchAll(/<c:ser>[\s\S]*?<\/c:ser>/g)].map(match => match[0])
	assert.equal(sers.length, 2)
	assert.ok(sers[1].includes('<a:srgbClr val="FF0000"/>'), 'series color override not applied')
	assert.ok(!sers[0].includes('<a:srgbClr val="FF0000"/>'), 'override leaked into the other series')
})

test('#36: table style flags and style id are emitted in a:tblPr', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTable([['A', 'B']], { x: 1, y: 1, w: 4, bandRow: true, firstRow: true, tableStyleId: '{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}' })

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(xml.includes('<a:tblPr firstRow="1" bandRow="1">'), `tblPr flags missing: ${/<a:tblPr[\s\S]*?tblPr>/.exec(xml)?.[0] ?? xml}`)
	assert.ok(xml.includes('<a:tableStyleId>{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}</a:tableStyleId>'), 'table style id missing')
})

test('#36: tables without style options still emit an empty a:tblPr', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTable([['A', 'B']], { x: 1, y: 1, w: 4 })
	assert.ok((await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')).includes('<a:tblPr/>'))
})

test('#35: images accept a line/outline and emit it in the picture spPr', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addImage({ data: PNG_4x2, x: 1, y: 1, w: 2, h: 1, line: { color: 'FF0000', width: 2, dashType: 'dash' } })

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const pic = /<p:pic>[\s\S]*?<\/p:pic>/.exec(xml)?.[0] ?? ''
	assert.ok(pic.includes('<a:ln w="25400">'), `picture outline width missing: ${pic}`)
	assert.ok(pic.includes('<a:srgbClr val="FF0000"/>'), 'picture outline color missing')
	assert.ok(pic.includes('<a:prstDash val="dash"/>'), 'picture outline dash type missing')
})
