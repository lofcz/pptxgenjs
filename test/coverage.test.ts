/**
 * PptxGenJS: Extended semantic + e2e coverage for the XML generators.
 * Exercises code paths the core contracts do not: table cell colspan/rowspan and
 * per-cell options (gen-tables), hyperlinks (gen-objects createHyperlinkRels),
 * images, speaker notes, and pie/line charts (gen-charts).
 * Run with: `npm test` (node built-in test runner + tsx)
 */
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { JSZip } from '@node-projects/jszip'
import pptxgen from '../src/pptxgen'
import { assertEmbeddedXlsxContracts, assertPptxPackageContracts, readPart } from './pptx-contracts'

// 1x1 transparent PNG (deterministic image payload)
const PNG_1x1 =
	'image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

let zip: JSZip

before(async () => {
	const pptx = new pptxgen()

	// Slide 1: table with colspan/rowspan + per-cell options (gen-tables null-sentinel paths)
	const slide1 = pptx.addSlide()
	slide1.addTable(
		[
			[{ text: 'Header', options: { colspan: 2, align: 'center', bold: true, fill: { color: 'DDDDDD' } } }],
			[
				{ text: 'Merged', options: { rowspan: 2, valign: 'middle', margin: [2, 2, 2, 2] } },
				{ text: 'Right', options: { align: 'right' } },
			],
			[{ text: 'Bottom', options: { border: [{ pt: 1, color: '0000FF' }, { pt: 1, color: '0000FF' }, { pt: 1, color: '0000FF' }, { pt: 1, color: '0000FF' }] } }],
		],
		{ x: 0.5, y: 0.5, w: 6 },
	)
	slide1.addNotes('Speaker notes for regression coverage')

	// Slide 2: hyperlink text run (gen-objects createHyperlinkRels) + image
	const slide2 = pptx.addSlide()
	slide2.addText(
		[
			{ text: 'Visit ', options: { fontSize: 14 } },
			{ text: 'the site', options: { fontSize: 14, hyperlink: { url: 'https://example.com', tooltip: 'Example' } } },
		],
		{ x: 0.5, y: 0.5, w: 6, h: 0.5 },
	)
	slide2.addImage({ data: PNG_1x1, x: 1, y: 1.5, w: 1, h: 1 })

	// Slide 3: pie + line charts (gen-charts)
	const slide3 = pptx.addSlide()
	slide3.addChart(pptx.ChartType.pie, [{ name: 'Share', labels: ['A', 'B', 'C'], values: [30, 50, 20] }], { x: 0.5, y: 0.5, w: 4, h: 3 })
	slide3.addChart(pptx.ChartType.line, [{ name: 'Trend', labels: ['Jan', 'Feb', 'Mar'], values: [1, 3, 2] }], { x: 5, y: 0.5, w: 4, h: 3 })

	const buf = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer
	zip = await JSZip.loadAsync(buf)
})

test('coverage: table slide with colspan/rowspan + cell options', async () => {
	const xml = await readPart(zip, 'ppt/slides/slide1.xml')
	assert.match(xml, /gridSpan="2"/, 'colspan was not emitted')
	assert.match(xml, /rowSpan="2"/, 'rowspan was not emitted')
	assert.match(xml, /<a:tcPr[^>]*anchor="ctr"/, 'vertical alignment was not emitted')
})

test('coverage: hyperlink + image slide', async () => {
	const xml = await readPart(zip, 'ppt/slides/slide2.xml')
	assert.match(xml, /<a:hlinkClick r:id="rId\d+"/, 'hyperlink click action missing')
	assert.match(xml, /<p:pic>/, 'image missing')
})

test('coverage: hyperlink relationship emitted', async () => {
	const rels = await zip.file('ppt/slides/_rels/slide2.xml.rels')!.async('string')
	assert.match(rels, /Target="https:\/\/example\.com"/, 'hyperlink target missing from slide rels')
})

test('coverage: speaker notes part emitted', async () => {
	const notes = zip.file('ppt/notesSlides/notesSlide1.xml')
	assert.ok(notes, 'notes slide part missing')
	assert.ok((await notes.async('string')).includes('Speaker notes'), 'notes text missing')
})

test('coverage: pie chart xml', async () => {
	assert.match(await readPart(zip, 'ppt/charts/chart1.xml'), /<c:pieChart>/, 'pie chart missing')
})

test('coverage: line chart xml', async () => {
	assert.match(await readPart(zip, 'ppt/charts/chart2.xml'), /<c:lineChart>/, 'line chart missing')
})

test('coverage: package contracts hold', async () => {
	await assertPptxPackageContracts(zip)
	await assertEmbeddedXlsxContracts(zip)
})
