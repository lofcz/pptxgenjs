/**
 * PptxGenJS: Semantic coverage for the object types the other suites never touch (issue #40)
 * Covers: the remaining chart types (scatter, bubble, radar, doughnut, 3D bar, multi-type),
 * gen-media (audio, video, online video), slide masters/layouts/placeholders, auto-paged
 * tables, sections, and shape outlines/shadows.
 * Run with: `npm test` (node built-in test runner + tsx)
 */
import { test, before } from 'node:test'
import assert from 'node:assert/strict'
import { JSZip } from '@node-projects/jszip'
import pptxgen from '../src/pptxgen'
import { assertEmbeddedXlsxContracts, assertPptxPackageContracts, readPart } from './pptx-contracts'

/** 1x1 transparent PNG (deterministic image payload) */
const PNG_1x1 =
	'image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
/** not a playable file - the generators only ever copy the bytes through */
const MP3 = 'audio/mp3;base64,QQ=='
const MP4 = 'video/mp4;base64,QQ=='

let zip: JSZip
let slideCount = 0
/** chart part numbering is module-global, so resolve parts by the order this file creates them */
const chartParts: Record<string, string> = {}

before(async () => {
	const pptx = new pptxgen()

	// A: master + layout with placeholders (gen-objects master path, gen-xml slideLayout/slideMaster)
	pptx.defineSlideMaster({
		title: 'COVERAGE_MASTER',
		background: { color: 'FFFFFF' },
		objects: [
			{ rect: { x: 0, y: 0, w: '100%', h: 0.5, fill: { color: '0088CC' } } },
			{ line: { x: 0, y: 0.5, w: '100%', h: 0, line: { color: '333333', width: 1 } } },
			{ text: { text: 'Master footer', options: { x: 0.5, y: 6.9, w: 4, h: 0.3, fontSize: 10 } } },
			{ placeholder: { options: { name: 'body', type: 'body', x: 0.5, y: 1, w: 9, h: 5 }, text: 'Placeholder text' } },
		],
		slideNumber: { x: 9, y: 6.9 },
	})

	pptx.addSection({ title: 'Charts' })

	// B: the chart types no other suite exercises
	const scatter = pptx.addSlide({ sectionTitle: 'Charts' })
	scatter.addChart(pptx.ChartType.scatter, [
		{ name: 'X-Axis', values: [1, 2, 3, 4] },
		{ name: 'Y-Value 1', values: [13, 20, 21, 25] },
	], { x: 0.5, y: 0.5, w: 4, h: 3 })
	chartParts.scatter = 'ppt/charts/chart1.xml'

	const bubble = pptx.addSlide({ sectionTitle: 'Charts' })
	bubble.addChart(pptx.ChartType.bubble, [
		{ name: 'X-Axis', values: [1, 2, 3] },
		{ name: 'Series 1', values: [10, 20, 30], sizes: [1, 2, 3] },
	], { x: 0.5, y: 0.5, w: 4, h: 3 })
	chartParts.bubble = 'ppt/charts/chart2.xml'

	const radar = pptx.addSlide({ sectionTitle: 'Charts' })
	radar.addChart(pptx.ChartType.radar, [{ name: 'Radar', labels: ['A', 'B', 'C'], values: [4, 8, 6] }], { x: 0.5, y: 0.5, w: 4, h: 3 })
	chartParts.radar = 'ppt/charts/chart3.xml'

	const doughnut = pptx.addSlide({ sectionTitle: 'Charts' })
	doughnut.addChart(pptx.ChartType.doughnut, [{ name: 'Share', labels: ['A', 'B'], values: [60, 40] }], { x: 0.5, y: 0.5, w: 4, h: 3, holeSize: 70 })
	chartParts.doughnut = 'ppt/charts/chart4.xml'

	const bar3d = pptx.addSlide({ sectionTitle: 'Charts' })
	bar3d.addChart(pptx.ChartType.bar3d, [{ name: '3D', labels: ['A', 'B'], values: [3, 7] }], { x: 0.5, y: 0.5, w: 4, h: 3 })
	chartParts.bar3d = 'ppt/charts/chart5.xml'

	const multi = pptx.addSlide({ sectionTitle: 'Charts' })
	multi.addChart([
		{ type: pptx.ChartType.bar, data: [{ name: 'Bars', labels: ['A', 'B'], values: [3, 7] }] },
		{ type: pptx.ChartType.line, data: [{ name: 'Line', labels: ['A', 'B'], values: [5, 5] }], options: { secondaryValAxis: true, secondaryCatAxis: true } },
	], { x: 0.5, y: 0.5, w: 4, h: 3, valAxes: [{}, {}], catAxes: [{}, {}] })
	chartParts.multi = 'ppt/charts/chart6.xml'

	// C: media - audio, video, online video (gen-media)
	const media = pptx.addSlide()
	media.addMedia({ type: 'audio', data: MP3, x: 0.5, y: 0.5, w: 2, h: 2 })
	media.addMedia({ type: 'video', data: MP4, x: 3, y: 0.5, w: 3, h: 2 })
	media.addMedia({ type: 'online', link: 'https://www.youtube.com/embed/Dph6ynRVyUc', x: 6.5, y: 0.5, w: 3, h: 2 })

	// D: shapes with outline + shadow, and an image on the master-backed layout
	const shapes = pptx.addSlide({ masterName: 'COVERAGE_MASTER' })
	shapes.addShape(pptx.ShapeType.roundRect, {
		x: 1, y: 1, w: 3, h: 1,
		fill: { color: 'EEEEEE' },
		line: { color: '333333', width: 2, dashType: 'dash' },
		shadow: { type: 'outer', blur: 3, offset: 2, angle: 45, opacity: 0.5, color: '000000' },
	})
	shapes.addImage({ data: PNG_1x1, x: 5, y: 1, w: 1, h: 1 })

	// E: auto-paged table (gen-tables paging path)
	const autoRows = Array.from({ length: 60 }, (_, idx) => [`Row ${idx}`, 'lorem ipsum dolor sit amet '.repeat(3)])
	pptx.addSlide().addTable(autoRows, { x: 0.5, y: 0.5, w: 9, autoPage: true, autoPageRepeatHeader: true })

	slideCount = pptx.slides.length

	zip = await JSZip.loadAsync((await pptx.write({ outputType: 'nodebuffer' })) as Buffer)
})

for (const type of ['scatter', 'bubble', 'radar', 'doughnut', 'bar3d', 'multi']) {
	test(`coverage: ${type} chart xml`, async () => {
		const xml = await readPart(zip, chartParts[type])
		if (type === 'multi') {
			assert.match(xml, /<c:barChart>/, 'multi chart is missing its bar series')
			assert.match(xml, /<c:lineChart>/, 'multi chart is missing its line series')
			return
		}
		const chartTag = type === 'bar3d' ? 'bar3DChart' : `${type}Chart`
		assert.match(xml, new RegExp(`<c:${chartTag}>`), `${type} chart type missing`)
	})
}

test('coverage: media slide xml (audio + video + online video)', async () => {
	const xml = await readPart(zip, 'ppt/slides/slide7.xml')
	// ECMA-376: audio → a:audioFile; video/online → a:videoFile. Embedded media also get p14:media.
	assert.equal([...xml.matchAll(/<a:audioFile /g)].length, 1, 'expected one audioFile')
	assert.equal([...xml.matchAll(/<a:videoFile /g)].length, 2, 'expected two videoFiles (video + online)')
	assert.equal([...xml.matchAll(/<p14:media /g)].length, 2, 'expected two embedded media (online video is linked, not embedded)')
})

test('coverage: media parts and content types registered', async () => {
	const types = await readPart(zip, '[Content_Types].xml')
	assert.match(types, /Extension="mp3"/, 'mp3 content type missing')
	assert.match(types, /Extension="mp4"/, 'mp4 content type missing')
	assert.ok(zip.file(/ppt\/media\/.*\.mp3$/).length > 0, 'mp3 media part missing')
	assert.ok(zip.file(/ppt\/media\/.*\.mp4$/).length > 0, 'mp4 media part missing')

	const rels = await readPart(zip, 'ppt/slides/_rels/slide7.xml.rels')
	assert.match(rels, /youtube\.com/, 'online video link missing from rels')
})

test('coverage: slide master xml (shapes + placeholder + slide number)', async () => {
	const xml = await readPart(zip, 'ppt/slideMasters/slideMaster1.xml')
	assert.match(xml, /<p:sldMaster/, 'slide master missing')
	assert.match(xml, /type="sldNum"/, 'slide number placeholder missing')
})

test('coverage: slide layout xml', async () => {
	const layouts = zip.file(/ppt\/slideLayouts\/slideLayout\d+\.xml$/)
	assert.ok(layouts.length > 0, 'no slide layouts emitted')
	const xml = await layouts[layouts.length - 1].async('string')
	assert.match(xml, /<p:sldLayout/, 'slide layout root missing')
	assert.match(xml, /<p:ph[^>]*type="body"/, 'body placeholder missing')
})

test('coverage: shape outline + shadow xml', async () => {
	const xml = await readPart(zip, 'ppt/slides/slide8.xml')
	assert.ok(xml.includes('<a:prstDash val="dash"/>'), 'shape outline dash missing')
	assert.ok(xml.includes('<a:outerShdw'), 'shape shadow missing')
})

test('coverage: sections are emitted', async () => {
	const pres = await readPart(zip, 'ppt/presentation.xml')
	assert.match(pres, /<p14:section name="Charts"/, 'section not emitted')
})

test('coverage: auto-paged table spans multiple slides with a repeated header', async () => {
	// slides 1-8 are fixed above, so anything beyond that came from auto-paging
	assert.ok(slideCount > 9, `auto-paging produced no extra slides (total ${slideCount})`)
	const pages = await Promise.all(Array.from({ length: slideCount - 8 }, async (_x, idx) => await readPart(zip, `ppt/slides/slide${idx + 9}.xml`)))
	assert.ok(pages.length > 1, 'table did not auto-page')
	assert.ok(pages.filter(xml => xml.includes('Row 0')).length > 1, '`autoPageRepeatHeader` did not repeat the header row onto later pages')
	// cell text is emitted one word per run, so the row index lands in its own `a:t`
	assert.ok(pages[pages.length - 1].includes('<a:t>59</a:t>'), 'last table row missing from the last page')
})

test('coverage: package contracts hold', async () => {
	await assertPptxPackageContracts(zip)
	await assertEmbeddedXlsxContracts(zip)
})
