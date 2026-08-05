/**
 * PptxGenJS: Snapshot (golden-file) tests for the XML generators (issue #6)
 * Pins generated OOXML so subtle regressions in gen-xml/gen-objects/gen-tables/gen-charts are caught.
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
import pptxgen from '../src/pptxgen'

const SNAP_DIR = join(dirname(fileURLToPath(import.meta.url)), '__snapshots__')

// Strip the only non-deterministic output (section GUIDs, created/modified timestamps) so snapshots are stable
function normalize (xml: string): string {
	return xml
		.replace(/\r\n/g, '\n') // git normalizes golden files to LF; compare on LF so CI stays stable
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
	assert.equal(norm, normalize(readFileSync(file, 'utf8')), `snapshot mismatch for ${name} - run \`UPDATE_SNAPSHOTS=1 npm test\` if the change is intended`)
}

let zip: JSZip

before(async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addText('Snapshot', { x: 0.5, y: 0.3, w: 6, h: 0.5, fontSize: 18, color: '0000FF', bold: true })
	slide.addShape(pptx.ShapeType.rect, { x: 1, y: 1.2, w: 2, h: 1, fill: { color: 'FF0000' } })
	slide.addTable([['A', 'B'], ['1', '2']], { x: 0.5, y: 2.6, w: 5 })
	slide.addChart(pptx.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [10, 20] }], { x: 0.5, y: 4, w: 6, h: 3 })
	const buf = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer
	zip = await JSZip.loadAsync(buf)
})

test('snapshot: slide1.xml (text + shape + table)', async () => {
	matchSnapshot('slide1.xml', await zip.file('ppt/slides/slide1.xml')!.async('string'))
})

test('snapshot: chart1.xml', async () => {
	matchSnapshot('chart1.xml', await zip.file('ppt/charts/chart1.xml')!.async('string'))
})
