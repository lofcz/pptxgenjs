/**
 * PptxGenJS: End-to-end test
 * Generates a real .pptx (text + shape + table + chart) and verifies the output is a
 * valid OOXML package: correct zip structure, every XML part is well-formed, content present.
 * This exercises the full pipeline (gen-xml / gen-objects / gen-tables / gen-charts) that the
 * unit tests do not cover.
 *
 * Run with: `npm test` (node built-in test runner + tsx)
 */
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { JSZip } from '@node-projects/jszip'
import { XMLValidator } from 'fast-xml-parser'
import pptxgen from '../src/pptxgen'

const MARKER = 'ENTERPRISE_SMOKE_TEST'

let zip: JSZip

before(async () => {
	const pptx = new pptxgen()

	const slide = pptx.addSlide()
	slide.addText(MARKER, { x: 0.5, y: 0.2, w: 6, h: 0.5, fontSize: 18 })
	slide.addShape(pptx.ShapeType.rect, { x: 1, y: 1, w: 2, h: 1, fill: { color: 'FF0000' } })
	slide.addTable([['A', 'B'], ['1', '2']], { x: 0.5, y: 2.5, w: 5 })
	slide.addChart(pptx.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2', 'Q3'], values: [10, 20, 30] }], { x: 0.5, y: 4, w: 6, h: 3 })

	const buf = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer
	assert.ok(buf.length > 2000, `expected a non-trivial pptx, got ${buf.length} bytes`)
	zip = await JSZip.loadAsync(buf)
})

test('e2e: contains required OOXML parts', () => {
	const required = [
		'[Content_Types].xml',
		'_rels/.rels',
		'ppt/presentation.xml',
		'ppt/_rels/presentation.xml.rels',
		'ppt/slides/slide1.xml',
		'ppt/slides/_rels/slide1.xml.rels',
		'ppt/charts/chart1.xml',
	]
	for (const part of required) {
		assert.ok(zip.file(part), `missing required part: ${part}`)
	}
})

test('e2e: Content_Types declares the slide part', async () => {
	const types = await zip.file('[Content_Types].xml')!.async('string')
	assert.ok(
		types.includes('PartName="/ppt/slides/slide1.xml"'),
		'[Content_Types].xml must Override /ppt/slides/slide1.xml or PowerPoint reports corruption'
	)
})

test('e2e: every XML part is well-formed', async () => {
	const xmlParts = Object.keys(zip.files).filter(name => name.endsWith('.xml') || name.endsWith('.rels'))
	assert.ok(xmlParts.length > 0, 'no XML parts found in package')
	for (const name of xmlParts) {
		const content = await zip.file(name)!.async('string')
		const result = XMLValidator.validate(content)
		assert.equal(result, true, `malformed XML in ${name}: ${JSON.stringify(result)}`)
	}
})

test('e2e: slide contains the supplied text', async () => {
	const slideXml = await zip.file('ppt/slides/slide1.xml')!.async('string')
	assert.ok(slideXml.includes(MARKER), 'supplied text not found in slide XML')
})
