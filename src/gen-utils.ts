/**
 * PptxGenJS: Utility Methods
 */

import { EMU, REGEX_HEX_COLOR, DEF_FONT_COLOR, DEF_TEXT_GLOW, ONEPT, SchemeColor, SCHEME_COLORS } from './core-enums'
import { PresLayout, TextGlowProps, PresSlide, SlideLayout, ShapeFillProps, Color, ShapeLineProps, Coord, ShadowProps } from './core-interfaces'

/** debug namespace, used for both the log prefix and the `NODE_DEBUG` section name */
const DEBUG_NS = 'pptxgenjs'

/**
 * Whether verbose diagnostics are enabled
 * - set `PPTXGENJS_DEBUG=1`, or include `pptxgenjs` in Node's `NODE_DEBUG`
 * @returns {boolean} debug enabled
 */
export function isDebugEnabled (): boolean {
	if (typeof process === 'undefined' || !process.env) return false
	return Boolean(process.env.PPTXGENJS_DEBUG) || (process.env.NODE_DEBUG ?? '').split(/[\s,]+/).includes(DEBUG_NS)
}

/**
 * Log a diagnostic message (no-op unless debug is enabled)
 * @param {unknown[]} args - console.debug arguments
 */
export function debugLog (...args: unknown[]): void {
	if (isDebugEnabled()) console.debug(`[${DEBUG_NS}]`, ...args)
}

/** friendly `dataLabelPosition` names mapped to their OOXML `c:dLblPos` codes (the codes stay accepted too) */
const DATA_LABEL_POS_CODES: Record<string, string> = {
	bottom: 'b',
	center: 'ctr',
	left: 'l',
	right: 'r',
	top: 't',
	insideEnd: 'inEnd',
	insideBase: 'inBase',
	outsideEnd: 'outEnd',
	bestFit: 'bestFit',
}

/**
 * Resolve a `dataLabelPosition` to the OOXML code valid for this chart type
 * - a value the chart type does not accept makes PowerPoint declare the file corrupt, so it is dropped
 * @param {string} position - user value: a friendly name (`'outsideEnd'`) or an OOXML code (`'outEnd'`)
 * @param {string} chartType - chart type being rendered, or undefined for a multi-type chart (translate only)
 * @param {string} barGrouping - bar grouping (stacked bars accept fewer positions than clustered)
 * @returns {string | undefined} OOXML code, or undefined when not valid for this chart type
 */
export function resolveDataLabelPosition (position: string, chartType?: string, barGrouping?: string): string | undefined {
	const code = DATA_LABEL_POS_CODES[position] ?? position

	// a multi-type chart has no single type to validate against - each sub-chart validates its own options
	if (!chartType) return code
	// REFERENCE: https://docs.microsoft.com/en-us/openspecs/office_standards/ms-oi29500/e2b1697c-7adc-463d-9081-3daef72f656f
	let valid: string[]
	switch (chartType) {
		case 'pie':
			valid = ['bestFit', 'ctr', 'inEnd', 'outEnd']
			break
		case 'bubble':
		case 'bubble3D':
		case 'line':
		case 'scatter':
			valid = ['b', 'ctr', 'l', 'r', 't']
			break
		case 'bar':
			// stacked bars have no "outside end" to sit against
			valid = (barGrouping ?? '').includes('tacked') ? ['ctr', 'inBase', 'inEnd'] : ['ctr', 'inBase', 'inEnd', 'outEnd']
			break
		default:
			// area, bar3D, doughnut, radar: PowerPoint takes no `c:dLblPos` at all
			valid = []
	}

	if (!valid.includes(code)) {
		console.warn(
			`[pptxgenjs] dataLabelPosition '${position}' is not valid for a '${chartType}' chart - ignoring it (valid: ${valid.length > 0 ? valid.join(', ') : 'none'})`
		)
		return undefined
	}

	return code
}

/**
 * Translates any type of `x`/`y`/`w`/`h` prop to EMU
 * - guaranteed to return a result regardless of undefined, null, etc. (0)
 * - {number} - 12800 (EMU)
 * - {number} - 0.5 (inches)
 * - {string} - "75%"
 * @param {number|string} size - numeric ("5.5") or percentage ("90%")
 * @param {'X' | 'Y'} xyDir - direction
 * @param {PresLayout} layout - presentation layout
 * @returns {number} calculated size
 */
export function getSmartParseNumber (size: Coord | undefined, xyDir: 'X' | 'Y', layout: PresLayout): number {
	// FIRST: Convert string numeric value if reqd
	if (typeof size === 'string' && !isNaN(Number(size))) size = Number(size)

	// CASE 1: Number in inches
	// Assume any number less than 100 is inches
	if (typeof size === 'number' && size < 100) return inch2Emu(size)

	// CASE 2: Number is already converted to something other than inches
	// Assume any number greater than 100 sure isnt inches! Just return it (assume value is EMU already).
	if (typeof size === 'number' && size >= 100) return size

	// CASE 3: Percentage (ex: '50%')
	if (typeof size === 'string' && size.includes('%')) {
		if (xyDir && xyDir === 'X') return Math.round((parseFloat(size) / 100) * layout.width)
		if (xyDir && xyDir === 'Y') return Math.round((parseFloat(size) / 100) * layout.height)

		// Default: Assume width (x/cx)
		return Math.round((parseFloat(size) / 100) * layout.width)
	}

	// LAST: Default value
	return 0
}

/**
 * Basic UUID Generator Adapted
 * @link https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript#answer-2117523
 * @param {string} uuidFormat - UUID format
 * @returns {string} UUID
 */
export function getUuid (uuidFormat: string): string {
	return uuidFormat.replace(/[xy]/g, function (c) {
		// Web Crypto API - a global in browsers and in Node >=20 (this package's engines floor).
		// Mask the low nibble (0-15) - an unbiased reduction (no modulo) for a hex digit.
		const r = globalThis.crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

/** deprecation keys already warned about - each fires once per process */
const _warnedDeprecations = new Set<string>()

/**
 * Warn about a deprecated option/usage - once per key, so migration guidance appears without flooding the console
 * @param {string} key - unique key for this deprecation
 * @param {string} message - migration guidance
 */
export function warnDeprecatedOnce (key: string, message: string): void {
	if (_warnedDeprecations.has(key)) return
	_warnedDeprecations.add(key)
	console.warn(`[pptxgenjs] DEPRECATED: ${message}`)
}

/**
 * Replace special XML characters with HTML-encoded strings
 * @param {string} xml - XML string to encode
 * @returns {string} escaped XML
 */
export function encodeXmlEntities (xml: string | undefined): string {
	// NOTE: Dont use short-circuit eval here as value c/b "0" (zero) etc.!
	if (typeof xml === 'undefined' || xml == null) return ''
	return xml.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

/**
 * Convert inches into EMU
 * @param {number|string} inches - as string or number
 * @returns {number} EMU value
 */
export function inch2Emu (inches: number | string): number {
	// NOTE: Provide Caller Safety: Numbers may get conv<->conv during flight, so be kind and do some simple checks to ensure inches were passed
	// Any value over 100 damn sure isnt inches, so lets assume its in EMU already, therefore, just return the same value
	if (typeof inches === 'number' && inches > 100) return inches
	if (typeof inches === 'string') inches = Number(inches.replace(/in*/gi, ''))
	return Math.round(EMU * inches)
}

/**
 * Convert `pt` into points (using `ONEPT`)
 * @param {number|string} pt
 * @returns {number} value in points (`ONEPT`)
 */
export function valToPts (pt: number | string | undefined): number {
	const points = Number(pt) || 0
	return isNaN(points) ? 0 : Math.round(points * ONEPT)
}

/**
 * Convert degrees (0..360) to PowerPoint `rot` value
 * @param {number} d degrees
 * @returns {number} calculated `rot` value
 */
export function convertRotationDegrees (d: number | undefined): number {
	d = d || 0
	return Math.round((d > 360 ? d - 360 : d) * 60000)
}

/**
 * Converts component value to hex value
 * @param {number} c - component color
 * @returns {string} hex string
 */
export function componentToHex (c: number): string {
	const hex = c.toString(16)
	return hex.length === 1 ? '0' + hex : hex
}

/**
 * Converts RGB colors from css selectors to Hex for Presentation colors
 * @param {number} r - red value
 * @param {number} g - green value
 * @param {number} b - blue value
 * @returns {string} XML string
 */
export function rgbToHex (r: number, g: number, b: number): string {
	return (componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase()
}

/**  TODO: FUTURE: TODO-4.0:
 * @date 2022-04-10
 * @tldr this s/b a private method with all current calls switched to `genXmlColorSelection()`
 * @desc lots of code calls this method
 * @example [gen-charts.tx] `strXml += '<a:solidFill>' + createColorElement(seriesColor, `<a:alpha val="${Math.round(opts.chartColorsOpacity * 1000)}"/>`) + '</a:solidFill>'`
 * Thi sis wrong. We s/b calling `genXmlColorSelection()` instead as it returns `<a:solidfill>BLAH</a:solidFill>`!!
 */
/**
 * Create either a `a:schemeClr` - (scheme color) or `a:srgbClr` (hexa representation).
 * @param {string|SCHEME_COLORS} colorStr - hexa representation (eg. "FFFF00") or a scheme color constant (eg. pptx.SchemeColor.ACCENT1)
 * @param {string} innerElements - additional elements that adjust the color and are enclosed by the color element
 * @returns {string} XML string
 */
export function createColorElement (colorStr: string | SCHEME_COLORS | undefined, innerElements?: string): string {
	let colorVal = (colorStr || '').replace('#', '')

	if (
		!REGEX_HEX_COLOR.test(colorVal) &&
		colorVal !== SchemeColor.background1 &&
		colorVal !== SchemeColor.background2 &&
		colorVal !== SchemeColor.text1 &&
		colorVal !== SchemeColor.text2 &&
		colorVal !== SchemeColor.accent1 &&
		colorVal !== SchemeColor.accent2 &&
		colorVal !== SchemeColor.accent3 &&
		colorVal !== SchemeColor.accent4 &&
		colorVal !== SchemeColor.accent5 &&
		colorVal !== SchemeColor.accent6
	) {
		console.warn(`"${colorVal}" is not a valid scheme color or hex RGB! "${DEF_FONT_COLOR}" used instead. Only provide 6-digit RGB or 'pptx.SchemeColor' values!`)
		colorVal = DEF_FONT_COLOR
	}

	const tagName = REGEX_HEX_COLOR.test(colorVal) ? 'srgbClr' : 'schemeClr'
	const colorAttr = 'val="' + (REGEX_HEX_COLOR.test(colorVal) ? colorVal.toUpperCase() : colorVal) + '"'

	return innerElements ? `<a:${tagName} ${colorAttr}>${innerElements}</a:${tagName}>` : `<a:${tagName} ${colorAttr}/>`
}

/**
 * Creates `a:glow` element
 * @param {TextGlowProps} options glow properties
 * @param {TextGlowProps} defaults defaults for unspecified properties in `opts`
 * @see http://officeopenxml.com/drwSp-effects.php
 * { size: 8, color: 'FFFFFF', opacity: 0.75 };
 */
/**
 * Nominal ("coloured") brand for resolved glow options. The symbol is module-private and unexported,
 * so `ResolvedGlowProps` values can ONLY be produced by `resolveGlowOptions` below - a hand-built
 * object (even a full `Required<TextGlowProps>`) is not assignable. This statically guarantees that
 * anything reaching `createGlowElement` has passed through the defaults-merge boundary.
 */
const glowBrand: unique symbol = Symbol('resolvedGlow')
export type ResolvedGlowProps = Required<TextGlowProps> & { readonly [glowBrand]: boolean }

/**
 * Resolve boundary: merge user glow options over the documented defaults and brand the result. The
 * only constructor of `ResolvedGlowProps` (no cast - the brand is added by this factory).
 */
export function resolveGlowOptions (options: TextGlowProps | undefined): ResolvedGlowProps | undefined {
	if (!options) return undefined
	return { ...DEF_TEXT_GLOW, ...options, [glowBrand]: true }
}

export function createGlowElement (glow: ResolvedGlowProps): string {
	let strXml = ''
	const size = Math.round(glow.size * ONEPT)
	const color = glow.color
	const opacity = Math.round(glow.opacity * 100000)

	strXml += `<a:glow rad="${size}">`
	strXml += createColorElement(color, `<a:alpha val="${opacity}"/>`)
	strXml += '</a:glow>'

	return strXml
}

/**
 * Create color selection
 * @param {Color | ShapeFillProps | ShapeLineProps} props fill props
 * @returns XML string
 */
export function genXmlColorSelection (props: Color | ShapeFillProps | ShapeLineProps | undefined): string {
	let fillType = 'solid'
	let colorVal = ''
	let internalElements = ''
	let outText = ''

	if (props) {
		if (typeof props === 'string') colorVal = props
		else {
			if (props.type) fillType = props.type
			if (props.color) colorVal = props.color
			if (props.alpha) internalElements += `<a:alpha val="${Math.round((100 - props.alpha) * 1000)}"/>` // DEPRECATED: @deprecated v3.3.0
			if (props.transparency) internalElements += `<a:alpha val="${Math.round((100 - props.transparency) * 1000)}"/>`
		}

		switch (fillType) {
			case 'solid':
				outText += `<a:solidFill>${createColorElement(colorVal, internalElements)}</a:solidFill>`
				break
			default: // @note need a statement as having only "break" is removed by rollup, then tiggers "no-default" js-linter
				outText += ''
				break
		}
	}

	return outText
}

/**
 * Get a new rel ID (rId) for charts, media, etc.
 * @param {PresSlide} target - the slide to use
 * @returns {number} count of all current rels plus 1 for the caller to use as its "rId"
 */
export function getNewRelId (target: PresSlide | SlideLayout): number {
	return target._rels.length + target._relsChart.length + target._relsMedia.length + 1
}

/**
 * Checks shadow options passed by user and performs corrections if needed.
 * @param {ShadowProps} ShadowProps - shadow options
 */
export function correctShadowOptions (ShadowProps: ShadowProps): ShadowProps | undefined {
	if (!ShadowProps || typeof ShadowProps !== 'object') {
		if (ShadowProps) console.warn('[pptxgenjs] `shadow` must be an object (ex: `{shadow: {type:\'outer\'}}`) - value ignored')
		return
	}

	// Work on a copy - never mutate the caller's options object
	ShadowProps = { ...ShadowProps }

	// OPT: `type`
	if (ShadowProps.type !== 'outer' && ShadowProps.type !== 'inner' && ShadowProps.type !== 'none') {
		console.warn('Warning: shadow.type options are `outer`, `inner` or `none`.')
		ShadowProps.type = 'outer'
	}

	// OPT: `angle`
	if (ShadowProps.angle) {
		// A: REALITY-CHECK
		if (isNaN(Number(ShadowProps.angle)) || ShadowProps.angle < 0 || ShadowProps.angle > 359) {
			console.warn('Warning: shadow.angle can only be 0-359')
			ShadowProps.angle = 270
		}

		// B: ROBUST: Cast any type of valid arg to int: '12', 12.3, etc. -> 12
		ShadowProps.angle = Math.round(Number(ShadowProps.angle))
	}

	// OPT: `opacity`
	if (ShadowProps.opacity) {
		// A: REALITY-CHECK
		if (isNaN(Number(ShadowProps.opacity)) || ShadowProps.opacity < 0 || ShadowProps.opacity > 1) {
			console.warn('Warning: shadow.opacity can only be 0-1')
			ShadowProps.opacity = 0.75
		}

		// B: ROBUST: Cast any type of valid arg to int: '12', 12.3, etc. -> 12
		ShadowProps.opacity = Number(ShadowProps.opacity)
	}

	// OPT: `color`
	if (ShadowProps.color) {
		// INCORRECT FORMAT
		if (ShadowProps.color.startsWith('#')) {
			console.warn('Warning: shadow.color should not include hash (#) character, , e.g. "FF0000"')
			ShadowProps.color = ShadowProps.color.replace('#', '')
		}
	}

	return ShadowProps
}
