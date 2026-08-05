/**
 * PptxGenJS: Unit tests for utility methods
 * Run with: `npm test` (node built-in test runner + tsx)
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
	debugLog,
	isDebugEnabled,
	getSmartParseNumber,
	getUuid,
	encodeXmlEntities,
	inch2Emu,
	valToPts,
	convertRotationDegrees,
	componentToHex,
	rgbToHex,
	createColorElement,
	createGlowElement,
	genXmlColorSelection,
	getNewRelId,
	correctShadowOptions,
} from '../src/gen-utils'
import { PresLayout, PresSlide, ShadowProps } from '../src/core-interfaces'

// 10in x 7.5in layout expressed in EMU
const LAYOUT = { name: 'TEST', width: 9144000, height: 6858000 } as PresLayout

test('inch2Emu', () => {
	assert.equal(inch2Emu(1), 914400)
	assert.equal(inch2Emu(0.5), 457200)
	assert.equal(inch2Emu('2'), 1828800)
	assert.equal(inch2Emu('1in'), 914400)
	assert.equal(inch2Emu(200), 200, 'values > 100 are assumed to be EMU already')
})

test('valToPts', () => {
	assert.equal(valToPts(1), 12700)
	assert.equal(valToPts('2'), 25400)
	assert.equal(valToPts('not-a-number'), 0)
	assert.equal(valToPts(undefined as unknown as number), 0)
})

test('convertRotationDegrees', () => {
	assert.equal(convertRotationDegrees(0), 0)
	assert.equal(convertRotationDegrees(90), 5400000)
	assert.equal(convertRotationDegrees(360), 21600000)
	assert.equal(convertRotationDegrees(361), 60000, 'wraps values over 360')
	assert.equal(convertRotationDegrees(undefined as unknown as number), 0)
})

test('componentToHex', () => {
	assert.equal(componentToHex(0), '00')
	assert.equal(componentToHex(15), '0f')
	assert.equal(componentToHex(255), 'ff')
})

test('rgbToHex', () => {
	assert.equal(rgbToHex(255, 0, 0), 'FF0000')
	assert.equal(rgbToHex(0, 255, 0), '00FF00')
	assert.equal(rgbToHex(0, 0, 0), '000000')
})

test('encodeXmlEntities', () => {
	assert.equal(encodeXmlEntities('a & b < c > d "e" \'f\''), 'a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;')
	assert.equal(encodeXmlEntities(null as unknown as string), '')
	assert.equal(encodeXmlEntities(undefined as unknown as string), '')
})

test('getSmartParseNumber', () => {
	assert.equal(getSmartParseNumber(1, 'X', LAYOUT), 914400, 'small numbers are inches')
	assert.equal(getSmartParseNumber(914400, 'X', LAYOUT), 914400, 'large numbers are already EMU')
	assert.equal(getSmartParseNumber('50%', 'X', LAYOUT), 4572000, 'percent of width')
	assert.equal(getSmartParseNumber('50%', 'Y', LAYOUT), 3429000, 'percent of height')
	assert.equal(getSmartParseNumber('garbage', 'X', LAYOUT), 0)
})

test('getUuid', () => {
	assert.match(getUuid('xxxxxxxx'), /^[0-9a-f]{8}$/)
	assert.match(getUuid('y'), /^[89ab]$/, 'the "y" nibble is constrained per RFC4122')
	assert.notEqual(getUuid('xxxxxxxx-xxxx'), getUuid('xxxxxxxx-xxxx'), 'values are random')
})

test('createColorElement: hex', () => {
	assert.equal(createColorElement('FF0000'), '<a:srgbClr val="FF0000"/>')
	assert.equal(createColorElement('#ff0000'), '<a:srgbClr val="FF0000"/>', 'strips # and uppercases')
	assert.equal(createColorElement('FF0000', '<a:alpha val="50000"/>'), '<a:srgbClr val="FF0000"><a:alpha val="50000"/></a:srgbClr>')
})

test('createColorElement: scheme color', () => {
	assert.equal(createColorElement('accent1'), '<a:schemeClr val="accent1"/>')
})

test('createColorElement: invalid falls back to default font color', () => {
	const orig = console.warn
	console.warn = () => {} // silence the expected warning
	try {
		assert.equal(createColorElement('NOPE'), '<a:srgbClr val="000000"/>')
	} finally {
		console.warn = orig
	}
})

test('createGlowElement', () => {
	assert.equal(
		createGlowElement({ size: 8, color: 'FFFFFF', opacity: 0.75 }, { size: 8, color: 'FFFFFF', opacity: 0.75 }),
		'<a:glow rad="101600"><a:srgbClr val="FFFFFF"><a:alpha val="75000"/></a:srgbClr></a:glow>'
	)
})

test('genXmlColorSelection', () => {
	assert.equal(genXmlColorSelection('FF0000'), '<a:solidFill><a:srgbClr val="FF0000"/></a:solidFill>')
	assert.equal(
		genXmlColorSelection({ type: 'solid', color: 'FF0000', transparency: 50 }),
		'<a:solidFill><a:srgbClr val="FF0000"><a:alpha val="50000"/></a:srgbClr></a:solidFill>'
	)
	assert.equal(genXmlColorSelection({ type: 'gradient' as 'solid', color: 'FF0000' }), '', 'non-solid fills are not emitted')
})

test('getNewRelId', () => {
	const slide = { _rels: [1, 2], _relsChart: [1], _relsMedia: [] } as unknown as PresSlide
	assert.equal(getNewRelId(slide), 4, 'sum of all rel arrays + 1')
})

test('correctShadowOptions', () => {
	assert.equal(correctShadowOptions(undefined as unknown as ShadowProps), undefined)
	assert.equal(correctShadowOptions('nope' as unknown as ShadowProps), undefined)
	assert.equal(correctShadowOptions({ type: 'bogus' } as unknown as ShadowProps)?.type, 'outer', 'invalid type corrected')
	assert.equal(correctShadowOptions({ type: 'outer', angle: 400 } as ShadowProps)?.angle, 270, 'out-of-range angle corrected')
	assert.equal(correctShadowOptions({ type: 'outer', opacity: 2 } as ShadowProps)?.opacity, 0.75, 'out-of-range opacity corrected')
	assert.equal(correctShadowOptions({ type: 'outer', color: '#FF0000' } as ShadowProps)?.color, 'FF0000', 'strips leading #')
})

test('debugLog: silent unless PPTXGENJS_DEBUG or NODE_DEBUG is set', () => {
	const { PPTXGENJS_DEBUG, NODE_DEBUG } = process.env
	const calls: unknown[][] = []
	const orig = console.debug
	console.debug = (...args: unknown[]) => calls.push(args)
	try {
		delete process.env.PPTXGENJS_DEBUG
		delete process.env.NODE_DEBUG
		assert.equal(isDebugEnabled(), false)
		debugLog('quiet')
		assert.equal(calls.length, 0)

		process.env.NODE_DEBUG = 'http,pptxgenjs'
		assert.equal(isDebugEnabled(), true)
		debugLog('loud')
		assert.deepEqual(calls, [['[pptxgenjs]', 'loud']])

		process.env.NODE_DEBUG = 'http'
		assert.equal(isDebugEnabled(), false, 'NODE_DEBUG matched on a partial section name')

		process.env.PPTXGENJS_DEBUG = '1'
		assert.equal(isDebugEnabled(), true)
	} finally {
		console.debug = orig
		if (PPTXGENJS_DEBUG === undefined) delete process.env.PPTXGENJS_DEBUG; else process.env.PPTXGENJS_DEBUG = PPTXGENJS_DEBUG
		if (NODE_DEBUG === undefined) delete process.env.NODE_DEBUG; else process.env.NODE_DEBUG = NODE_DEBUG
	}
})
