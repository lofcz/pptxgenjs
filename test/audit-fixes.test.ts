/**
 * Regression tests for audit fixes not already covered by test/issues.test.ts.
 *
 * Run with: `npm test` (node built-in test runner + tsx)
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import pptxgen from '../src/pptxgen'

test('#20: caller-supplied options objects are not mutated', async () => {
	const pptx = new pptxgen()
	const chartOpts = { x: 1, y: 1, w: 4, h: 3, objectName: 'P&L' }
	const before = JSON.stringify(chartOpts)
	const slide = pptx.addSlide()
	slide.addChart(pptx.ChartType.bar, [{ name: 'S', labels: ['a'], values: [1] }], chartOpts)
	assert.equal(JSON.stringify(chartOpts), before, 'addChart must not mutate the options object')

	const shadow = { type: 'outer' as const, blur: 8, offset: 4, angle: 270, opacity: 0.5, color: '000000' }
	slide.addText('t', { x: 1, y: 2, w: 2, h: 0.5, shadow })
	await pptx.write({ outputType: 'nodebuffer' })
	assert.equal(shadow.angle, 270, 'shadow options must not be unit-converted in place')
	assert.equal(shadow.opacity, 0.5)
})

test('#31 phase 2: presentation-level compression enum is honored', async () => {
	const build = (): pptxgen => {
		const pptx = new pptxgen()
		const slide = pptx.addSlide()
		for (let i = 0; i < 20; i++) slide.addText('The quick brown fox jumps over the lazy dog. '.repeat(10), { x: 0.1, y: 0.1, w: 9, h: 5 })
		return pptx
	}
	const plain = build()
	assert.equal(plain.compression, 'none') // default
	const stored = (await plain.write({ outputType: 'nodebuffer' })) as Buffer

	const compressed = build()
	compressed.compression = 'best'
	const deflated = (await compressed.write({ outputType: 'nodebuffer' })) as Buffer
	assert.ok(deflated.length < stored.length, `expected best (${deflated.length}) < none (${stored.length})`)

	// deprecated per-call boolean still overrides the presentation setting
	const overridden = (await compressed.write({ outputType: 'nodebuffer', compression: false })) as Buffer
	assert.equal(overridden.length, stored.length)

	// invalid values are rejected by the setter, not silently mapped to DEFLATE
	const guarded = build()
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	;(guarded as any).compression = false
	assert.equal(guarded.compression, 'none')
})

test('#31: compression option is honored for explicit outputTypes', async () => {
	const pptx = new pptxgen()
	// enough repetitive content that DEFLATE must beat STORE
	const slide = pptx.addSlide()
	for (let i = 0; i < 20; i++) slide.addText('The quick brown fox jumps over the lazy dog. '.repeat(10), { x: 0.1, y: 0.1, w: 9, h: 5 })
	const stored = (await pptx.write({ outputType: 'nodebuffer', compression: false })) as Buffer
	const deflated = (await pptx.write({ outputType: 'nodebuffer', compression: true })) as Buffer
	assert.ok(deflated.length < stored.length, `expected deflated (${deflated.length}) < stored (${stored.length})`)
})
