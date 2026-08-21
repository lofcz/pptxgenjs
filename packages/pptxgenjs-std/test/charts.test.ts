/**
 * Contracts for `pptxgenjs-plus-std/charts`.
 *
 * A waterfall is a construction, not a chart type: the riser must stay invisible and each bar must
 * span from the running total to running + delta. Both only hold in the generated package.
 */
import { test } from 'bun:test'
import assert from 'node:assert/strict'
import pptxgen from '../../../src/pptxgen'
import { assertPptxPackageContracts } from '../../../test/pptx-contracts'
import { waterfall } from '../src/charts'
import { grid } from '../src/layout'
import { chartXml, packageZip, series } from './helpers'

test('waterfall: builds a stacked bar chart with a transparent riser', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), {
		labels: ['Start', 'Sales', 'Costs'],
		values: [100, 45, -30],
		total: 'Net',
	}, { x: 0.5, y: 0.5, w: 9, h: 4.5, showValue: true })

	const xml = await chartXml(pptx)
	assert.match(xml, /<c:barChart>/, 'waterfall must emit a bar chart')
	assert.match(xml, /<c:grouping val="stacked"\/>/, 'bars must stack for the riser to work')
	assert.match(xml, /<c:barDir val="col"\/>/, 'waterfall bars are vertical')

	const found = series(xml)
	assert.equal(found.length, 3, 'riser + increase + decrease')
	assert.deepEqual(found[0].labels, ['Start', 'Sales', 'Costs', 'Net'], 'the total gets its own category')
	assert.deepEqual(found[0].values, [0, 100, 115, 0])
	assert.ok(found[0].noFill, 'the riser series must be transparent')
	assert.equal(found[1].name, 'Increase')
	assert.deepEqual(found[1].values, [100, 45, 0, 115], 'positive deltas plus the 115 total')
	assert.ok(!found[1].noFill, 'delta series must be filled')
	assert.equal(found[2].name, 'Decrease')
	assert.deepEqual(found[2].values, [0, 0, 30, 0], 'negative delta as a positive magnitude')
})

test('waterfall: data labels show the signed delta, and nothing on the zero-height bars', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), { labels: ['Up', 'Down'], values: [40, -15] }, { x: 1, y: 1, w: 6, h: 4, showValue: true })
	const [riser, up, down] = series(await chartXml(pptx))
	assert.deepEqual(up.dataLabels, ['40', ''], 'the increase labels its own bar and leaves the other blank')
	assert.deepEqual(down.dataLabels, ['', '-15'], 'the decrease keeps its sign rather than showing the magnitude')
	assert.deepEqual(riser.dataLabels, [], 'the riser carries no labels at all')
})

test('waterfall: without a total, the chart is exactly the deltas', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), { labels: ['A', 'B', 'C'], values: [5, 10, -3] }, { x: 1, y: 1, w: 6, h: 4 })
	const found = series(await chartXml(pptx))
	assert.equal(found.length, 3, 'the series count does not depend on the total')
	found.forEach(one => assert.equal(one.values.length, 3, 'no extra category is appended'))
	assert.deepEqual(found[0].values, [0, 5, 12], 'risers follow the running total 5, 15, 12')
	assert.deepEqual(found[1].values, [5, 10, 0])
	assert.deepEqual(found[2].values, [0, 0, 3])
})

test('waterfall: a negative running total still spans from zero', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), { labels: ['A', 'B'], values: [10, -25], total: 'Net' }, { x: 1, y: 1, w: 4, h: 3 })
	const found = series(await chartXml(pptx))
	assert.deepEqual(found[0].values, [0, -15, -15], 'riser must sit at the lower end of each span')
	assert.deepEqual(found[2].values, [0, 25, 15], 'the negative total is a downward bar from zero')
	assert.deepEqual(found[1].values, [10, 0, 0], 'nothing is drawn upward for a negative close')
})

test('waterfall: a single value produces one bar rising from zero', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), { labels: ['Only'], values: [7] }, { x: 1, y: 1, w: 4, h: 3 })
	const found = series(await chartXml(pptx))
	assert.deepEqual(found[0].values, [0], 'no riser under the first bar')
	assert.deepEqual(found[1].values, [7])
	assert.deepEqual(found[2].values, [0])
})

test('waterfall: a zero delta occupies its category without drawing a bar', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), { labels: ['A', 'Flat', 'B'], values: [10, 0, 5] }, { x: 1, y: 1, w: 4, h: 3 })
	const [riser, up, down] = series(await chartXml(pptx))
	assert.deepEqual(riser.values, [0, 10, 10], 'a zero delta does not move the running total')
	assert.deepEqual(up.values, [10, 0, 5], 'zero counts as non-negative, so it lands on the increase series')
	assert.deepEqual(down.values, [0, 0, 0])
})

test('waterfall: colors and series names are configurable', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), {
		labels: ['A', 'B'],
		values: [10, -5],
		increaseColor: '112233',
		decreaseColor: 'AABBCC',
		increaseName: 'Zuwachs',
		decreaseName: 'Abgang',
	}, { x: 1, y: 1, w: 4, h: 3 })

	const [riser, up, down] = series(await chartXml(pptx))
	assert.ok(riser.noFill, 'the riser stays transparent regardless of the configured colors')
	assert.equal(up.fillColor, '112233')
	assert.equal(down.fillColor, 'AABBCC')
	assert.equal(up.name, 'Zuwachs')
	assert.equal(down.name, 'Abgang')
})

test('waterfall: defaults distinguish increase from decrease', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), { labels: ['A', 'B'], values: [1, -1] }, { x: 1, y: 1, w: 4, h: 3 })
	const [, up, down] = series(await chartXml(pptx))
	assert.notEqual(up.fillColor, down.fillColor, 'the two directions must not default to the same color')
	assert.equal(up.fillColor, '2E7D32')
	assert.equal(down.fillColor, 'C62828')
})

test('waterfall: chart options pass through, but the construction is not overridable', async () => {
	const pptx = new pptxgen()
	waterfall(pptx.addSlide(), { labels: ['A'], values: [1] }, {
		x: 1, y: 1, w: 4, h: 3,
		showTitle: true,
		title: 'Bridge',
		showLegend: true,
		legendPos: 'b',
		barDir: 'bar',
		barGrouping: 'clustered',
	})

	const xml = await chartXml(pptx)
	assert.match(xml, /<a:t>Bridge<\/a:t>/, 'the title passes through to the chart')
	assert.match(xml, /<c:legendPos val="b"\/>/, 'legend options pass through to the chart')
	assert.match(xml, /<c:barDir val="col"\/>/, 'barDir stays vertical')
	assert.match(xml, /<c:grouping val="stacked"\/>/, 'grouping stays stacked')
	assert.doesNotMatch(xml, /<c:barDir val="bar"\/>/)
	assert.doesNotMatch(xml, /<c:grouping val="clustered"\/>/)
})

test('waterfall: returns the slide it was given, so calls chain', () => {
	const slide = new pptxgen().addSlide()
	const returned = waterfall(slide, { labels: ['A'], values: [1] }, { x: 1, y: 1, w: 4, h: 3 })
	assert.equal(returned, slide)
})

test('waterfall: rejects malformed input instead of emitting a broken chart', () => {
	const slide = new pptxgen().addSlide()
	assert.throws(() => waterfall(slide, { labels: ['A'], values: [1, 2] }), /same length/)
	assert.throws(() => waterfall(slide, { labels: ['A', 'B'], values: [1] }), /same length/)
	assert.throws(() => waterfall(slide, { labels: [], values: [] }), /at least one value/)
	assert.throws(() => waterfall(slide, { labels: ['A'], values: [Number.NaN] }), /values\[0\] is not a finite number/)
	assert.throws(() => waterfall(slide, { labels: ['A', 'B'], values: [1, Number.POSITIVE_INFINITY] }), /values\[1\] is not a finite number/)
})

test('waterfall: a slide composed only of std helpers is a valid package', async () => {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	const at = grid()
	slide.addText('Q3 bridge', { ...at(0, 0, 12, 1), fontSize: 28 })
	waterfall(slide, { labels: ['Open', 'Sales', 'Churn'], values: [100, 30, -12], total: 'Close' }, { ...at(0, 1, 12, 5), showValue: true })
	await assertPptxPackageContracts(await packageZip(pptx))
})
