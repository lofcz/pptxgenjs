/**
 * PptxGenJS: Extended snapshot + e2e coverage for the XML generators.
 * Exercises code paths the base snapshot does not: table cell colspan/rowspan and
 * per-cell options (gen-tables), hyperlinks (gen-objects createHyperlinkRels),
 * images, speaker notes, and pie/line charts (gen-charts).
 * Update goldens after an intentional change: `UPDATE_SNAPSHOTS=1 npm test`
 *
 * Run with: `npm test` (node built-in test runner + tsx)
 */
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import JSZip from 'jszip'
import { XMLValidator } from 'fast-xml-parser'
import pptxgen from '../src/pptxgen'

const SNAP_DIR = join(dirname(fileURLToPath(import.meta.url)), '__snapshots__')

// 1x1 transparent PNG (deterministic image payload)
const PNG_1x1 =
	'image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

function normalize (xml: string): string {
	return xml
		.replace(/\r\n/g, '\n')
		.replace(/\{[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}\}/g, '{GUID}')
		.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g, 'DATE')
}

function matchSnapshot (name: string, actual: string): void {
	const file = join(SNAP_DIR, name)
	const norm = normalize(actual)
	if (process.env.UPDATE_SNAPSHOTS || !existsSync(file)) {
		mkdirSync(SNAP_DIR, { recursive: true })
		writeFileSync(file, norm)
		return
	}
	assert.equal(norm, readFileSync(file, 'utf8'), `snapshot mismatch for ${name} - run \`UPDATE_SNAPSHOTS=1 npm test\` if the change is intended`)
}

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
	matchSnapshot('cov-table.xml', await zip.file('ppt/slides/slide1.xml')!.async('string'))
})

test('coverage: hyperlink + image slide', async () => {
	matchSnapshot('cov-link-image.xml', await zip.file('ppt/slides/slide2.xml')!.async('string'))
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
	matchSnapshot('cov-pie.xml', await zip.file('ppt/charts/chart1.xml')!.async('string'))
})

test('coverage: line chart xml', async () => {
	matchSnapshot('cov-line.xml', await zip.file('ppt/charts/chart2.xml')!.async('string'))
})

test('coverage: all XML parts well-formed', async () => {
	const xmlParts = Object.keys(zip.files).filter(name => name.endsWith('.xml') || name.endsWith('.rels'))
	for (const name of xmlParts) {
		const content = await zip.file(name)!.async('string')
		assert.equal(XMLValidator.validate(content), true, `malformed XML in ${name}`)
	}
})
