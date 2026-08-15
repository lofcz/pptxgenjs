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
import { genTableToSlides } from '../src/gen-tables'
import type { TextPropsOptions } from '../src/core-interfaces'
import { assertEmbeddedFontContracts, assertPptxPackageContracts, assertSlideTimingStructure, assertSlideTransitionStructure } from './pptx-contracts'

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

test('#84: combined glow, softEdge, and reflection emit one CT_EffectList', async () => {
	const glow = { size: 8, color: '00AAFF', opacity: 0.6 }
	const softEdge = { radius: 4 }
	const reflection = { blur: 2, distance: 3, direction: 90, opacity: 0.4, scaleY: -1 }
	const pptx = new pptxgen()
	pptx.addSlide().addShape(pptx.ShapeType.rect, {
		x: 1, y: 1, w: 2, h: 1,
		fill: { color: 'FF0000' },
		glow, softEdge, reflection,
	})

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const spPr = /<p:spPr>[\s\S]*?<\/p:spPr>/.exec(xml)?.[0] ?? ''
	const lists = spPr.match(/<a:effectLst>[\s\S]*?<\/a:effectLst>/g) ?? []
	assert.equal(lists.length, 1, 'shape emitted multiple effectLst nodes')
	const effectList = lists[0]
	assert.ok(effectList.includes('<a:glow rad="'), 'missing glow')
	assert.ok(effectList.includes('<a:softEdge rad="'), 'missing softEdge')
	assert.ok(effectList.includes('<a:reflection '), 'missing reflection')
	assert.ok(effectList.includes('stA="40000"'), 'reflection opacity not converted')
	assert.ok(effectList.indexOf('<a:glow ') < effectList.indexOf('<a:reflection '), 'CT_EffectList: glow must precede reflection')
	assert.ok(effectList.indexOf('<a:reflection ') < effectList.indexOf('<a:softEdge '), 'CT_EffectList: reflection must precede softEdge')
	assert.equal(glow.size, 8, 'caller glow options were mutated')
	assert.equal(softEdge.radius, 4, 'caller softEdge options were mutated')
	assert.equal(reflection.direction, 90, 'caller reflection options were mutated')
})

test('#84: a single glow still emits one effectLst', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addShape(pptx.ShapeType.rect, {
		x: 1, y: 1, w: 2, h: 1,
		fill: { color: 'FF0000' },
		glow: { size: 8, color: '00AAFF', opacity: 0.6 },
	})

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const spPr = /<p:spPr>[\s\S]*?<\/p:spPr>/.exec(xml)?.[0] ?? ''
	const lists = spPr.match(/<a:effectLst>[\s\S]*?<\/a:effectLst>/g) ?? []
	assert.equal(lists.length, 1, 'single glow emitted multiple effectLst nodes')
	assert.ok(lists[0].includes('<a:glow rad="'), 'missing glow')
	assert.ok(!lists[0].includes('<a:softEdge'), 'unexpected softEdge')
	assert.ok(!lists[0].includes('<a:reflection'), 'unexpected reflection')
})

test('#84: text color does not duplicate shape effects onto the run', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('Hello', {
		x: 1, y: 1, w: 2, h: 1,
		color: '000000',
		glow: { size: 8, color: '00AAFF', opacity: 0.6 },
		softEdge: { radius: 4 },
		reflection: { blur: 2, distance: 3, direction: 90, opacity: 0.4, scaleY: -1 },
	})

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const spPr = /<p:spPr>[\s\S]*?<\/p:spPr>/.exec(xml)?.[0] ?? ''
	assert.equal((spPr.match(/<a:effectLst>/g) ?? []).length, 1, 'text shape emitted multiple effectLst nodes')
	assert.equal((xml.match(/<a:effectLst>/g) ?? []).length, 1, 'shape effects leaked onto the text run')
})

test('#1083: rich text writes one paragraph-properties element per paragraph', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText([
		{ text: 'Normal ' },
		{ text: 'bold', options: { bold: true } },
		{ text: ' normal' },
	], { x: 1, y: 1, w: 4, h: 1, bullet: { type: 'bullet' } })

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const paragraph = xml.match(/<a:p>[\s\S]*?<\/a:p>/)?.[0] ?? ''
	assert.equal((paragraph.match(/<a:pPr/g) ?? []).length, 1, 'rich text emitted multiple paragraph-properties elements')
	assert.ok(paragraph.includes('<a:t>bold</a:t>'), 'rich-text runs were not preserved')
})

test('#18: slide master name is XML-escaped', async () => {
	const pptx = new pptxgen()
	pptx.defineSlideMaster({ title: 'R&D "Q3" Master', objects: [] })
	pptx.addSlide({ masterName: 'R&D "Q3" Master' })

	const xml = await readPart(await writeZip(pptx), 'ppt/slideMasters/slideMaster1.xml')
	assert.ok(!/name="[^"]*&(?!amp;|quot;|lt;|gt;|apos;)/.test(xml), 'unescaped entity in cSld name')
})

test('#1443: notes master has no placeholder shapes PowerPoint repairs away', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addNotes('Speaker notes')

	const zip = await writeZip(pptx)
	const notesMaster = await readPart(zip, 'ppt/notesMasters/notesMaster1.xml')
	const notesSlide = await readPart(zip, 'ppt/notesSlides/notesSlide1.xml')
	assert.doesNotMatch(notesMaster, /<p:sp>/, 'notes master contains invalid placeholder shapes')
	assert.match(notesMaster, /<p:spTree>[\s\S]*<\/p:spTree>/, 'notes master is missing its shape tree')
	assert.match(notesSlide, /Speaker notes/, 'speaker notes were not preserved')
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

test('#1466: flat categories use strRef while multi-level categories keep multiLvlStrRef', async () => {
	const flat = new pptxgen()
	flat.addSlide().addChart(flat.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [10, 20] }], { x: 1, y: 1, w: 6, h: 4 })
	const flatChart = await readChart(await writeZip(flat))
	assert.match(flatChart, /<c:cat>\s*<c:strRef>/, 'flat categories were not written as strRef')
	assert.doesNotMatch(flatChart, /<c:multiLvlStrRef>/, 'flat categories used a multi-level reference')

	const multiLevel = new pptxgen()
	multiLevel.addSlide().addChart(multiLevel.ChartType.bar, [{ name: 'Sales', labels: [['Q1', 'Q2'], ['2026', '']], values: [10, 20] }], { x: 1, y: 1, w: 6, h: 4 })
	const multiLevelChart = await readChart(await writeZip(multiLevel))
	assert.match(multiLevelChart, /<c:cat>\s*<c:multiLvlStrRef>/, 'multi-level categories no longer use multiLvlStrRef')
})

test('#1430: embedded workbook preserves per-series data table formats and zeros', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart([
		{ type: pptx.ChartType.bar, data: [{ name: 'ABC', labels: ['2012', '2013'], values: [100000, 0] }], options: { dataTableFormatCode: '₹#,##0' } },
		{ type: pptx.ChartType.line, data: [{ name: 'Share', labels: ['2012', '2013'], values: [0.17, 0] }], options: { dataTableFormatCode: '0%' } },
	], [], { x: 1, y: 1, w: 6, h: 4 })

	const xlsx = await readEmbeddedXlsx(await writeZip(pptx))
	const sheet = await readPart(xlsx, 'xl/worksheets/sheet1.xml')
	const styles = await readPart(xlsx, 'xl/styles.xml')
	assert.match(sheet, /<c r="B3" s="1"><v>0<\/v><\/c>/, 'currency zero has no worksheet style')
	assert.match(sheet, /<c r="C3" s="2"><v>0<\/v><\/c>/, 'percentage zero has no worksheet style')
	assert.match(styles, /numFmtId="164" formatCode="₹#,##0"/, 'currency number format is absent')
	assert.match(styles, /numFmtId="165" formatCode="0%"/, 'percentage number format is absent')
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

test('#1188: pie chart titles support italic text', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.pie, [{ name: 'Sales', labels: ['Q1'], values: [1] }], {
		x: 1, y: 1, w: 4, h: 3, showTitle: true, title: 'Sales', titleItalic: true,
	})

	const title = (await readChart(await writeZip(pptx))).match(/<c:title>[\s\S]*?<\/c:title>/)?.[0] ?? ''
	assert.match(title, /<a:rPr[^>]* i="1"/, 'pie title italic was not emitted')
})

test('#1355: a scatter chart keeps a value x-axis in a combo chart', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart([
		{ type: pptx.ChartType.bar, data: [{ name: 'Bars', labels: ['Mon', 'Tue'], values: [17, 26] }], options: { barDir: 'bar' } },
		{ type: pptx.ChartType.scatter, data: [{ name: 'X', labels: ['Mon', 'Tue'], values: [1, 2] }, { name: 'Y', labels: ['Mon', 'Tue'], values: [25, 35] }], options: { secondaryValAxis: true, secondaryCatAxis: true } },
	], { x: 1, y: 1, w: 6, h: 3, valAxes: [{}, {}], catAxes: [{}, {}] })

	const chart = await readChart(await writeZip(pptx))
	assert.equal((chart.match(/<c:catAx>/g) ?? []).length, 1, 'scatter x-axis was emitted as a category axis')
	assert.equal((chart.match(/<c:valAx>/g) ?? []).length, 3, 'scatter combo chart is missing a value axis')
})

test('#26: serAxisLabelPos is honored', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar3d, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [1, 2] }], {
		x: 1, y: 1, w: 4, h: 3, barDir: 'col', serAxisLabelPos: 'high',
	})

	const chart = await readChart(await writeZip(pptx))
	assert.ok(chart.includes('val="high"'), 'serAxisLabelPos was ignored')
})

test('#976: scatter charts honor catAxisLabelPos', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.scatter, [
		{ name: 'X', values: [1, 2] },
		{ name: 'Y', values: [3, 4] },
	], { x: 1, y: 1, w: 4, h: 3, catAxisLabelPos: 'low' })

	assert.ok((await readChart(await writeZip(pptx))).includes('<c:tickLblPos val="low"/>'), 'scatter category-axis label position was ignored')
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

test('#1286: contain sizing preserves the ratio of mixed pixel dimensions', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addImage({
		data: PNG_4x2,
		x: '19%', y: '54%', w: 2899, h: 97,
		sizing: { type: 'contain', w: '36%', h: '3%' },
	})

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(xml.includes('<a:srcRect l="0" r="0" t="-20047" b="-20047"/>'), 'contain sizing mixed image units and produced invalid crop XML')
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

test('#1472: auto-paging one table does not move a sibling table', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	const options = { x: 0.5, y: 3.5, w: 4, autoPage: true }

	slide.addTable(Array.from({ length: 20 }, (_, idx) => [`Long table row ${idx}`]), options)
	options.x = 5
	slide.addTable([['Short table row 1'], ['Short table row 2']], options)

	assert.equal(pptx.slides.length, 2, 'the long table did not create a second slide')
	assert.equal(options.y, 3.5, 'auto-paging mutated the shared table position')

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const secondTable = /<p:graphicFrame>[\s\S]*?<p:cNvPr[^>]*name="Table 1"[\s\S]*?<\/p:graphicFrame>/.exec(xml)?.[0] ?? ''
	assert.ok(secondTable.includes(`<a:off x="${5 * 914400}" y="${3.5 * 914400}"/>`), 'the second table was not kept at its requested position')
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

test('#1235: HTML table conversion preserves fractional border widths', async () => {
	class Cell {
		innerText = 'A'
		offsetWidth = 100
		getAttribute (): null { return null }
	}
	class Row {
		cells = [new Cell()]
	}
	const cell = new Cell()
	const row = new Row()
	const globals = globalThis as unknown as Record<string, unknown>
	const original = Object.fromEntries(['document', 'window', 'HTMLTableCellElement', 'HTMLTableRowElement'].map(key => [key, globals[key]]))
	const styles: Record<string, string> = {
		'background-color': 'rgba(0, 0, 0, 0)', 'border-bottom-color': 'rgb(0, 0, 0)', 'border-bottom-width': '0px',
		'border-left-color': 'rgb(0, 0, 0)', 'border-left-width': '0.25px', 'border-right-color': 'rgb(0, 0, 0)', 'border-right-width': '0px',
		'border-top-color': 'rgb(0, 0, 0)', 'border-top-width': '0px', color: 'rgb(0, 0, 0)', 'font-family': 'Arial', 'font-size': '12px',
		'font-weight': 'normal', 'padding-bottom': '0px', 'padding-left': '0px', 'padding-right': '0px', 'padding-top': '0px', 'text-align': 'left', 'vertical-align': 'top',
	}
	Object.assign(globals, {
		document: {
			getElementById: () => ({}),
			querySelector: () => null,
			querySelectorAll: (selector: string) => selector === '#table tr:first-child td' ? [cell] : selector === '#table tbody tr' ? [row] : [],
		},
		window: { getComputedStyle: () => ({ getPropertyValue: (name: string) => styles[name] ?? '' }) },
		HTMLTableCellElement: Cell,
		HTMLTableRowElement: Row,
	})

	try {
		const pptx = new pptxgen()
		genTableToSlides(pptx, 'table', { w: 4 })
		assert.ok((await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')).includes('<a:lnL w="3175"'), 'fractional CSS border was rounded')
	} finally {
		Object.assign(globals, original)
	}
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
	assert.ok(layout.includes('<a:audioFile'), 'media not rendered on the master layout')
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

test('pie: dataLabelPosition inEnd and bestFit emit ST_DLblPos codes', async () => {
	for (const [input, code] of [['insideEnd', 'inEnd'], ['bestFit', 'bestFit']] as const) {
		const pptx = new pptxgen()
		pptx.addSlide().addChart(
			pptx.ChartType.pie,
			[{ name: 'Share', labels: ['A', 'B'], values: [40, 60] }],
			{ x: 0.5, y: 0.5, w: 4, h: 3, showPercent: true, dataLabelPosition: input },
		)
		const chart = await readChart(await writeZip(pptx))
		assert.ok(chart.includes(`<c:dLblPos val="${code}"/>`), `pie ${input} was not emitted as ${code}`)
		assert.ok(!chart.includes('<c:dLblPos val="ctr"/>'), `pie ${input} still forced center labels`)
	}
})

test('pie: series-level dLbls default to ctr and honor show* opts (no per-point dLbl)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.pie,
		[{ name: 'Share', labels: ['A', 'B', 'C'], values: [30, 50, 20] }],
		{ x: 0.5, y: 0.5, w: 4, h: 3, showPercent: true, showValue: true },
	)

	const chart = await readChart(await writeZip(pptx))
	const dLbls = /<c:dLbls>[\s\S]*?<\/c:dLbls>/.exec(chart)?.[0] ?? ''
	assert.ok(!dLbls.includes('<c:dLbl>'), 'pie without dataLabels must not emit per-point dLbl')
	assert.ok(dLbls.includes('<c:dLblPos val="ctr"/>'), 'pie series default position is ctr')
	assert.ok(dLbls.includes('<c:showPercent val="1"/>'), 'series showPercent was dropped')
	assert.ok(dLbls.includes('<c:showVal val="1"/>'), 'series showValue was dropped')
	assert.ok(dLbls.includes('<c:showCatName val="0"/>'), 'series showCatName must follow showLabel')
})

test('custom dataLabels: pie sparse overrides keep series-level dLbls', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.pie,
		[{
			name: 'Share',
			labels: ['A', 'B', 'C'],
			values: [30, 50, 20],
			dataLabels: [undefined, 'Only B'],
		}],
		{ x: 0.5, y: 0.5, w: 4, h: 3, showPercent: true, dataLabelPosition: 'outEnd' },
	)

	const chart = await readChart(await writeZip(pptx))
	const dLbls = /<c:dLbls>[\s\S]*?<\/c:dLbls>/.exec(chart)?.[0] ?? ''
	const pointLabels = [...dLbls.matchAll(/<c:dLbl>[\s\S]*?<\/c:dLbl>/g)].map(match => match[0])
	assert.equal(pointLabels.length, 1, 'sparse dataLabels must emit one per-point dLbl')
	assert.ok(pointLabels[0].includes('<c:idx val="1"/>'), 'custom dLbl idx')
	assert.ok(pointLabels[0].includes('<a:t>Only B</a:t>'), 'custom dLbl text')
	assert.ok(pointLabels[0].includes('<c:showPercent val="0"/>'), 'custom dLbl must not concatenate percent')
	assert.ok(pointLabels[0].includes('<c:dLblPos val="outEnd"/>'), 'custom dLbl inherits outEnd')
	// CT_DLbls: dLbl* then series Group_DLbls (dLblPos / show*)
	assert.ok(dLbls.indexOf('</c:dLbl>') < dLbls.lastIndexOf('<c:dLblPos val="outEnd"/>'), 'series dLblPos must follow per-point dLbl')
	assert.ok(dLbls.includes('<c:showPercent val="1"/>'), 'series-level showPercent must remain for other slices')
	assert.ok(!dLbls.includes('<c:dLblPos val="ctr"/>'), 'pie outEnd must not also emit ctr')
})

test('custom dataLabels: bar sparse overrides keep series-level showVal', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.bar,
		[{
			name: 'Sales',
			labels: ['A', 'B', 'C'],
			values: [10, 20, 30],
			dataLabels: [undefined, 'Mid'],
		}],
		{ x: 0.5, y: 0.5, w: 6, h: 4, showValue: true, dataLabelPosition: 'outEnd' },
	)

	const chart = await readChart(await writeZip(pptx))
	const dLbls = /<c:dLbls>[\s\S]*?<\/c:dLbls>/.exec(chart)?.[0] ?? ''
	const pointLabels = [...dLbls.matchAll(/<c:dLbl>[\s\S]*?<\/c:dLbl>/g)].map(match => match[0])
	assert.equal(pointLabels.length, 1, 'sparse dataLabels must emit one per-point dLbl')
	assert.ok(pointLabels[0].includes('<a:t>Mid</a:t>'), 'custom dLbl text')
	assert.ok(pointLabels[0].includes('<c:showVal val="0"/>'), 'custom dLbl must keep showVal off')
	assert.ok(dLbls.includes('<c:showVal val="1"/>'), 'series-level showVal must remain for other points')
	assert.ok(dLbls.includes('<c:dLblPos val="outEnd"/>'), 'series-level dLblPos must remain')
})

test('custom dataLabels: line series emits per-point dLbl inside series dLbls', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(
		pptx.ChartType.line,
		[{
			name: 'Trend',
			labels: ['A', 'B'],
			values: [1, 2],
			dataLabels: ['First', 'Second'],
		}],
		{ x: 0.5, y: 0.5, w: 6, h: 4, showValue: true },
	)

	const chart = await readChart(await writeZip(pptx))
	const ser = /<c:ser>[\s\S]*?<\/c:ser>/.exec(chart)?.[0] ?? ''
	assert.ok(ser.includes('<a:t>First</a:t>'), 'line custom label missing')
	assert.ok(ser.includes('<c:showVal val="1"/>'), 'line series-level showVal must remain')
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

test('#1231+#1299: repeated headers keep firstRow and rowspan columns on overflow slides', async () => {
	// Combined path: autoPageRepeatHeader sets tableHeaderRowsCount > 0 in flushCurrentRowToSlide,
	// so the first data row after the repeated header must keep rowspan placeholder columns.
	const long = Array.from({ length: 40 }, (_, idx) => `line ${idx}`).join('\n')
	const rows = [
		[{ text: 'H1' }, { text: 'H2' }, { text: 'H3' }],
		[
			{ text: 'span', options: { rowspan: 3 } },
			{ text: long },
			{ text: 'c' },
		],
		[{ text: 'r2b' }, { text: 'r2c' }],
		[{ text: 'r3b' }, { text: 'r3c' }],
		...Array.from({ length: 8 }, (_, idx) => [`r${idx + 4}a`, `r${idx + 4}b`, `r${idx + 4}c`]),
	]

	const pptx = new pptxgen()
	pptx.addSlide().addTable(rows, {
		x: 0.5,
		y: 0.5,
		w: 9,
		colW: [1, 4, 4],
		autoPage: true,
		autoPageRepeatHeader: true,
		fontSize: 18,
	})

	assert.ok(pptx.slides.length > 1, 'expected autoPage to create overflow slides')

	const zip = await writeZip(pptx)
	const slideNames = Object.keys(zip.files).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort()
	assert.equal(slideNames.length, pptx.slides.length)

	for (const name of slideNames) {
		const xml = await readPart(zip, name)
		assert.ok(/<a:tblPr[^>]*\bfirstRow="1"/.test(xml), `${name} missing firstRow="1" for repeated header`)
		const gridCols = (xml.match(/<a:gridCol /g) || []).length
		assert.equal(gridCols, 3, `${name} lost columns (got ${gridCols})`)
		assert.ok(xml.includes('>H1<') && xml.includes('>H2<') && xml.includes('>H3<'), `${name} missing repeated header cells`)
	}

	const firstXml = await readPart(zip, slideNames[0])
	assert.ok(/rowSpan="\d+"/.test(firstXml), 'opening slide missing rowSpan on the spanning cell')
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

test('OMML: package contracts hold and fragments normalize to a single a14:m', async () => {
	const fragment = '<m:f><m:num><m:r><m:t>1</m:t></m:r></m:num><m:den><m:r><m:t>2</m:t></m:r></m:den></m:f>'
	const oMathPara = '<m:oMathPara><m:oMath><m:r><m:t>x+y</m:t></m:r></m:oMath></m:oMathPara>'
	const alreadyWrapped = '<a14:m><m:oMath><m:r><m:t>z</m:t></m:r></m:oMath></a14:m>'

	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addText(
		[
			{ text: 'plain ' },
			{ text: '', options: { omml: fragment } },
			{ text: ' mid ' },
			{ text: '', options: { omml: oMathPara } },
			{ text: ' end ' },
			{ text: '', options: { omml: alreadyWrapped } },
		],
		{ x: 0.5, y: 0.5, w: 8, h: 1.2 },
	)
	// Shape-level omml must not replace sibling plain-text runs
	slide.addText(
		[
			{ text: 'keep ' },
			{ text: '', options: { omml: '<m:r><m:t>q</m:t></m:r>' } },
		],
		{ x: 0.5, y: 2, w: 6, h: 0.8, omml: '<m:oMath><m:r><m:t>LEAK</m:t></m:r></m:oMath>' },
	)

	const zip = await writeZip(pptx)
	await assertPptxPackageContracts(zip)
	const xml = await readPart(zip, 'ppt/slides/slide1.xml')

	const wraps = xml.match(/<a14:m[\s\S]*?<\/a14:m>/g) || []
	assert.equal(wraps.length, 4, 'expected four a14:m wrappers')
	for (const wrap of wraps) {
		assert.equal((wrap.match(/<a14:m[\s/>]/g) || []).length, 1, `nested a14:m: ${wrap}`)
	}
	assert.ok(xml.includes('<m:oMath') && xml.includes('<m:oMathPara'), 'inner fragment and oMathPara must both emit')
	assert.ok(xml.includes('<a:t>plain </a:t>'), 'plain text before fragment missing')
	assert.ok(xml.includes('<a:t>keep </a:t>'), 'shape-level omml leaked onto a sibling run')
	assert.ok(!xml.includes('LEAK'), 'shape-level omml must not inherit onto plain runs')
	assert.ok(xml.includes('<m:t>1</m:t>') && xml.includes('<m:t>2</m:t>'), 'wrapped fragment lost fraction parts')
	assert.ok(xml.includes('<m:t>x+y</m:t>'), 'oMathPara payload missing')
	assert.ok(xml.includes('<m:t>z</m:t>'), 'pre-wrapped a14:m payload missing')
})

test('OMML: TextPropsOptions exposes omml on the public typed API', () => {
	const opts: TextPropsOptions = { omml: '<m:oMath><m:r><m:t>x</m:t></m:r></m:oMath>' }
	assert.equal(typeof opts.omml, 'string')
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

	await assertEmbeddedFontContracts(zip, 'IBM Plex Sans')
	assert.ok(presentation.includes('saveSubsetFonts="true"'), 'missing saveSubsetFonts')
	// Regression: ensureEmbeddedFontLst must not corrupt the following defaultTextStyle tag
	assert.ok(presentation.includes('<p:defaultTextStyle>'), 'defaultTextStyle opening tag corrupted (missing >)')
	assert.ok(!presentation.includes('<p:defaultTextStyle<'), 'defaultTextStyle merged with embeddedFontLst')

	// Regression: fsType restricted/preview flags must be cleared so PowerPoint
	// never shows the "restricted fonts / read-only" dialog for addFont fonts.
	const fntName = Object.keys(zip.files).find(name => name.startsWith('ppt/fonts/') && name.endsWith('.fntdata'))
	const eot = await zip.file(fntName).async('uint8array')
	const dv = new DataView(eot.buffer, eot.byteOffset, eot.byteLength)
	const headerFsType = dv.getUint16(4 + 4 + 4 + 4 + 10 + 1 + 1 + 4, true) // EOT header fsType (LE)
	assert.strictEqual(headerFsType & 0x000f, 0, `EOT header fsType restricted bits set: 0x${headerFsType.toString(16)}`)
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
	assertSlideTimingStructure(xml)
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
	const timing = assertSlideTimingStructure(xml)
	assert.ok(timing.presetClasses.includes('entr'), 'entrance class missing')
	assert.ok(xml.includes('presetID="10"'), 'fadein presetID missing')
	assert.ok(xml.includes('xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"'), 'math xmlns must stay')
	assert.ok(xml.trimEnd().endsWith('</p:sld>'), 'timing must be inside p:sld')
})

test('Content_Types: every slide part has an Override (ECMA-376 §13.3.8 slide+xml)', async () => {
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
	assert.ok(layout.includes('anchor="ctr"'), 'placeholder valign middle → anchor=ctr, got bodyPr context missing in layout')
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

test('guiwoda/fix-text-margin-trbl: bodyPr insets follow ECMA-376 CT_TextBodyProperties', async () => {
	// ECMA-376 Part 1 §5.1.5.1.1: lIns=left, tIns=top, rIns=right, bIns=bottom (ST_Coordinate32 EMUs).
	// Spec example uses 91440 EMU = 0.1"; 1pt = 12700 EMU (ONEPT). API margin is TRBL.
	const pptx = new pptxgen()
	pptx.addSlide().addText('margin:[5,5,5,40]', {
		x: 0.5, y: 0.5, w: 3, h: 1,
		margin: [5, 5, 5, 40],
		fill: { color: 'F1F1F1' },
	})

	const slide = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const bodyPr = /<a:bodyPr[^>]*>/.exec(slide)?.[0] ?? ''
	assert.ok(bodyPr.includes('tIns="63500"'), `tIns must be top=5pt, got ${bodyPr}`)
	assert.ok(bodyPr.includes('rIns="63500"'), `rIns must be right=5pt, got ${bodyPr}`)
	assert.ok(bodyPr.includes('bIns="63500"'), `bIns must be bottom=5pt, got ${bodyPr}`)
	assert.ok(bodyPr.includes('lIns="508000"'), `lIns must be left=40pt, got ${bodyPr}`)
	assert.ok(!bodyPr.includes('tIns="508000"'), 'tIns must not receive left (old LRBT mapping)')
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

/* ------------------------------------------------------------------------- */
/* Uncovered upstream bugs - each test below FAILS until the bug is fixed.    */
/* Grouped by theme. See scripts/issue-coverage.md for the full matrix.       */
/* ------------------------------------------------------------------------- */

test('#1443: notesMaster has no placeholder shapes (PowerPoint strips them in repair)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('hello', { x: 1, y: 1, w: 4, h: 1 })

	const nm = await readPart(await writeZip(pptx), 'ppt/notesMasters/notesMaster1.xml')
	// PowerPoint repair removes all 6 placeholder <p:sp> shapes from notesMaster (issue #1443).
	// A conformant notesMaster should ship an empty spTree (bg + clrMap + notesStyle only).
	assert.ok(!nm.includes('<p:ph '), 'notesMaster still emits placeholder shapes that PowerPoint removes during repair')
})

test('#1245: scatter valAxisCrossesAt=0 emits crossesAt="0", not crosses="autoZero"', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.scatter, [
		{ name: 'X-Axis', values: [0, 1, 2, 3] },
		{ name: 'Y', values: [9, 8, 7, 6], labels: ['a', 'b', 'c', 'd'] },
	], { x: 0.5, y: 0.6, w: 4, h: 3, valAxisCrossesAt: 0 })

	const chart = await readChart(await writeZip(pptx))
	// makeCatAxis does `${opts.valAxisCrossesAt || 'autoZero'}` - a legitimate 0 falls back to autoZero (issue #1245)
	assert.ok(chart.includes('<c:crossesAt val="0"/>'), 'valAxisCrossesAt=0 was falsy-collapsed to crosses="autoZero"')
	assert.ok(!chart.includes('<c:crosses val="autoZero"/>'), 'expected explicit crossesAt when user passes 0')
})

test('#856/#1135: addTable targets a master placeholder of type tbl', async () => {
	const pptx = new pptxgen()
	pptx.defineSlideMaster({
		title: 'M',
		background: { color: 'FFFFFF' },
		objects: [{ placeholder: { options: { name: 'tbl', type: 'tbl' as never, x: 1, y: 1, w: 8, h: 4 } } }],
	})
	const slide = pptx.addSlide({ masterName: 'M' })

	// `placeholder` is not accepted on ITableOptions - the table cannot be routed into the master tbl placeholder (issue #856)
	slide.addTable([['a', 'b'], ['1', '2']], { placeholder: 'tbl' } as never)
	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(/<p:ph[^>]*type="tbl"/.test(xml) || xml.includes('name="tbl"'), 'table did not bind to the tbl placeholder')
})

test('#1291: tables support RTL direction (rtl on a:tbl/a:tc)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTable([['א', 'ב'], ['1', '2']], { x: 1, y: 1, w: 6, rtlMode: true } as never)

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// ECMA-376 §5.1.6.13: rtl lives on <a:tblPr>, not <a:tbl> (issue #1291)
	assert.ok(/<a:tblPr[^>]*\brtl="1"/.test(xml), 'table rtl="1" attribute not emitted on a:tblPr')
})

test('#1339: identical image data is embedded once (content-hash dedupe), not per-use', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addImage({ data: PNG_4x2, x: 0, y: 0, w: 1, h: 1 })
	slide.addImage({ data: PNG_4x2, x: 2, y: 0, w: 1, h: 1 })
	slide.addImage({ data: PNG_4x2, x: 4, y: 0, w: 1, h: 1 })

	const zip = await writeZip(pptx)
	// Same-data images were only deduped by identical `path`; identical base64 `data` created one media file per use.
	// OPC Part 2 allows many rels to share one part - identical bytes must be embedded once (issue #1339).
	const media = Object.keys(zip.files).filter(k => /^ppt\/media\/.+/.test(k))
	assert.equal(media.length, 1, `expected 1 deduped media file for identical image data, got ${media.length}: ${media.join(', ')}`)
})

test('#1472: two autopage tables share slide1; overflow slides contain only the spilled table; no blank slide', async () => {
	const pptx = new pptxgen()
	pptx.defineLayout({ name: 'L', width: 10, height: 5.625 })
	pptx.layout = 'L'
	const slide = pptx.addSlide()

	const many = Array.from({ length: 60 }, (_, i) => [`t1-r${i}`, `${i}`])  // table-1 overflows
	const few = [['t2-r0', 'x'], ['t2-r1', 'y']]                              // table-2 fits
	slide.addTable(many, { x: 0.5, y: 3.0, w: 4, autoPage: true, rowH: 0.2 })
	slide.addTable(few, { x: 5.5, y: 3.0, w: 4, autoPage: true, rowH: 0.2 })

	const zip = await writeZip(pptx)
	const slideFiles = Object.keys(zip.files).filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).sort()
	const tableCount = async (f: string) => ((await zip.file(f)!.async('string')).match(/<p:graphicFrame>/g) || []).length
	const count1 = await tableCount('ppt/slides/slide1.xml')

	// slide1 keeps BOTH tables (side-by-side); each later slide holds only the continued table-1 rows.
	// Issue #1472 feared the small table-2 being displaced/duplicated onto overflow slides, or a stray blank slide.
	assert.equal(count1, 2, `slide1 should hold both tables, got ${count1}`)
	for (const f of slideFiles.slice(1)) {
		assert.equal(await tableCount(f), 1, `${f} should hold only the spilled table-1, got ${await tableCount(f)}`)
	}
	const s1 = await readPart(zip, 'ppt/slides/slide1.xml')
	const ys = [...s1.matchAll(/<p:graphicFrame>[\s\S]*?<a:off x="\d+" y="(\d+)"/g)].map(m => Number(m[1]))
	assert.ok(ys.every(y => Math.abs(y - 2743200) < 20000), `both first-slide tables keep own y=3in, got ${ys.join(',')}`)
})

/* ------------------------------------------------------------------------- */
/* Second batch of uncovered bugs - failing tests until fixed.                */
/* ------------------------------------------------------------------------- */

test('#1405: autopage table slides inherit the parent slide section (not Default-1)', async () => {
	const pptx = new pptxgen()
	pptx.addSection({ title: 'A' })
	pptx.addSection({ title: 'B' })
	const slide = pptx.addSlide({ sectionTitle: 'A' })   // parent lives in section A (NOT the last section)
	const many = Array.from({ length: 60 }, (_, i) => [`r${i}`, `${i}`])
	slide.addTable(many, { x: 1, y: 1, w: 6, autoPage: true, rowH: 0.2 })

	// addNewSlide() only inherits when the parent is in the LAST section; with 2+ sections the parent in A
	// isn't detected, so autopaged slides land in a new "Default-1" section instead of A (issue #1405).
	const sectA = pptx.sections.filter(s => s.title === 'A')[0]
	const defaults = pptx.sections.filter(s => s.title.startsWith('Default'))
	assert.ok(pptx.slides.length > 1, 'expected autopage to create extra slides')
	assert.equal(sectA._slides.length, pptx.slides.length,
		`all ${pptx.slides.length} slides should be in section A, got ${sectA._slides.length} (Default sections: ${defaults.map(d => d.title).join(',') || 'none'})`)
})

test('#1399: image sizing crop keeps the w/h container (srcRect applies within it)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addImage({
		data: 'image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAIAAADwyuo0AAAADklEQVR4nGP4jwQYkDkANvEX6SAXxcIAAAAASUVORK5CYII=',
		x: 1, y: 1, w: 5, h: 3,
		sizing: { type: 'crop', x: 0.5, y: 0.5, w: 2, h: 2 },
	} as never)

	const xml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// ECMA-376 §5.1.10.55: srcRect crops the source blip; the <a:ext> frame is the independent on-slide bounding
	// box and must keep the requested w/h (issue #1399). 5x3in = 4572000 x 2743200 EMU.
	const pic = /<p:pic>[\s\S]*?<\/p:pic>/.exec(xml)?.[0] ?? ''
	const ext = /<a:ext cx="(\d+)" cy="(\d+)"/.exec(pic)
	assert.ok(ext, 'image has no <a:ext>')
	assert.equal(ext![1], '4572000', `crop frame cx must stay 5in, got ${ext![1]}`)
	assert.equal(ext![2], '2743200', `crop frame cy must stay 3in, got ${ext![2]}`)
	assert.ok(/<a:srcRect l="\d+" r="\d+" t="\d+" b="\d+"\/>/.test(pic), 'srcRect crop offsets present')
})

test('#1309: custom formatCode is applied (numFmt sourceLinked=0, not linked)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addChart(pptx.ChartType.bar, [{ name: 'S', labels: ['a', 'b'], values: [0.1, 0.2] }], {
		x: 1, y: 1, w: 5, h: 3,
		dataLabelFormatCode: '0.0%', showLabel: true,
		valAxisLabelFormatCode: '0.0%',
		catLabelFormatCode: '0.0%',
	})

	const chart = await readChart(await writeZip(pptx))
	const numFmts = [...chart.matchAll(/<c:numFmt formatCode="([^"]*)" sourceLinked="(\d)"\/>/g)].map(m => ({ code: m[1], linked: m[2] }))
	const custom = numFmts.filter(n => n.code.includes('%'))
	// ECMA-376 §5.7.2.122 CT_NumFmt: `sourceLinked` defaults to true, which IGNORES formatCode and uses the
	// workbook-linked format. To honor a custom mask the library must emit sourceLinked="0" (issue #1309).
	assert.ok(custom.length > 0, 'custom formatCode not written')
	assert.ok(custom.every(n => n.linked === '0'),
		`custom formatCode must use sourceLinked=0, got: ${JSON.stringify(custom)}`)
})

test('#1416: slide-master media filenames never collide with slide media (slide #1000+)', async () => {
	// Distinct image bytes per slide (else #1339 dedupe reuses one target and masks the collision).
	const pngUnique = (seed: number) => 'image/png;base64,' + Buffer.from([
		0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d, 0x49, 0x48, 0x44, 0x52,
		0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, seed & 255, (seed >>> 8) & 255, 0, 0,
	]).toString('base64')

	const pptx = new pptxgen()
	pptx.defineSlideMaster({ title: 'MSTR', objects: [{ image: { data: pngUnique(0xffff), x: 0, y: 0, w: 1, h: 1 } }] })
	// Masters number from 1000 (`_slideNum = 1000 + layouts + 1`); add enough slides to reach that block.
	for (let i = 0; i < 1002; i++) pptx.addSlide({ masterName: 'MSTR' }).addImage({ data: pngUnique(i), x: 0, y: 0, w: 1, h: 1 })

	const zip = await writeZip(pptx)
	const names = zip.file(/ppt\/media\/.+/).map(f => f.name).filter(n => !n.endsWith('/'))
	const dupes = names.filter((n, i) => names.indexOf(n) !== i)
	assert.deepEqual(dupes, [], `media filename collision(s) overwrite master/slide images: ${dupes.join(', ')}`)
	// The master rels must point at its own part, not share slide #1002's `image-1002-1.png`.
	const layout2 = await readPart(zip, 'ppt/slideLayouts/_rels/slideLayout2.xml.rels')
	const masterTarget = /Target="\.\.\/media\/([^"]+)"/.exec(layout2)?.[1]
	assert.ok(masterTarget && masterTarget.startsWith('layout-image-'), `master media must use layout- prefix, got: ${masterTarget}`)
	assert.ok(zip.file(`ppt/media/${masterTarget}`), `master media part missing: ${masterTarget}`)
})

test('#1286: mixed-unit image dims (w>=100 EMU, h<100 in) must not corrupt sizing aspect ratio', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addImage({
		data: PNG_4x2, x: 0, y: 0,
		w: 2899, h: 97, // getSmartParseNumber reads 2899 as EMU and 97 as inches -> unit mismatch
		sizing: { type: 'contain', w: 5, h: 1 },
	} as never)

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const srcRect = /<a:srcRect[^/]*\/>/.exec(slideXml)?.[0] ?? ''
	assert.ok(srcRect, 'expected a srcRect for contain sizing')
	// Before the fix imgRatio mixed EMU/inches producing l/r offsets in the billions (corrupt pptx).
	// Offsets are 1/1000 of a percent, so |offset| must stay within a sane bound, not astronomical.
	const offsets = [...srcRect.matchAll(/(-?\d+)/g)].map(m => Math.abs(Number(m[1])))
	assert.ok(offsets.every(n => n < 1000000), `corrupt srcRect offsets from unit-mismatched aspect: ${srcRect}`)
})

test('#1312: text caps option emits cap attribute on run properties (none|small|all)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText([
		{ text: 'small ', options: { caps: 'small' } },
		{ text: 'all ', options: { caps: 'all' } },
		{ text: 'plain', options: {} },
	], { x: 1, y: 1, w: 4, h: 1 })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// ECMA-376 §5.1.12.64 ST_TextCapsType — render-only capitalization.
	assert.ok(slideXml.includes('cap="small"'), 'caps:"small" not emitted')
	assert.ok(slideXml.includes('cap="all"'), 'caps:"all" not emitted')
	assert.equal((slideXml.match(/cap="/g) || []).length, 2, 'exactly the two capped runs should carry cap attributes')
})

test('#996: image bound to a placeholder inherits the placeholder geometry (not natural px size / 1x1)', async () => {
	const pptx = new pptxgen()
	pptx.defineSlideMaster({ title: 'M', objects: [{ placeholder: { options: { name: 'PH', type: 'image', x: 1, y: 1, w: 4, h: 2 } } }] })
	pptx.addSlide({ masterName: 'M' }).addImage({ data: PNG_4x2, placeholder: 'PH' } as never)

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const pic = /<p:pic>[\s\S]*?<\/p:pic>/.exec(slideXml)?.[0] ?? ''
	const m = /<a:off x="(\d+)" y="(\d+)"\/>\s*<a:ext cx="(\d+)" cy="(\d+)"/.exec(pic)
	assert.ok(m, 'pic xfrm not found')
	// 4x2 inch placeholder in EMU (914400/in) — not the natural 4x2 px (0.042in) nor the 1x1 default.
	assert.equal(m![3], String(4 * 914400), `cx should be placeholder 4in, got ${Number(m![3]) / 914400}in`)
	assert.equal(m![4], String(2 * 914400), `cy should be placeholder 2in, got ${Number(m![4]) / 914400}in`)
})

test('text wrap:false + overflow clip emit bodyPr attrs', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('unwrapped clipped code', {
		x: 1,
		y: 1,
		w: 2,
		h: 1,
		wrap: false,
		vertOverflow: 'clip',
		horzOverflow: 'clip',
	})

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const bodyPr = /<a:bodyPr[^>]*>/.exec(slideXml)?.[0] || ''
	assert.ok(bodyPr.includes('wrap="none"'), `wrap=none missing: ${bodyPr}`)
	assert.ok(bodyPr.includes('vertOverflow="clip"'), `vertOverflow missing: ${bodyPr}`)
	assert.ok(bodyPr.includes('horzOverflow="clip"'), `horzOverflow missing: ${bodyPr}`)
})

test('#1320: text columns emit numCol/spcCol on bodyPr', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('col text '.repeat(50), { x: 1, y: 1, w: 6, h: 3, columns: 3, columnGap: 0.5 })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// ECMA-376 §5.1.5.1.4 CT_TextBodyProperties@numCol/@spcCol; 0.5in gap = 457200 EMU.
	assert.ok(slideXml.includes('numCol="3"'), 'numCol not emitted')
	assert.ok(slideXml.includes('spcCol="457200"'), `spcCol should be 0.5in=457200EMU, slide: ${/<a:bodyPr[^>]*>/.exec(slideXml)?.[0]}`)
})

test('#1199: fit:{type:"shrink", fontScale, lnSpcReduction} emits normAutofit percentages', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('shrink me', { x: 1, y: 1, w: 2, h: 1, fit: { type: 'shrink', fontScale: 85, lnSpcReduction: 20 } })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// ECMA-376 §5.1.5.1.3 CT_TextNormalAutofit: values are 1000ths of a percent (85% -> 85000).
	assert.ok(slideXml.includes('<a:normAutofit fontScale="85000" lnSpcReduction="20000"/>'),
		`normAutofit attrs missing: ${/<a:normAutofit[^>]*\/>/.exec(slideXml)?.[0]}`)
})

test('#782: line.cap emits cap attribute on <a:ln> (flat|sq|rnd)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addShape(pptx.ShapeType.line, { x: 1, y: 1, w: 3, h: 0, line: { color: 'FF0000', width: 2, cap: 'rnd' } })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// ECMA-376 §5.1.2.1.34 `<a:ln>@cap` / ST_LineCap.
	assert.ok(/<a:ln w="\d+" cap="rnd">/.test(slideXml), `cap="rnd" not emitted: ${/<a:ln[^>]*>/.exec(slideXml)?.[0]}`)
})

test('#transition: base ECMA transition (fade, speed, advTm)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTransition({ type: 'fade', speed: 'slow', advTm: 2500 })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// ECMA-376 §19.3.1.50 CT_SlideTransition: spd + advTm attrs; placed after clrMapOvr, before </p:sld>.
	assertSlideTransitionStructure(slideXml, { type: 'fade' })
	assert.ok(/<p:transition spd="slow" advTm="2500"><p:fade\/><\/p:transition>/.test(slideXml),
		`transition missing: ${/<p:transition[\s\S]*?<\/p:transition>/.exec(slideXml)?.[0]}`)
})

test('#transition: directional base transition (push dir=r)', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTransition({ type: 'push', direction: 'r' })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assertSlideTransitionStructure(slideXml, { type: 'push' })
	assert.ok(slideXml.includes('<p:push dir="r"/>'), `push dir not emitted: ${/<p:transition[\s\S]*?<\/p:transition>/.exec(slideXml)?.[0]}`)
})

test('#transition: modern morph wraps in mc:AlternateContent with fallback', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addTransition({ type: 'morph', duration: 800 })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// MS-PPTX §2.6.1.1 p16:morph inside mc:Choice; base fade as mc:Fallback; p14:dur carries ms duration.
	assertSlideTransitionStructure(slideXml, { type: 'morph', modern: true, fallbackType: 'fade' })
	assert.ok(slideXml.includes('<mc:Choice Requires="p16">'), 'no p16 Choice')
	assert.ok(slideXml.includes('<p16:morph/>'), 'no p16:morph element')
	assert.ok(slideXml.includes('p14:dur="800"'), 'no p14:dur duration attr')
	assert.ok(slideXml.includes('mc:Ignorable="a14 p14"'), `slide root missing p14 ignorable: ${/<p:sld [^>]*>/.exec(slideXml)?.[0]}`)
})

test('#82: addAnimation + TransitionType emit structurally valid timing and transition', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addText('Hello', { x: 0.5, y: 0.5, w: 3, h: 0.5 })
	slide.addAnimation({ type: pptx.AnimationPreset.fadein, duration: 400, trigger: 'onClick' })
	slide.addTransition({ type: pptx.TransitionType.push, direction: 'l', speed: 'med' })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	const timing = assertSlideTimingStructure(slideXml)
	assert.ok(timing.presetClasses.includes('entr'), 'fadein must be an entrance preset')
	assert.ok(slideXml.includes('presetID="10"'), 'fadein presetID missing')
	assertSlideTransitionStructure(slideXml, { type: 'push' })
	assert.ok(slideXml.includes('<p:push dir="l"/>'), `push dir not emitted: ${/<p:transition[\s\S]*?<\/p:transition>/.exec(slideXml)?.[0]}`)
})

test('#gap3: guides emit p15:sldGuideLst in presentation.xml', async () => {
	const pptx = new pptxgen()
	pptx.guides = [{ orient: 'vert', pos: 3.5 }, { orient: 'horz', pos: 2, color: 'FF0000' }]
	pptx.addSlide().addText('x', { x: 1, y: 1, w: 1, h: 1 })

	const presXml = await readPart(await writeZip(pptx), 'ppt/presentation.xml')
	// MS-PPTX §2.4.3.3: pos is EMU (3.5in=3200400, 2in=1828800); clr child required.
	assert.ok(presXml.includes('<p15:sldGuideLst'), 'no sldGuideLst')
	assert.ok(presXml.includes('orient="vert" pos="3200400"'), `vert guide wrong: ${/<p15:guide[^>]*>/.exec(presXml)?.[0]}`)
	assert.ok(presXml.includes('orient="horz" pos="1828800"'), 'horz guide wrong')
	assert.ok(presXml.includes('<a:srgbClr val="FF0000"/>'), 'guide color missing')
})

test('#gap4: presentationPr emits defaultImageDpi + readonlyRecommended', async () => {
	const pptx = new pptxgen()
	pptx.defaultImageDpi = 220
	pptx.readonlyRecommended = true
	pptx.addSlide().addText('x', { x: 1, y: 1, w: 1, h: 1 })

	const presPrXml = await readPart(await writeZip(pptx), 'ppt/presProps.xml')
	// MS-PPTX §2.3.1.5 (p14) + §2.14.1.1 (p1710).
	assert.ok(presPrXml.includes('<p14:defaultImageDpi') && presPrXml.includes('val="220"'), `defaultImageDpi missing: ${presPrXml}`)
	assert.ok(presPrXml.includes('<p1710:readonlyRecommended') && presPrXml.includes('val="1"'), 'readonlyRecommended missing')
})

test('#gap5: threaded comments emit authors.xml + comments part + rels', async () => {
	const pptx = new pptxgen()
	pptx.commentAuthors = [{ name: 'Ada Lovelace', initials: 'AL' }]
	const s1 = pptx.addSlide()
	s1.addText('review me', { x: 1, y: 1, w: 3, h: 1 })
	s1.addComment({ text: 'Fix the title', author: 0, x: 1, y: 1, replies: [{ text: 'On it', author: 'Grace' }] })
	pptx.addSlide().addText('no comments', { x: 1, y: 1, w: 1, h: 1 })

	const zip = await writeZip(pptx)
	const authorsXml = await readPart(zip, 'ppt/authors.xml')
	const cmXml = await readPart(zip, 'ppt/comments/commentSlide1.xml')
	const ctXml = await readPart(zip, '[Content_Types].xml')
	const presRels = await readPart(zip, 'ppt/_rels/presentation.xml.rels')
	const slide1Rels = await readPart(zip, 'ppt/slides/_rels/slide1.xml.rels')
	const slide2Rels = await readPart(zip, 'ppt/slides/_rels/slide2.xml.rels')

	// authors.xml holds declared + reply-derived authors (Grace auto-added).
	assert.ok(authorsXml.includes('name="Ada Lovelace"'), 'declared author missing')
	assert.ok(authorsXml.includes('name="Grace"'), 'reply author not auto-collected')
	// comments part: cm anchored to slide via sldMkLst, has replyLst.
	assert.ok(cmXml.includes('<p188:cmLst'), 'no cmLst root')
	assert.ok(cmXml.includes('<pc:sldMkLst>'), 'no slide moniker anchor')
	assert.ok(cmXml.includes('<p188:replyLst>'), 'no replyLst')
	assert.ok(cmXml.includes('Fix the title') && cmXml.includes('On it'), 'comment/reply text missing')
	// content types + rels.
	assert.ok(ctXml.includes('application/vnd.ms-powerpoint.comments+xml'), 'comments content-type missing')
	assert.ok(ctXml.includes('application/vnd.ms-powerpoint.authors+xml'), 'authors content-type missing')
	assert.ok(presRels.includes('/relationships/authors'), 'presentation authors rel missing')
	assert.ok(slide1Rels.includes('/relationships/comments'), 'slide1 comments rel missing')
	assert.ok(!slide2Rels.includes('/relationships/comments'), 'slide2 should NOT have comments rel')
	// slide2 has no comments part.
	assert.ok(!zip.file('ppt/comments/commentSlide2.xml'), 'slide2 comments part should not exist')
})

test('#gap6: media trim/fade/bookmarks/isNarration emit on p14:media', async () => {
	const pptx = new pptxgen()
	const tinyAudio = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADQgD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAQAAAAAAAAAAABSAJAJAQgAAgAAAA0LS3ZssAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAE'
	pptx.addSlide().addMedia({
		type: 'audio', data: tinyAudio, x: 1, y: 1, w: 1, h: 1,
		trim: { st: 1000, end: 500 }, fade: { in: 250, out: 750 },
		bookmarks: [{ name: 'chorus', time: 30000 }], isNarration: true,
	})

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// ECMA-376: audio shapes must use <a:audioFile>, not <a:videoFile>.
	assert.ok(slideXml.includes('<a:audioFile r:link='), 'audio must emit a:audioFile')
	assert.ok(!slideXml.includes('<a:videoFile'), 'audio must NOT emit a:videoFile')
	// MS-PPTX §2.3.3.14: trim/fade/bmkLst are children of p14:media.
	assert.ok(slideXml.includes('<p14:trim st="1000" end="500"/>'), `trim missing: ${/<p14:media[\s\S]*?<\/p14:media>/.exec(slideXml)?.[0]}`)
	assert.ok(slideXml.includes('<p14:fade in="250" out="750"/>'), 'fade missing')
	assert.ok(slideXml.includes('<p14:bmk name="chorus" time="30000"/>'), 'bookmark missing')
	// §2.2.14 narration flag.
	assert.ok(slideXml.includes('<p15:isNarration') && slideXml.includes('val="1"'), 'isNarration missing')
})

test('#gap7: media autoplay/loop/fullScreen/mute emit timing-tree media nodes', async () => {
	const pptx = new pptxgen()
	const tinyAudio = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADQgD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAQAAAAAAAAAAABSAJAJAQgAAgAAAA0LS3ZssAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAE'
	const slide = pptx.addSlide()
	slide.addMedia({ type: 'audio', data: tinyAudio, x: 1, y: 1, w: 1, h: 1, autoplay: true, loop: true })
	slide.addMedia({ type: 'video', data: tinyAudio, x: 3, y: 1, w: 2, h: 1.5, autoplay: true, fullScreen: true, mute: true })
	// a plain media shape with no playback opts must NOT get a timing entry
	slide.addMedia({ type: 'audio', data: tinyAudio, x: 6, y: 1, w: 1, h: 1 })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// Timing tree exists because of the playback entries.
	assert.ok(slideXml.includes('<p:timing>'), 'no timing tree')
	// Media nodes are direct children of tmRoot childTnLst (no wrapping <p:par>, no mainSeq for media-only).
	assert.ok(!slideXml.includes('nodeType="mainSeq"'), 'media-only slide must not emit empty mainSeq')
	assert.ok(!slideXml.includes('<p:bldLst>'), 'media-only slide must not emit empty bldLst')
	// Audio node: autoplay → cond delay="0"; loop → repeatCount="indefinite" on cTn (python-pptx shape).
	assert.ok(slideXml.includes('<p:audio>'), 'no audio media node')
	assert.ok(
		/<p:audio><p:cMediaNode vol="80000"><p:cTn id="\d+" fill="hold" display="0" repeatCount="indefinite"><p:stCondLst><p:cond delay="0"\/>/.test(slideXml),
		`audio autoplay+loop shape wrong: ${/<p:audio>[\s\S]*?<\/p:audio>/.exec(slideXml)?.[0]}`
	)
	// Video node: fullScrn + mute + autoplay.
	assert.ok(
		/<p:video fullScrn="1"><p:cMediaNode vol="80000" mute="1"><p:cTn id="\d+" fill="hold" display="0"><p:stCondLst><p:cond delay="0"\/>/.test(slideXml),
		`video fullScrn/mute/autoplay wrong: ${/<p:video[\s\S]*?<\/p:video>/.exec(slideXml)?.[0]}`
	)
	// Plain media shape: only the two flagged shapes get media nodes.
	const audioNodes = (slideXml.match(/<p:audio>/g) || []).length
	const videoNodes = (slideXml.match(/<p:video[\s>]/g) || []).length
	assert.equal(audioNodes, 1, `expected 1 audio node, got ${audioNodes}`)
	assert.equal(videoNodes, 1, `expected 1 video node, got ${videoNodes}`)
})

test('#gap7b: no playback opts → no timing tree for media-only slide', async () => {
	const pptx = new pptxgen()
	const tinyAudio = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADQgD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAQAAAAAAAAAAABSAJAJAQgAAgAAAA0LS3ZssAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAE'
	pptx.addSlide().addMedia({ type: 'audio', data: tinyAudio, x: 1, y: 1, w: 1, h: 1 })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(!slideXml.includes('<p:timing>'), 'timing tree should be absent without playback opts')
	assert.ok(!slideXml.includes('<p:audio><p:cMediaNode'), 'no cMediaNode expected')
})

const TINY_AUDIO = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADQgD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAQAAAAAAAAAAABSAJAJAQgAAgAAAA0LS3ZssAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAE'

test('#gap7c: invalid media playback combinations throw', () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	assert.throws(
		() => slide.addMedia({ type: 'audio', data: TINY_AUDIO, x: 1, y: 1, w: 1, h: 1, fullScreen: true }),
		/fullScreen.*video/,
		'fullScreen on audio must throw'
	)
	assert.throws(
		() => slide.addMedia({ type: 'online', link: 'https://www.youtube.com/embed/Dph6ynRVyUc', x: 1, y: 1, w: 2, h: 1, autoplay: true }),
		/online/,
		'autoplay on online must throw'
	)
	assert.throws(
		() => slide.addMedia({ type: 'online', link: 'https://www.youtube.com/embed/Dph6ynRVyUc', x: 1, y: 1, w: 2, h: 1, mute: true }),
		/online/,
		'mute on online must throw'
	)
})

test('#gap7d: loop/mute without autoplay emit click-to-play delay', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addMedia({ type: 'video', data: TINY_AUDIO, x: 1, y: 1, w: 2, h: 1.5, loop: true, mute: true })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	assert.ok(
		/<p:video><p:cMediaNode vol="80000" mute="1"><p:cTn id="\d+" fill="hold" display="0" repeatCount="indefinite"><p:stCondLst><p:cond delay="indefinite"\/>/.test(slideXml),
		`click-to-play loop+mute shape wrong: ${/<p:video[\s\S]*?<\/p:video>/.exec(slideXml)?.[0]}`
	)
	assert.ok(!slideXml.includes('fullScrn='), 'fullScreen default must omit fullScrn')
})

test('#gap7e: timing-tree spid matches cNvPr and media relationships', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addMedia({ type: 'video', data: TINY_AUDIO, x: 1, y: 1, w: 2, h: 1.5, autoplay: true })

	const zip = await writeZip(pptx)
	const slideXml = await readPart(zip, 'ppt/slides/slide1.xml')
	const rels = await readPart(zip, 'ppt/slides/_rels/slide1.xml.rels')

	const cNvPr = /<p:cNvPr id="(\d+)"[^>]*><a:hlinkClick r:id="" action="ppaction:\/\/media"/.exec(slideXml)
	const spTgt = /<p:spTgt spid="(\d+)"\/>/.exec(slideXml)
	assert.ok(cNvPr && spTgt, 'missing media cNvPr or spTgt')
	assert.equal(spTgt?.[1], cNvPr?.[1], `spid ${spTgt?.[1]} must match media cNvPr id ${cNvPr?.[1]}`)

	const videoLink = /<a:videoFile r:link="(rId\d+)"\/>/.exec(slideXml)
	const mediaEmbed = /<p14:media[^>]* r:embed="(rId\d+)"/.exec(slideXml)
	assert.ok(videoLink, 'missing a:videoFile r:link')
	assert.ok(mediaEmbed, 'missing p14:media r:embed')
	assert.ok(
		rels.includes(`Id="${videoLink?.[1]}"`) && rels.includes('/relationships/video'),
		`video rel ${videoLink?.[1]} missing: ${rels}`
	)
	assert.ok(
		rels.includes(`Id="${mediaEmbed?.[1]}"`) && rels.includes('/relationships/media'),
		`media rel ${mediaEmbed?.[1]} missing: ${rels}`
	)
	assert.notEqual(videoLink?.[1], mediaEmbed?.[1], 'video r:link and media r:embed must be distinct rIds')
})

test('#gap2: slide zoom emits mc:AlternateContent sldZm + pic fallback', async () => {
	const pptx = new pptxgen()
	pptx.addSlide().addText('zoom source', { x: 1, y: 1, w: 2, h: 1 })
	pptx.addSlide().addText('zoom target', { x: 1, y: 1, w: 2, h: 1 })
	// zoom on slide 1 pointing at slide 2
	const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
	const z = pptx.slides[0] as unknown as { addZoom: (o: object) => void }
	z.addZoom({ slideNum: 2, x: 1, y: 4, w: 2, h: 1.13, cover: tinyPng, returnToParent: true })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// MS-PPTX §2.10: Choice p16:sldZm (sldId=255+2=257) + pic Fallback.
	assert.ok(slideXml.includes('<mc:AlternateContent'), 'no AlternateContent')
	assert.ok(slideXml.includes('Requires="p16"'), 'no p16 Choice')
	assert.ok(slideXml.includes('<p16:sldZm>'), 'no sldZm element')
	assert.ok(slideXml.includes('sldId="257"'), `target sldId wrong: ${/<p16:sldZmObj[^>]*>/.exec(slideXml)?.[0]}`)
	assert.ok(slideXml.includes('<p166:zmPr'), 'no zmPr')
	assert.ok(slideXml.includes('returnToParent="1"'), 'returnToParent missing')
	assert.ok(slideXml.includes('<mc:Fallback><p:pic>'), 'no pic fallback')
})

test('#gap2b: section zoom anchors to section GUID via sectionZm', async () => {
	const pptx = new pptxgen()
	const s1 = pptx.addSlide()
	pptx.addSection({ title: 'Intro' })
	s1.addText('section source', { x: 1, y: 1, w: 2, h: 1 })
	pptx.addSlide().addText('in section', { x: 1, y: 1, w: 2, h: 1 })
	const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
	const z = pptx.slides[0] as unknown as { addSectionZoom: (o: object) => void }
	z.addSectionZoom({ sectionTitle: 'Intro', x: 1, y: 4, w: 2, h: 1.13, cover: tinyPng })

	const zip = await writeZip(pptx)
	const slideXml = await readPart(zip, 'ppt/slides/slide1.xml')
	const presXml = await readPart(zip, 'ppt/presentation.xml')
	// MS-PPTX §2.9: p16:sectionZm + sectionId GUID matching the sectionLst entry.
	assert.ok(slideXml.includes('<p16:sectionZm>'), 'no sectionZm element')
	assert.ok(slideXml.includes('<p16:sectionZmObj sectionId="{'), 'no sectionId GUID')
	const m = /sectionId="(\{[0-9a-f-]+\})"/.exec(slideXml)
	assert.ok(m, 'sectionId not found')
	assert.ok(presXml.includes(`id="${m?.[1]}"`), `section GUID ${m?.[1]} not present in sectionLst`)
})

test('#gap2c: summary zoom emits summaryZm + gridLayout + grpSp fallback', async () => {
	const pptx = new pptxgen()
	pptx.addSection({ title: 'Summary' })
	const s1 = pptx.addSlide()
	s1.addText('summary source', { x: 1, y: 1, w: 2, h: 1 })
	pptx.addSlide().addText('target', { x: 1, y: 1, w: 2, h: 1 })
	const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
	const z = pptx.slides[0] as unknown as { addSummaryZoom: (o: object) => void }
	z.addSummaryZoom({ sectionTitle: 'Summary', x: 1, y: 4, w: 2, h: 1.13, cover: tinyPng, title: 'Go to Summary' })

	const slideXml = await readPart(await writeZip(pptx), 'ppt/slides/slide1.xml')
	// MS-PPTX §2.11: p16:summaryZm with summaryZmObj + required layout choice + grpSp fallback (§2.2.15).
	assert.ok(slideXml.includes('<p16:summaryZm>'), 'no summaryZm element')
	assert.ok(slideXml.includes('<p16:summaryZmObj sectionId="{'), 'no summaryZmObj sectionId')
	assert.ok(slideXml.includes('title="Go to Summary"'), 'title attr missing')
	assert.ok(slideXml.includes('<p16:gridLayout/>'), 'no gridLayout choice')
	assert.ok(slideXml.includes('<mc:Fallback><p:grpSp>'), 'summary zoom should use grpSp fallback')
})
