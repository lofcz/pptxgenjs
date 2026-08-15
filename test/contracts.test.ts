/**
 * Semantic contracts for the core slide and chart paths.
 *
 * Unlike golden XML snapshots, these checks document the OOXML that matters and allow harmless
 * serializer changes without regenerating fixture files.
 */
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
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

test('contract: library version is generated from package.json', () => {
	const pptx = new pptxgen()
	assert.match(pptx.version, /^\d+\.\d+\.\d+/)
	assert.doesNotMatch(readFileSync(new URL('../src/pptxgen.ts', import.meta.url), 'utf8'), /const VERSION = '/)
})

test('contract: bar chart keeps its data and chart type', async () => {
	const xml = await readPart(zip, 'ppt/charts/chart1.xml')
	assert.match(xml, /<c:barChart>/, 'bar chart missing')
	assert.match(xml, /<c:v>Sales<\/c:v>/, 'series name missing')
	assert.match(xml, /<c:v>Q1<\/c:v>/, 'category label missing')
	assert.match(xml, /<c:v>20<\/c:v>/, 'series value missing')
})

const CHART_TRACKING_REF_URI = '{FD5EFAAD-0ECE-453E-9831-46B23BE46B34}'

function addSampleChart (pptx: pptxgen) {
	pptx.addSlide().addChart(pptx.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [10, 20] }], { x: 0.5, y: 4, w: 6, h: 3 })
}

async function writePptx (pptx: pptxgen): Promise<JSZip> {
	return await JSZip.loadAsync((await pptx.write({ outputType: 'nodebuffer' })) as Buffer)
}

async function readChartXml (pkg: JSZip): Promise<string> {
	const file = pkg.file(/ppt\/charts\/chart\d+\.xml$/)[0]
	assert.ok(file, 'missing chart part')
	return await file.async('string')
}

test('contract: unset chartTrackingRefBased does not emit the MS-PPTX tracking URI', async () => {
	const presPrXml = await readPart(zip, 'ppt/presProps.xml')
	assert.doesNotMatch(presPrXml, /FD5EFAAD-0ECE-453E-9831-46B23BE46B34/, 'chartTrackingRefBased URI must be absent when unset')
	assert.doesNotMatch(presPrXml, /chartTrackingRefBased/, 'chartTrackingRefBased element must be absent when unset')
})

test('contract: chartTrackingRefBased emits the MS-PPTX presentationPr URI', async () => {
	const unset = new pptxgen()
	addSampleChart(unset)
	const optIn = new pptxgen()
	optIn.chartTrackingRefBased = true
	addSampleChart(optIn)

	const [unsetZip, optInZip] = await Promise.all([writePptx(unset), writePptx(optIn)])
	const unsetPresPr = await readPart(unsetZip, 'ppt/presProps.xml')
	const optInPresPr = await readPart(optInZip, 'ppt/presProps.xml')

	assert.doesNotMatch(unsetPresPr, /FD5EFAAD-0ECE-453E-9831-46B23BE46B34/, 'unset deck must not emit the tracking URI')
	assert.match(optInPresPr, new RegExp(`uri="${CHART_TRACKING_REF_URI.replace(/[{}]/g, '\\$&')}"`), `missing MS-PPTX §2.2.12 URI ${CHART_TRACKING_REF_URI}: ${optInPresPr}`)
	assert.match(optInPresPr, /<p15:chartTrackingRefBased\b[^>]*\bval="1"/, `chartTrackingRefBased val missing: ${optInPresPr}`)
	assert.match(optInPresPr, /xmlns:p15="http:\/\/schemas\.microsoft\.com\/office\/powerpoint\/2012\/main"/, 'p15 2012/main namespace missing')

	const [unsetChart, optInChart] = await Promise.all([readChartXml(unsetZip), readChartXml(optInZip)])
	assert.equal(optInChart, unsetChart, 'chart XML must not change when chartTrackingRefBased is set')
})
