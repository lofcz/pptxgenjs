/**
 * Rebuild libs/jszip.min.js from @node-projects/jszip (+ pako 3) as a browser IIFE.
 */
import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const entry = path.join(root, 'scripts/jszip-browser-entry.mjs')
const outfile = path.join(root, 'libs/jszip.min.js')

fs.writeFileSync(
	entry,
	`import { JSZip } from '@node-projects/jszip'\nexport default JSZip\n`,
)

const STUBS = {
	'readable-stream': 'export const Readable = class {}; export default { Readable };',
	stream: 'export class Stream {}; export default { Stream };',
	events: 'export class EventEmitter {}; export default { EventEmitter };',
}

const stubPlugin = {
	name: 'stub-node-stream',
	setup (build) {
		build.onResolve({ filter: /^(readable-stream|stream|events)$/ }, args => ({
			path: args.path,
			namespace: 'node-stub',
		}))
		build.onLoad({ filter: /.*/, namespace: 'node-stub' }, args => ({
			contents: STUBS[args.path] ?? 'export default {};',
			loader: 'js',
		}))
	},
}

await esbuild.build({
	entryPoints: [entry],
	bundle: true,
	minify: true,
	format: 'iife',
	globalName: 'JSZip',
	platform: 'browser',
	target: ['es2018'],
	outfile,
	logLevel: 'info',
	plugins: [stubPlugin],
	// esbuild wraps default export as `{ default: Class }` under globalName
	footer: { js: 'JSZip = JSZip.default || JSZip;' },
})

fs.unlinkSync(entry)
console.log('wrote', path.relative(root, outfile))
