/**
 * Minimal TTF / OTF / WOFF → EOT converter (vendored fonteditor-core graph).
 * WOFF callers must pass `options.inflate` (pako 3 bridge from gen-fonts).
 */

import woff2ttf from './ttf/woff2ttf.js'
import otf2ttfobject from './ttf/otf2ttfobject.js'
import TTFReader from './ttf/ttfreader.js'
import TTFWriter from './ttf/ttfwriter.js'
import ttf2eot from './ttf/ttf2eot.js'

/**
 * @param {'ttf' | 'otf' | 'woff'} type
 * @param {ArrayBuffer} fontBuffer
 * @param {{ hinting?: boolean, inflate?: (data: number[]) => number[] }} [options]
 * @returns {ArrayBuffer}
 */
export function convertToEot (type, fontBuffer, options = {}) {
	const opts = { hinting: true, ...options }

	let ttfObject
	if (type === 'ttf') {
		ttfObject = new TTFReader(opts).read(fontBuffer)
	} else if (type === 'otf') {
		ttfObject = otf2ttfobject(fontBuffer, opts)
	} else if (type === 'woff') {
		if (typeof opts.inflate !== 'function') {
			throw new Error('WOFF conversion requires options.inflate (pako)')
		}
		const ttfBuffer = woff2ttf(fontBuffer, opts)
		ttfObject = new TTFReader(opts).read(ttfBuffer)
	} else {
		throw new Error(`Unsupported font type for EOT conversion: ${String(type)}`)
	}

	const ttfBuffer = new TTFWriter(opts).write(ttfObject)
	return ttf2eot(ttfBuffer, opts)
}
