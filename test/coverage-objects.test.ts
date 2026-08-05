/**
 * PptxGenJS: Snapshot coverage for the object types the other suites never touch (issue #40)
 * Covers: the remaining chart types (scatter, bubble, radar, doughnut, 3D bar, multi-type),
 * gen-media (audio, video, online video), slide masters/layouts/placeholders, auto-paged
 * tables, sections, and shape outlines/shadows.
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

/** 1x1 transparent PNG (deterministic image payload) */
const PNG_1x1 =
	'image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
/** not a playable file - the generators only ever copy the bytes through */
const MP3 = 'audio/mp3;base64,QQ=='
const MP4 = 'video/mp4;base64,QQ=='

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

async function part (name: string): Promise<string> {
	const file = zip.file(name)
	assert.ok(file, `missing part: ${name}`)
	return await file.async('string')
}

for (const type of ['scatter', 'bubble', 'radar', 'doughnut', 'bar3d', 'multi']) {
	test(`coverage: ${type} chart xml`, async () => {
		matchSnapshot(`cov-chart-${type}.xml`, await part(chartParts[type]))
	})
}

test('coverage: media slide xml (audio + video + online video)', async () => {
	const xml = await part('ppt/slides/slide7.xml')
	// NOTE: the library emits audio and video alike as `a:videoFile` + a `p14:media` extension
	assert.equal([...xml.matchAll(/<a:videoFile /g)].length, 3, 'expected three media objects (audio, video, online video)')
	assert.equal([...xml.matchAll(/<p14:media /g)].length, 2, 'expected two embedded media (online video is linked, not embedded)')
	matchSnapshot('cov-media.xml', xml)
})

test('coverage: media parts and content types registered', async () => {
	const types = await part('[Content_Types].xml')
	assert.match(types, /Extension="mp3"/, 'mp3 content type missing')
	assert.match(types, /Extension="mp4"/, 'mp4 content type missing')
	assert.ok(zip.file(/ppt\/media\/.*\.mp3$/).length > 0, 'mp3 media part missing')
	assert.ok(zip.file(/ppt\/media\/.*\.mp4$/).length > 0, 'mp4 media part missing')

	const rels = await part('ppt/slides/_rels/slide7.xml.rels')
	assert.match(rels, /youtube\.com/, 'online video link missing from rels')
})

test('coverage: slide master xml (shapes + placeholder + slide number)', async () => {
	matchSnapshot('cov-master.xml', await part('ppt/slideMasters/slideMaster1.xml'))
})

test('coverage: slide layout xml', async () => {
	const layouts = zip.file(/ppt\/slideLayouts\/slideLayout\d+\.xml$/)
	assert.ok(layouts.length > 0, 'no slide layouts emitted')
	matchSnapshot('cov-layout.xml', await layouts[layouts.length - 1].async('string'))
})

test('coverage: shape outline + shadow xml', async () => {
	const xml = await part('ppt/slides/slide8.xml')
	assert.ok(xml.includes('<a:prstDash val="dash"/>'), 'shape outline dash missing')
	assert.ok(xml.includes('<a:outerShdw'), 'shape shadow missing')
	matchSnapshot('cov-shape-line-shadow.xml', xml)
})

test('coverage: sections are emitted', async () => {
	const pres = await part('ppt/presentation.xml')
	assert.match(pres, /<p14:section name="Charts"/, 'section not emitted')
})

test('coverage: auto-paged table spans multiple slides with a repeated header', async () => {
	// slides 1-8 are fixed above, so anything beyond that came from auto-paging
	assert.ok(slideCount > 9, `auto-paging produced no extra slides (total ${slideCount})`)
	const pages = await Promise.all(Array.from({ length: slideCount - 8 }, async (_x, idx) => await part(`ppt/slides/slide${idx + 9}.xml`)))
	assert.ok(pages.length > 1, 'table did not auto-page')
	assert.ok(pages.filter(xml => xml.includes('Row 0')).length > 1, '`autoPageRepeatHeader` did not repeat the header row onto later pages')
	// cell text is emitted one word per run, so the row index lands in its own `a:t`
	assert.ok(pages[pages.length - 1].includes('<a:t>59</a:t>'), 'last table row missing from the last page')
})

test('coverage: all XML parts well-formed', async () => {
	for (const name of Object.keys(zip.files).filter(name => name.endsWith('.xml') || name.endsWith('.rels'))) {
		assert.equal(XMLValidator.validate(await part(name)), true, `malformed XML in ${name}`)
	}
})
