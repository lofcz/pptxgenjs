/**
 * Copy the TTF/OTF/WOFF→EOT dependency closure from fonteditor-core into src/vendor.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'node_modules/fonteditor-core/src')
const DEST = path.join(ROOT, 'src/vendor/fonteditor-core')
const DEPS = fs.readFileSync(path.join(ROOT, 'scripts/fonteditor-deps.txt'), 'utf8')
	.split(/\r?\n/)
	.map(s => s.trim())
	.filter(Boolean)

fs.rmSync(DEST, { recursive: true, force: true })
fs.mkdirSync(DEST, { recursive: true })

for (const rel of DEPS) {
	const from = path.join(SRC, rel)
	const to = path.join(DEST, rel)
	fs.mkdirSync(path.dirname(to), { recursive: true })
	fs.copyFileSync(from, to)
}

fs.copyFileSync(
	path.join(ROOT, 'node_modules/fonteditor-core/LICENSE'),
	path.join(DEST, 'LICENSE'),
)

const version = JSON.parse(
	fs.readFileSync(path.join(ROOT, 'node_modules/fonteditor-core/package.json'), 'utf8'),
).version

fs.writeFileSync(
	path.join(DEST, 'README.md'),
	[
		'# Vendored fonteditor-core (subset)',
		'',
		'MIT — Copyright (c) 2014 ecomfe / kekee000 (https://github.com/kekee000/fonteditor-core)',
		'',
		'Only the TTF / OTF / WOFF → EOT conversion graph is vendored (no SVG / WOFF2 / xmldom).',
		'WOFF inflate is supplied by the host via pako 3.',
		'',
		`Source version: fonteditor-core@${version}`,
		'',
	].join('\n'),
)

fs.writeFileSync(
	path.join(DEST, 'convert-to-eot.js'),
	`/**
 * Minimal TTF / OTF / WOFF → EOT converter (vendored fonteditor-core graph).
 * WOFF callers must pass \`options.inflate\` (pako 3 bridge from gen-fonts).
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
		throw new Error(\`Unsupported font type for EOT conversion: \${String(type)}\`)
	}

	const ttfBuffer = new TTFWriter(opts).write(ttfObject)
	return ttf2eot(ttfBuffer, opts)
}
`,
)

console.log(`vendored ${DEPS.length} files → ${path.relative(ROOT, DEST)}`)
