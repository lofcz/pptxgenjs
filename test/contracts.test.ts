/**
 * Semantic contracts for the core slide and chart paths.
 *
 * Unlike golden XML snapshots, these checks document the OOXML that matters and allow harmless
 * serializer changes without regenerating fixture files.
 */
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { JSZip } from '@node-projects/jszip'
import pptxgen from '../src/pptxgen'
import { assertEmbeddedXlsxContracts, assertPptxPackageContracts, readPart } from './pptx-contracts'

let zip: JSZip

before(async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addText('Contract', { x: 0.5, y: 0.3, w: 6, h: 0.5, fontSize: 18, color: '0000FF', bold: true })
	slide.addShape(pptx.ShapeType.rect, { x: 1, y: 1.2, w: 2, h: 1, fill: { color: 'FF0000' } })
	slide.addTable([['A', 'B'], ['1', '2']], { x: 0.5, y: 2.6, w: 5 })
	slide.addChart(pptx.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [10, 20] }], { x: 0.5, y: 4, w: 6, h: 3 })
	zip = await JSZip.loadAsync((await pptx.write({ outputType: 'nodebuffer' })) as Buffer)
})

test('contract: package parts and relationships are coherent', async () => {
	await assertPptxPackageContracts(zip)
	await assertEmbeddedXlsxContracts(zip)
})

test('contract: rejects a part without a declared content type', async () => {
	const invalidZip = await JSZip.loadAsync(await zip.generateAsync({ type: 'nodebuffer' }))
	invalidZip.file('ppt/undeclared.bin', 'invalid')
	await assert.rejects(assertPptxPackageContracts(invalidZip), /package part has no content type/)
})

test('contract: validates relationship references with any legal ID', async () => {
	const invalidZip = await JSZip.loadAsync(await zip.generateAsync({ type: 'nodebuffer' }))
	const slideXml = await readPart(invalidZip, 'ppt/slides/slide1.xml')
	const referencePattern = /r:(id|embed|link)="rId\d+"/
	assert.match(slideXml, referencePattern, 'test presentation has no relationship reference')
	invalidZip.file('ppt/slides/slide1.xml', slideXml.replace(referencePattern, (_match, attribute) => `r:${attribute}="custom-id"`))
	await assert.rejects(assertPptxPackageContracts(invalidZip), /missing custom-id relationship/)
})

test('contract: slide keeps text, shape, and table semantics', async () => {
	const xml = await readPart(zip, 'ppt/slides/slide1.xml')
	assert.match(xml, /<a:t>Contract<\/a:t>/, 'text content missing')
	assert.match(xml, /<a:prstGeom prst="rect">/, 'rectangle shape missing')
	assert.match(xml, /<a:srgbClr val="FF0000"\/>/, 'shape fill missing')
	assert.match(xml, /<a:tbl>/, 'table missing')
	assert.equal([...xml.matchAll(/<a:gridCol /g)].length, 2, 'table grid width changed')
})

test('contract: bar chart keeps its data and chart type', async () => {
	const xml = await readPart(zip, 'ppt/charts/chart1.xml')
	assert.match(xml, /<c:barChart>/, 'bar chart missing')
	assert.match(xml, /<c:v>Sales<\/c:v>/, 'series name missing')
	assert.match(xml, /<c:v>Q1<\/c:v>/, 'category label missing')
	assert.match(xml, /<c:v>20<\/c:v>/, 'series value missing')
})
