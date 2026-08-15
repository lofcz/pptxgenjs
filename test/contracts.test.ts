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

test('contract: gradient stops and color transforms keep DrawingML fill semantics', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addShape(pptx.ShapeType.rect, {
		x: 0.5, y: 0.5, w: 2, h: 1,
		fill: {
			type: 'gradient',
			gradient: {
				type: 'linear',
				angle: 90,
				stops: [
					{ color: { baseColor: 'accent1', tint: 40 }, pos: 0 },
					{ color: { baseColor: 'accent2', shade: 25, lumMod: 80 }, pos: 100 },
				],
			},
		},
	})
	slide.addShape(pptx.ShapeType.rect, {
		x: 3, y: 0.5, w: 2, h: 1,
		fill: { type: 'solid', color: '00FF00' },
	})
	slide.addShape(pptx.ShapeType.rect, {
		x: 5.5, y: 0.5, w: 2, h: 1,
		fill: { type: 'pattern', pattern: { prst: 'ltHorz', color: '000000', bgColor: 'FFFFFF' } },
	})
	slide.addShape(pptx.ShapeType.rect, {
		x: 0.5, y: 2, w: 2, h: 1,
		fill: { type: 'solid', color: { baseColor: 'bg1', shade: 10 } },
	})

	const fillsZip = await JSZip.loadAsync((await pptx.write({ outputType: 'nodebuffer' })) as Buffer)
	await assertPptxPackageContracts(fillsZip)
	const xml = await readPart(fillsZip, 'ppt/slides/slide1.xml')

	assert.match(xml, /<a:gradFill[^>]*>/, 'gradFill missing')
	const gsLst = xml.match(/<a:gsLst>([\s\S]*?)<\/a:gsLst>/)
	assert.ok(gsLst, 'gsLst missing')
	const stops = [...gsLst[1].matchAll(/<a:gs pos="(\d+)">/g)]
	assert.ok(stops.length >= 2, 'CT_GradientStopList requires at least 2 gs')
	for (const [, pos] of stops) {
		const n = Number(pos)
		assert.ok(n >= 0 && n <= 100000, `gs@pos ${pos} outside ST_PositiveFixedPercentage`)
	}
	assert.match(
		xml,
		/<a:gs pos="0"><a:schemeClr val="accent1"><a:tint val="40000"\/>/,
		'tint transform must be a child of schemeClr, not of gs'
	)
	assert.match(
		xml,
		/<a:schemeClr val="accent2"><a:lumMod val="80000"\/><a:shade val="25000"\/>/,
		'shade/lumMod transforms missing on gradient stop'
	)
	assert.match(xml, /<a:lin ang="5400000"/, 'linear shade angle missing')

	assert.match(xml, /<a:solidFill><a:srgbClr val="00FF00"\/>/, 'solid fill regressing')
	assert.match(xml, /<a:pattFill prst="ltHorz">/, 'pattern fill regressing')
	assert.match(xml, /<a:solidFill><a:schemeClr val="bg1"><a:shade val="10000"\/>/, 'modified-theme fill regressing')
})
