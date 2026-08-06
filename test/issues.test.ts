/**
 * PptxGenJS: Regression tests for fixed issues
 * One check per bug fixed - each fails if the bug comes back.
 *
 * Run with: `npm test` (node built-in test runner + tsx)
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { JSZip } from '@node-projects/jszip'
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

test('#1231: rowspan + autoPage keeps column alignment on overflow slides', async () => {
	// Without the fix, overflow slides drop rowspan columns and PowerPoint misaligns the table.
	const long = Array.from({ length: 40 }, (_, idx) => `line ${idx}`).join('\n')
	const rows = [
		[
			{ text: 'span', options: { rowspan: 3 } },
			{ text: long },
			{ text: 'c' },
		],
		[{ text: 'r2b' }, { text: 'r2c' }],
		[{ text: 'r3b' }, { text: 'r3c' }],
		[{ text: 'r4a' }, { text: 'r4b' }, { text: 'r4c' }],
	]

	const pptx = new pptxgen()
	pptx.addSlide().addTable(rows, {
		x: 0.5,
		y: 0.5,
		w: 9,
		colW: [1, 4, 4],
		autoPage: true,
		fontSize: 18,
	})

	assert.ok(pptx.slides.length > 1, 'expected autoPage to create overflow slides')

	const zip = await writeZip(pptx)
	const slideNames = Object.keys(zip.files).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort()
	assert.equal(slideNames.length, pptx.slides.length)

	for (const name of slideNames) {
		const xml = await readPart(zip, name)
		const gridCols = (xml.match(/<a:gridCol /g) || []).length
		assert.equal(gridCols, 3, `${name} lost columns (got ${gridCols})`)
	}
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

test('pie: dataLabelPosition outEnd is honored (was hardcoded to ctr)', async () => {
	// rvntone/bugfix/pie_outEnd — series-level dLblPos for pie was always "ctr"
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.pie,
		[{ name: 'Share', labels: ['A', 'B', 'C'], values: [30, 50, 20] }],
		{ x: 0.5, y: 0.5, w: 4, h: 3, showPercent: true, dataLabelPosition: 'outsideEnd' },
	)

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('<c:dLblPos val="outEnd"/>'), 'pie outEnd was not emitted')
	assert.ok(!chart.includes('<c:dLblPos val="ctr"/>'), 'pie still forced center labels')
})

test('custom dataLabels: bar series emits escaped rich-text dLbl per point', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.bar,
		[{
			name: 'Sales',
			labels: ['A', 'B', 'C'],
			values: [10, 20, 30],
			dataLabels: ['Q1 & Co', 'Q2', 'Q3'],
		}],
		{ x: 0.5, y: 0.5, w: 6, h: 4, showValue: true, dataLabelFontSize: 12, dataLabelPosition: 'outEnd' },
	)

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('<c:dLbl>'), 'missing per-point dLbl')
	assert.ok(chart.includes('<c:tx><c:rich>'), 'missing rich-text custom label')
	assert.ok(chart.includes('<a:t>Q1 &amp; Co</a:t>'), 'custom label text was not XML-escaped')
	assert.ok(chart.includes('sz="1200"'), 'dataLabelFontSize not applied to custom label')
	assert.ok(chart.includes('<c:dLblPos val="outEnd"/>'), 'dataLabelPosition not applied to custom label')
	// Custom labels must not force showVal=1 (would concatenate value + custom text)
	const firstDlbl = /<c:dLbl>[\s\S]*?<\/c:dLbl>/.exec(chart)?.[0] ?? ''
	assert.ok(firstDlbl.includes('<c:showVal val="0"/>'), 'custom dLbl should keep showVal off')
})

test('Toukyh/fix-custom-label: labelsRange emits c15:datalabelsRange with escaped text', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.bar,
		[{
			name: 'Sales',
			labels: ['A', 'B', 'C'],
			values: [10, 20, 30],
			labelsRange: ['10 & up', '20', '30'],
		}],
		{ x: 0.5, y: 0.5, w: 6, h: 4, showValue: true },
	)

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('c15:datalabelsRange'), 'missing datalabelsRange extension')
	assert.ok(chart.includes('c15:showDataLabelsRange val="1"'), 'showDataLabelsRange should be on')
	assert.ok(chart.includes('<c:v>10 &amp; up</c:v>'), 'labelsRange text must be XML-escaped')
	assert.ok(chart.includes('c16:uniqueId'), 'missing series uniqueId')
	// schema: series-level datalabelsRange extLst comes after cat/val (dLbls may have its own earlier extLst)
	const ser = /<c:ser>[\s\S]*?<\/c:ser>/.exec(chart)?.[0] ?? ''
	const valIdx = ser.lastIndexOf('</c:val>')
	const rangeExtIdx = ser.indexOf('c15:datalabelsRange')
	assert.ok(valIdx > 0 && rangeExtIdx > valIdx, 'datalabelsRange extLst must follow cat/val')
})

test('Toukyh/fix-custom-label: multi-series get distinct uniqueIds', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.line,
		[
			{ name: 'A', labels: ['1', '2'], values: [1, 2], labelsRange: ['a1', 'a2'] },
			{ name: 'B', labels: ['1', '2'], values: [3, 4], labelsRange: ['b1', 'b2'] },
		],
		{ x: 0.5, y: 0.5, w: 6, h: 4 },
	)

	const chart = await readChart(await writeZip(pptx))
	const ids = [...chart.matchAll(/c16:uniqueId val="([^"]+)"/g)].map(m => m[1])
	assert.equal(ids.length, 2, 'expected one uniqueId per series with labelsRange')
	assert.notEqual(ids[0], ids[1], 'uniqueIds must not be hard-coded duplicates')
})

test('custom dataLabels: pie slice uses series dataLabels text', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.pie,
		[{
			name: 'Share',
			labels: ['A', 'B', 'C'],
			values: [30, 50, 20],
			dataLabels: ['Alpha', 'Beta', 'Gamma'],
		}],
		{ x: 0.5, y: 0.5, w: 4, h: 3, showPercent: true },
	)

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('<a:t>Alpha</a:t>'), 'pie custom label missing')
	assert.ok(chart.includes('<a:t>Beta</a:t>'), 'pie custom label missing')
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

test('#1299: autoPageRepeatHeader marks firstRow for accessibility', async () => {
	// PowerPoint's accessibility checker requires firstRow="1" for a semantic table header.
	// Visually repeating headers via autoPageRepeatHeader must also set that flag.
	const pptx = new pptxgen()
	pptx.addSlide().addTable(
		[
			['Header A', 'Header B'],
			...Array.from({ length: 40 }, (_, idx) => [`R${idx}A`, `R${idx}B`]),
		],
		{ x: 0.5, y: 0.5, w: 8, autoPage: true, autoPageRepeatHeader: true, fontSize: 18 },
	)

	const zip = await writeZip(pptx)
	assert.ok(pptx.slides.length > 1, 'expected autoPage overflow slides')
	const slideNames = Object.keys(zip.files).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort()
	for (const name of slideNames) {
		const xml = await readPart(zip, name)
		assert.ok(/<a:tblPr[^>]*\bfirstRow="1"/.test(xml), `${name} missing firstRow="1" for accessibility`)
	}

	// Explicit firstRow:false must still win over the autoPageRepeatHeader default
	const pptxOverride = new pptxgen()
	pptxOverride.addSlide().addTable([['H1', 'H2'], ['A', 'B']], {
		x: 0.5,
		y: 0.5,
		w: 8,
		autoPageRepeatHeader: true,
		firstRow: false,
	})
	const overrideXml = await readPart(await writeZip(pptxOverride), 'ppt/slides/slide1.xml')
	assert.ok(/<a:tblPr[^>]*\bfirstRow="0"/.test(overrideXml), 'explicit firstRow:false was ignored')
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

test('OMML: text runs with options.omml emit a14:m + m:oMath (PowerPoint-required wrapper)', async () => {
	// Minimal OMML fraction a/b (prebuilt — conversion is the host's job)
	const omml = [
		'<m:oMath>',
		'<m:f><m:fPr><m:ctrlPr/></m:fPr>',
		'<m:num><m:r><m:t>a</m:t></m:r></m:num>',
		'<m:den><m:r><m:t>b</m:t></m:r></m:den>',
		'</m:f>',
		'</m:oMath>',
	].join('')

	const pptx = new pptxgen()
	pptx.addSlide().addText(
		[
			{ text: 'Speed: ' },
			{ text: '', options: { omml } },
			{ text: ' trailing' },
		],
		{ x: 0.5, y: 0.5, w: 6, h: 1 },
	)

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(
		xml.includes('xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"'),
		'slide missing math namespace',
	)
	assert.ok(
		xml.includes('xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main"'),
		'slide missing a14 namespace (required for PowerPoint math)',
	)
	assert.ok(xml.includes('mc:Ignorable="a14"'), 'slide missing mc:Ignorable for a14')
	// Bare m:oMath is silently stripped by PowerPoint — must be inside a14:m
	assert.ok(/<a14:m[\s>][\s\S]*?<m:oMath[\s>]/.test(xml), 'm:oMath must be wrapped in a14:m')
	assert.ok(xml.includes('<m:f>'), 'missing fraction')
	assert.ok(xml.includes('<m:num>'), 'missing numerator')
	assert.ok(xml.includes('<m:den>'), 'missing denominator')
	assert.ok(xml.includes('<a:t>Speed: </a:t>'), 'surrounding plain text missing')
	assert.ok(xml.includes('<a:t> trailing</a:t>'), 'trailing plain text missing')
	assert.ok(xml.includes('txBox="1"'), 'math text shape should be a text box')
	// Mixed inline: plain | math | plain in the same paragraph
	assert.ok(
		/<a:t>Speed: <\/a:t><\/a:r><a14:m[\s\S]*?<\/a14:m><a:r>[\s\S]*?<a:t> trailing<\/a:t>/.test(xml),
		'inline math must interleave with plain text runs in one paragraph',
	)
})

test('Schema: a paragraph contains at most one a:pPr (ECMA-376 CT_TextParagraph)', async () => {
	// Multi-run paragraphs (mixed runs, bullets, align, omml) must emit a single `a:pPr`,
	// placed first. Duplicate `a:pPr` blocks make PowerPoint repair-destructively,
	// dropping runs/equations ("repairable" pptx with missing elements).
	const omml = '<m:oMath><m:r><m:t>v=s/t</m:t></m:r></m:oMath>'

	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addText(
		[
			{ text: 'Konstantní rychlost: ', options: { bullet: { code: '2022' } } },
			{ text: '', options: { omml } },
			{ text: ' trailing', options: { color: 'AA0000' } },
		],
		{ x: 0.5, y: 0.5, w: 6, h: 2 },
	)
	slide.addText(
		[
			{ text: 'left', options: { align: 'left' } },
			{ text: '', options: { omml, breakLine: true } },
			{ text: 'second', options: { align: 'right' } },
		],
		{ x: 0.5, y: 3, w: 6, h: 2 },
	)

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const paragraphs = xml.split(/<a:p>/).slice(1)
	assert.ok(paragraphs.length >= 2, 'expected multiple paragraphs')
	for (const para of paragraphs) {
		const body = para.split('</a:p>')[0]
		const pPrCount = (body.match(/<a:pPr[\s>]/g) || []).length
		assert.ok(pPrCount <= 1, `paragraph has ${pPrCount} pPr blocks: <a:p>${body.slice(0, 300)}`)
		if (pPrCount === 1) {
			assert.ok(body.startsWith('<a:pPr'), 'pPr must be the first child of a:p')
		}
	}
	assert.ok(/<a14:m[\s>][\s\S]*?<m:oMath[\s>]/.test(xml), 'm:oMath must be wrapped in a14:m')
})

test('mikemeerschaert/fix-autopage-last-line-text-array-bug: text array without breakLine is not duplicated (#1139)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTable(
		[
			[
				{ text: 'column 1 header', options: { bold: true } },
				{ text: 'column 2 header', options: { bold: true } },
			],
			[
				{
					text: [
						{ text: 'this will be duplicated' },
						{ text: '1', options: { superscript: true } },
					],
				},
				{ text: 'column 2' },
			],
		],
		{ x: 0.5, y: 0.5, w: 9, autoPage: true, fontSize: 14 },
	)

	const zip = await writeZip(pptx)
	const slideParts = Object.keys(zip.files).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
	let joined = ''
	for (const part of slideParts) {
		const xml = await readPart(zip, part)
		// autoPage tokenizes words into separate <a:t> runs — join before matching
		joined += [...xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)].map(m => m[1]).join('')
		assert.ok(!/<a:tc>\s*<a:txBody>\s*<a:bodyPr[^/]*\/>\s*<a:lstStyle\/>\s*<\/a:txBody>/s.test(xml), `${part} has a cell with no paragraphs`)
	}
	const hits = (joined.match(/this will be duplicated/g) || []).length
	assert.equal(hits, 1, `expected phrase once across slides, got ${hits} (joined=${JSON.stringify(joined)})`)
	assert.ok(joined.includes('this will be duplicated1'), 'superscript run should stay adjacent to the text array')
})

test('mikemeerschaert/fix-autopage-last-line-text-array-bug: newline in cell text still splits lines', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTable(
		[[{ text: 'LineA\nLineB' }, { text: 'ok' }]],
		{ x: 0.5, y: 0.5, w: 8, colW: [4, 4], autoPage: true, fontSize: 18 },
	)

	const slide = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(slide.includes('LineA'), 'missing LineA')
	assert.ok(slide.includes('LineB'), 'missing LineB')
	// Distinct paragraphs (or at least two <a:t> runs) — not collapsed into one token stream
	const tMatches = slide.match(/<a:t>[^<]*Line[AB][^<]*<\/a:t>/g) || []
	assert.ok(tMatches.length >= 2, `expected separate LineA/LineB text runs, got ${JSON.stringify(tMatches)}`)
})

test('lawtontom: autoPage table cells never emit empty text arrays', async () => {
	const pptx = new pptxgen()
	// Mix of empty / whitespace cells with tall content that forces autoPage
	const rows = [
		[{ text: 'H1' }, { text: 'H2' }, { text: 'H3' }],
		[{ text: '' }, { text: 'x'.repeat(80) }, { text: '   ' }],
		[{ text: 'a' }, { text: '' }, { text: 'b'.repeat(80) }],
		...Array.from({ length: 20 }, (_, i) => [{ text: `R${i}` }, { text: '' }, { text: 'c'.repeat(40) }]),
	]
	pptx.addSlide().addTable(rows, { x: 0.5, y: 0.5, w: 8, colW: [2, 3, 3], autoPage: true, fontSize: 18 })

	const zip = await writeZip(pptx)
	const slideParts = Object.keys(zip.files).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
	assert.ok(slideParts.length >= 1, 'expected at least one slide')
	for (const part of slideParts) {
		const xml = await readPart(zip, part)
		// Empty <a:t></a:t> is fine; a table cell with zero runs / null text is what PowerPoint repairs
		assert.ok(xml.includes('<a:tbl>'), `${part} missing table`)
		assert.ok(!/<a:tc>\s*<a:txBody>\s*<a:bodyPr[^/]*\/>\s*<a:lstStyle\/>\s*<\/a:txBody>/s.test(xml), `${part} has a cell with no paragraphs`)
	}
})

test('addFont: embeds fntdata + presentation embeddedFontLst', async () => {
	const buf = readFileSync(join(process.cwd(), 'test/fonts/IBMPlexSans-Regular.ttf'))
	const fontFile = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)

	const pptx = new pptxgen()
	await pptx.addFont({ fontFace: 'IBM Plex Sans', fontFile, fontType: 'ttf' })
	pptx.addSlide().addText('Hello', { x: 0.5, y: 0.5, w: 3, h: 1, fontFace: 'IBM Plex Sans', fontSize: 24 })

	const zip = await writeZip(pptx)
	const presentation = await readPart(zip, 'ppt/presentation.xml')
	const contentTypes = await readPart(zip, '[Content_Types].xml')
	const rels = await readPart(zip, 'ppt/_rels/presentation.xml.rels')

	assert.ok(presentation.includes('embedTrueTypeFonts="true"'), 'missing embedTrueTypeFonts')
	assert.ok(presentation.includes('saveSubsetFonts="true"'), 'missing saveSubsetFonts')
	assert.ok(presentation.includes('<p:embeddedFontLst>'), 'missing embeddedFontLst')
	assert.ok(presentation.includes('typeface="IBM Plex Sans"'), 'font typeface missing from presentation.xml')
	assert.ok(contentTypes.includes('Extension="fntdata"'), 'Content_Types missing fntdata Default')
	assert.ok(rels.includes('/relationships/font"'), 'presentation rels missing font relationship')
	assert.ok(Object.keys(zip.files).some(name => name.startsWith('ppt/fonts/') && name.endsWith('.fntdata')), 'missing ppt/fonts/*.fntdata')
})

test('#1430: line chart worksheet keeps zero values (opeepl/line-chart-cutoff-fix)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.line,
		[{ name: 'S', labels: ['A', 'B', 'C'], values: [10, 0, 5] }],
		{ x: 0.5, y: 0.5, w: 5, h: 3 },
	)

	const sheet = await readPart(await readEmbeddedXlsx(await writeZip(pptx)), 'xl/worksheets/sheet1.xml')
	assert.ok(sheet.includes('<v>0</v>'), 'line chart worksheet dropped a legitimate zero (cutoff)')
	assert.ok(sheet.includes('<v>10</v>') && sheet.includes('<v>5</v>'), 'expected neighboring series values')
})

test('image rectRadius: roundRect crop (niranjan-uma-shankar/html-to-pptx, selective)', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addImage({ data: PNG_4x2, x: 0.5, y: 0.5, w: 2, h: 2, rectRadius: 0.25 })
	slide.addImage({ data: PNG_4x2, x: 3, y: 0.5, w: 2, h: 2, rounding: true })

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const pics = [...xml.matchAll(/<p:pic>[\s\S]*?<\/p:pic>/g)].map(m => m[0])
	assert.equal(pics.length, 2)
	assert.ok(pics[0].includes('prst="roundRect"'), 'rectRadius should emit roundRect')
	assert.ok(pics[0].includes('name="adj"'), 'roundRect should include adj guide')
	assert.ok(pics[1].includes('prst="ellipse"'), 'rounding:true without rectRadius stays ellipse')
	assert.ok(!pics[1].includes('prst="roundRect"'), 'legacy rounding must not become roundRect')
})

test('#1436: scatter/bubble X-axis uses catLabelFormatCode (Ben-vD)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.scatter,
		[{ name: 'S', values: [1, 2, 3] }],
		{
			x: 0.5, y: 0.5, w: 5, h: 3,
			catLabelFormatCode: '0.00',
			valAxisLabelFormatCode: '0%',
		},
	)

	const chart = await readChart(await writeZip(pptx))
	const valAxes = [...chart.matchAll(/<c:valAx>[\s\S]*?<\/c:valAx>/g)].map(m => m[0])
	assert.ok(valAxes.length >= 2, `expected cat+val as two valAx blocks, got ${valAxes.length}`)
	// First valAx is the category/X axis for scatter; second is Y
	assert.ok(valAxes[0].includes('formatCode="0.00"'), `X axis missing catLabelFormatCode: ${valAxes[0].slice(0, 400)}`)
	assert.ok(valAxes[1].includes('formatCode="0%"'), `Y axis missing valAxisLabelFormatCode: ${valAxes[1].slice(0, 400)}`)
})

test('#1427: company metadata is XML-encoded in docProps/app.xml (hhulkko)', async () => {
	const pptx = new pptxgen()
	pptx.company = 'Acme & Co <Holdings>'
	pptx.addSlide().addText('t', { x: 0.5, y: 0.5, w: 3, h: 0.5 })

	const app = await readPart(await writeZip(pptx), 'docProps/app.xml')
	assert.ok(app.includes('<Company>Acme &amp; Co &lt;Holdings&gt;</Company>'), `company not escaped: ${app}`)
	assert.ok(!app.includes('<Company>Acme & Co'), 'raw ampersand must not appear in Company')
})

test('LanPodder/master: series errorrate emits c:errBars and packed Excel column', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [
		{ name: 'A', labels: ['Q1', 'Q2', 'Q3'], values: [10, 20, 30], errorrate: [0.5, 1, 1.5] },
		{ name: 'B', labels: ['Q1', 'Q2', 'Q3'], values: [4, 5, 6] },
	], { x: 0.5, y: 0.5, w: 5, h: 3 })

	const zip = await writeZip(pptx)
	const chart = await readChart(zip)
	assert.ok(chart.includes('<c:errBars>'), 'missing c:errBars')
	assert.ok(chart.includes('<c:errValType val="cust"/>'), 'missing custom errValType')
	assert.ok(chart.includes('<c:errBarType val="both"/>'), 'missing both errBarType')
	// Layout: A=labels, B=series A, C=series B, D=packed error for A only
	assert.ok(chart.includes('Sheet1!$D$2:$D$4'), `errBars should reference packed col D: ${chart.match(/<c:errBars>[\s\S]*?<\/c:errBars>/)?.[0]}`)
	assert.ok(chart.includes('<c:pt idx="0"><c:v>0.5</c:v></c:pt>'), 'errorrate cache missing 0.5')
	assert.equal((chart.match(/<c:errBars>/g) || []).length, 1, 'only series A has errorrate')

	const xlsx = await readEmbeddedXlsx(zip)
	const sheet = await readPart(xlsx, 'xl/worksheets/sheet1.xml')
	assert.ok(sheet.includes('r="D2"'), 'errorrate cell D2 missing')
	assert.ok(sheet.includes('<v>0.5</v>'), 'errorrate value 0.5 missing from sheet')
	assert.ok(sheet.includes('<v>1.5</v>'), 'errorrate value 1.5 missing from sheet')
})

test('LanPodder/master: errorrate column uses AA+ Excel letters when past column Z', async () => {
	// 1 label + 26 series => last series at col 27 (AA); packed error for series 25 => col 28 (AB)
	const labels = ['X']
	const series = Array.from({ length: 26 }, (_, i) => ({
		name: `S${i}`,
		labels,
		values: [i + 1],
		...(i === 25 ? { errorrate: [0.9] } : {}),
	}))
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, series, { x: 0.5, y: 0.5, w: 5, h: 3 })

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('Sheet1!$AB$2:$AB$2'), `expected packed error at AB: ${chart.match(/<c:errBars>[\s\S]*?<\/c:errBars>/)?.[0]}`)
})

test('Martin-N: CRLF split does not force breakLine on the last line', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('Line1\nLine2', { x: 0.5, y: 0.5, w: 4, h: 1, fontSize: 14 })

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(xml.includes('Line1'), 'missing Line1')
	assert.ok(xml.includes('Line2'), 'missing Line2')
	// Two paragraphs expected from the CRLF split
	const paras = xml.match(/<a:p>/g) || []
	assert.ok(paras.length >= 2, `expected >=2 paragraphs after CRLF split, got ${paras.length}`)
})

test('Martin-N: table cell vert alias emits tcPr vert', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTable(
		[[{ text: 'V', options: { vert: 'vert270' } }]],
		{ x: 0.5, y: 0.5, w: 2, h: 2 },
	)

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(xml.includes('vert="vert270"'), 'missing tcPr vert from Martin-N vert alias')
})

test('Martin-N: SVG fill.color recolors path fills in embedded SVG', async () => {
	const svg =
		'image/svg+xml;base64,' +
		Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10H0z" fill="#00FF00"/></svg>', 'utf8').toString('base64')
	const pptx = new pptxgen()
	pptx.addSlide().addImage({ data: svg, x: 0.5, y: 0.5, w: 1, h: 1, fill: { color: 'FF0000' } })

	const zip = await writeZip(pptx)
	const svgPart = Object.keys(zip.files).find(n => n.endsWith('.svg'))
	assert.ok(svgPart, 'missing svg media part')
	const svgXml = await readPart(zip, svgPart!)
	assert.ok(svgXml.includes('#FF0000') || svgXml.includes('fill="#FF0000"'), `SVG not recolored: ${svgXml}`)
	assert.ok(!svgXml.includes('#00FF00'), 'old green fill should be replaced')
})

test('ZentoSoft/master: connectors emit p:cxnSp with stCxn/endCxn and auto-layout', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addShape(pptx.ShapeType.rect, {
		sId: 20,
		x: 0.5, y: 1, w: 2, h: 1,
		fill: { color: '4472C4' },
	})
	slide.addShape(pptx.ShapeType.rect, {
		sId: 21,
		x: 5, y: 2, w: 2, h: 1,
		fill: { color: 'ED7D31' },
	})
	slide.addShape(pptx.ShapeType.line, {
		line: {
			width: 2,
			color: '000000',
			sourceId: 20,
			targetId: 21,
			sourceAnchorPos: pptx.anchor.RIGHT,
			targetAnchorPos: pptx.anchor.LEFT,
		},
	})

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(xml.includes('<p:cxnSp>'), 'missing p:cxnSp connector')
	assert.ok(xml.includes('id="20"'), 'source shape sId missing')
	assert.ok(xml.includes('id="21"'), 'target shape sId missing')
	assert.ok(xml.includes('<a:stCxn id="20"'), 'stCxn sourceId missing')
	assert.ok(xml.includes('<a:endCxn id="21"'), 'endCxn targetId missing')
	assert.ok(xml.includes(`idx="${pptx.anchor.RIGHT}"`), 'sourceAnchorPos missing')
	assert.ok(xml.includes(`idx="${pptx.anchor.LEFT}"`), 'targetAnchorPos missing')
	// Auto-layout should size the connector between the rects (non-zero extent)
	assert.ok(/<a:ext cx="[1-9]\d*"/.test(xml), 'connector auto-layout should produce non-zero width')
})

test('ZentoSoft/master: duplicate sId throws', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addShape(pptx.ShapeType.rect, { sId: 9, x: 0.5, y: 0.5, w: 1, h: 1, fill: { color: 'FF0000' } })
	slide.addShape(pptx.ShapeType.rect, { sId: 9, x: 2, y: 0.5, w: 1, h: 1, fill: { color: '00FF00' } })
	await assert.rejects(async () => await writeZip(pptx), /sId 9 is already in use/)
})

test('MelleB/feat/appear-on-click: appearOnClick emits appear clickEffect timing', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addImage({
		data: PNG_4x2,
		x: 1, y: 1, w: 2, h: 1,
		appearOnClick: true,
	})
	slide.addShape(pptx.ShapeType.rect, {
		x: 4, y: 1, w: 2, h: 1,
		fill: { color: '4472C4' },
		appearOnClick: true,
	})

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(xml.includes('<p:timing>'), 'missing p:timing')
	assert.ok(xml.includes('presetID="1"'), 'appear presetID=1 missing')
	assert.ok(xml.includes('presetClass="entr"'), 'entrance class missing')
	assert.ok(xml.includes('nodeType="clickEffect"'), 'clickEffect trigger missing')
	assert.ok(xml.includes('style.visibility'), 'appear visibility set missing')
	assert.ok(xml.includes('<p:clrMapOvr>'), 'clrMapOvr must remain (not dropped like upstream fork)')
})

test('animations: slide timing XML is emitted for text/shape/image (BapunHansdah fork)', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addText('Hello', {
		x: 0.5, y: 0.5, w: 3, h: 0.5,
		animation: 'fadein',
	})
	slide.addShape(pptx.ShapeType.rect, {
		x: 0.5, y: 1.5, w: 2, h: 1,
		fill: { color: '4472C4' },
		animation: { type: 'flyin', direction: 'left', duration: 500, trigger: 'withPrevious' },
	})
	slide.addImage({
		data: PNG_4x2,
		x: 4, y: 0.5, w: 2, h: 1,
		animation: { type: 'zoom', trigger: 'afterPrevious', duration: 800 },
	})

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(xml.includes('<p:timing>'), 'missing p:timing')
	assert.ok(xml.includes('<p:tnLst>'), 'missing p:tnLst')
	assert.ok(xml.includes('presetID="10"'), 'fadein presetID missing')
	assert.ok(xml.includes('presetClass="entr"'), 'entrance class missing')
	assert.ok(xml.includes('xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"'), 'math xmlns must stay')
	assert.ok(xml.trimEnd().endsWith('</p:sld>'), 'timing must be inside p:sld')
})

test('Content_Types: every slide part has an Override (missing entries corrupt PowerPoint)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('one', { x: 0.5, y: 0.5, w: 4, h: 1 })
	pptx.addSlide().addText('two', { x: 0.5, y: 0.5, w: 4, h: 1 })
	pptx.addSlide().addText('three', { x: 0.5, y: 0.5, w: 4, h: 1 })

	const types = await readPart(await writeZip(pptx), '[Content_Types].xml')
	for (const n of [1, 2, 3]) {
		assert.ok(
			types.includes(`/ppt/slides/slide${n}.xml`),
			`[Content_Types].xml missing Override for slide${n}.xml`
		)
	}
	// Still only one slideMaster Override — the #1444 regression must not return
	assert.equal(
		(types.match(/\/ppt\/slideMasters\/slideMaster\d+\.xml/g) || []).length,
		1,
		'expected exactly one slideMaster Override'
	)
})

test('mikemeerschaert/fix-placeholder-text-formatting-issues: placeholder gets valign+margin bodyPr', async () => {
	const pptx = new pptxgen()
	pptx.defineSlideMaster({
		title: 'PH_BODY_MASTER',
		objects: [{
			placeholder: {
				options: {
					name: 'body',
					type: 'body',
					x: 0.5, y: 1, w: 9, h: 4,
					valign: 'middle',
					margin: [10, 0, 0, 20],
				},
				text: 'placeholder text',
			},
		}],
	})
	pptx.addSlide({ masterName: 'PH_BODY_MASTER' })

	const zip = await writeZip(pptx)
	const layouts = await Promise.all([1, 2].map(async n => await readPart(zip, `ppt/slideLayouts/slideLayout${n}.xml`)))
	const layout = layouts.find(xml => xml.includes('placeholder text') || xml.includes('type="body"')) ?? ''
	assert.ok(layout.includes('anchor="ctr"'), `placeholder valign middle → anchor=ctr, got bodyPr context missing in layout`)
	assert.ok(layout.includes('tIns="127000"'), 'placeholder top margin 10pt')
	assert.ok(layout.includes('lIns="254000"'), 'placeholder left margin 20pt')
})

test('mikemeerschaert/fix-placeholder-text-formatting-issues: bullet.type=bullet keeps characterCode', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('Item', {
		x: 0.5, y: 0.5, w: 4, h: 1,
		bullet: { type: 'bullet', characterCode: '25CF' },
	})

	const slide = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(slide.includes('<a:buChar char="&#x25CF;"/>'), 'characterCode must survive type:"bullet"')
	assert.ok(!slide.includes('<a:buAutoNum'), 'type:"bullet" must not emit numbered bullets')
})

test('mikemeerschaert/add-color-option-to-bullets: bullet.color emits buClr before bullet glyph', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('Item', {
		x: 0.5, y: 0.5, w: 4, h: 1,
		color: 'FF0000',
		bullet: { characterCode: '25BA', color: '0000FF' },
	})

	const slide = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(slide.includes('<a:buClr>'), 'bullet.color must emit a:buClr')
	assert.ok(slide.includes('<a:buClr><a:srgbClr val="0000FF"/>'), 'bullet.color hex must win over text color')
	const buClrAt = slide.indexOf('<a:buClr>')
	const buCharAt = slide.indexOf('<a:buChar')
	assert.ok(buClrAt > -1 && buCharAt > buClrAt, 'buClr must precede buChar (OOXML order)')
})

test('mikemeerschaert/fix-inconsistent-margins: text margin array is TRBL', async () => {
	const pptx = new pptxgen()
	// TRBL: top=10pt, right=0, bottom=0, left=20pt
	pptx.addSlide().addText('m', {
		x: 0.5, y: 0.5, w: 3, h: 1,
		margin: [10, 0, 0, 20],
		fill: { color: 'EEEEEE' },
	})

	const slide = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const bodyPr = /<a:bodyPr[^>]*>/.exec(slide)?.[0] ?? ''
	// 10pt = 127000 EMU, 20pt = 254000 EMU (ONEPT = 12700)
	assert.ok(bodyPr.includes('tIns="127000"'), `expected top inset for 10pt, got ${bodyPr}`)
	assert.ok(bodyPr.includes('lIns="254000"'), `expected left inset for 20pt, got ${bodyPr}`)
	// Must NOT swap top/left the old LRBT way (which would put 10 on left and 20 on top)
	assert.ok(!bodyPr.includes('tIns="254000"'), 'top must not receive the left value (old LRBT bug)')
})

test('mikemeerschaert/fix-inconsistent-margins: text margin accepts inches (<1)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('m', {
		x: 0.5, y: 0.5, w: 3, h: 1,
		margin: 0.1,
		fill: { color: 'EEEEEE' },
	})

	const slide = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const bodyPr = /<a:bodyPr[^>]*>/.exec(slide)?.[0] ?? ''
	const expected = String(Math.round(914400 * 0.1)) // inch2Emu(0.1)
	assert.ok(bodyPr.includes(`tIns="${expected}"`), `expected inch margin ${expected} in ${bodyPr}`)
	assert.ok(bodyPr.includes(`lIns="${expected}"`), 'uniform inch margin on left')
})

test('istevkovski/prioritize-overlap: barOverlapPct wins over stacked default 100', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [
		{ name: 'A', labels: ['Q1', 'Q2'], values: [1, 2] },
		{ name: 'B', labels: ['Q1', 'Q2'], values: [3, 4] },
	], { x: 1, y: 1, w: 4, h: 3, barGrouping: 'stacked', barOverlapPct: 50 })

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('<c:overlap val="50"/>'), 'explicit barOverlapPct should override stacked 100')
	assert.ok(!chart.includes('<c:overlap val="100"/>'), 'stacked default overlap must not win')
})

test('istevkovski/prioritize-overlap: stacked without barOverlapPct still defaults to 100', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [
		{ name: 'A', labels: ['Q1'], values: [1] },
		{ name: 'B', labels: ['Q1'], values: [2] },
	], { x: 1, y: 1, w: 4, h: 3, barGrouping: 'stacked' })

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('<c:overlap val="100"/>'), 'stacked default overlap is 100')
})

test('christiankiely/fix-categories-google-slides: single-level cats use strRef not multiLvlStrRef', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [
		{ name: 'Sales', labels: ['Q1', 'Q2', 'Q3'], values: [1, 2, 3] },
	], { x: 1, y: 1, w: 4, h: 3 })

	const chart = await readChart(await writeZip(pptx))
	const cat = chart.match(/<c:cat>[\s\S]*?<\/c:cat>/)?.[0] ?? ''
	assert.ok(cat.includes('<c:strRef>'), 'single-level categories should use strRef for Google Slides')
	assert.ok(!cat.includes('<c:multiLvlStrRef>'), 'single-level categories must not use multiLvlStrRef')
	assert.ok(cat.includes('<c:pt idx="0"><c:v>Q1</c:v></c:pt>'), 'category labels present')
})

test('christiankiely: multi-level cats still use multiLvlStrRef', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [{
		name: 'West',
		labels: [
			['Gear', 'Berg', 'Motr'],
			['Mech', '', ''],
		],
		values: [11, 8, 3],
	}], { x: 1, y: 1, w: 4, h: 3 })

	const chart = await readChart(await writeZip(pptx))
	const cat = chart.match(/<c:cat>[\s\S]*?<\/c:cat>/)?.[0] ?? ''
	assert.ok(cat.includes('<c:multiLvlStrRef>'), 'multi-level categories keep multiLvlStrRef')
	assert.ok(!cat.includes('<c:strRef>'), 'multi-level categories should not use strRef inside cat')
})

test('RivaJ-github: firstSlideNum is written to ppt/presentation.xml', async () => {
	const pptx = new pptxgen()
	pptx.firstSlideNum = 5
	pptx.addSlide().addText('hi', { x: 0.5, y: 0.5, w: 3, h: 1 })

	const xml = await readPart(await writeZip(pptx), 'ppt/presentation.xml')
	assert.ok(xml.includes('firstSlideNum="5"'), 'custom firstSlideNum')

	const pptxDefault = new pptxgen()
	pptxDefault.addSlide().addText('hi', { x: 0.5, y: 0.5, w: 3, h: 1 })
	const xmlDefault = await readPart(await writeZip(pptxDefault), 'ppt/presentation.xml')
	assert.ok(xmlDefault.includes('firstSlideNum="1"'), 'default firstSlideNum is 1')
})

test('NateRadebaugh/transparent-markers: line marker fill can be transparent (noFill)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.line, [{ name: 'A', labels: ['1', '2'], values: [1, 2] }], {
		x: 0.5, y: 0.5, w: 4, h: 3,
		chartColors: ['transparent'],
		lineDataSymbol: 'circle',
		lineDataSymbolSize: 10,
	})

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('<c:marker>'), 'marker present')
	assert.ok(
		/<c:marker>[\s\S]*?<c:spPr>\s*<a:noFill\/>/.test(chart),
		'transparent marker fill emits noFill'
	)
	assert.ok(
		!/<c:marker>[\s\S]*?<c:spPr>\s*<a:solidFill>/.test(chart),
		'transparent marker must not emit solidFill'
	)
})

test('sambauers/gradients: flat linearGradient fill emits gradFill with position stops', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addShape(pptx.ShapeType.rect, {
		x: 0.5, y: 0.5, w: 3, h: 1,
		fill: {
			type: 'linearGradient',
			angle: 45,
			scaled: true,
			stops: [
				{ position: 0, color: '000000', transparency: 10 },
				{ position: 100, color: '333333', transparency: 50 },
			],
		},
	})

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(slideXml.includes('<a:gradFill'), 'gradFill present')
	assert.ok(slideXml.includes('<a:lin ang="2700000" scaled="1"/>'), 'linear angle 45°')
	assert.ok(slideXml.includes('<a:gs pos="0"><a:srgbClr val="000000"><a:alpha val="90000"/>'), 'stop 0')
	assert.ok(slideXml.includes('<a:gs pos="100000"><a:srgbClr val="333333"><a:alpha val="50000"/>'), 'stop 100')
})

test('rafalBujok/define_color_theme: theme.themeColors writes clrScheme + ModifiedThemeColor tint', async () => {
	const pptx = new pptxgen()
	pptx.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 })
	pptx.layout = 'LAYOUT_16x9'
	pptx.theme = {
		themeColors: [
			'1B1B1B', 'FFFFFF', '2D2D2D', 'F0F0F0',
			'0B5FFF', 'FF6B00', '6B7280', 'F59E0B', '06B6D4', '10B981',
			'2563EB', 'BE185D',
		],
	}
	const slide = pptx.addSlide()
	slide.addShape(pptx.ShapeType.rect, {
		x: 0.5, y: 0.5, w: 2, h: 1,
		fill: { type: 'solid', color: { baseColor: 'accent1', tint: 40 } },
	})

	const zip = await writeZip(pptx)
	const theme = await readPart(zip, 'ppt/theme/theme1.xml')
	assert.ok(theme.includes('name="Custom Theme"'), 'custom theme name')
	assert.ok(theme.includes('<a:accent1><a:srgbClr val="0B5FFF"/></a:accent1>'), 'accent1 from themeColors')
	assert.ok(theme.includes('<a:dk1><a:sysClr val="windowText" lastClr="1B1B1B"/></a:dk1>'), 'dk1 lastClr')

	const slideXml = await readPart(zip, 'ppt/slides/slide1.xml')
	assert.ok(
		slideXml.includes('<a:schemeClr val="accent1"><a:tint val="40000"/></a:schemeClr>'),
		'ModifiedThemeColor tint on shape fill'
	)
})
