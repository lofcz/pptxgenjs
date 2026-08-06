import path from 'node:path'
import fs from 'node:fs'

const root = 'node_modules/fonteditor-core/src'
const entries = [
	'ttf/woff2ttf.js',
	'ttf/otf2ttfobject.js',
	'ttf/ttfreader.js',
	'ttf/ttf2eot.js',
	'ttf/ttfwriter.js',
]
const seen = new Set()
const queue = [...entries]
const external = new Set()

while (queue.length) {
	const rel = queue.pop()
	if (seen.has(rel)) continue
	seen.add(rel)
	const file = path.join(root, rel)
	if (!fs.existsSync(file)) {
		external.add(rel)
		continue
	}
	const src = fs.readFileSync(file, 'utf8')
	for (const m of src.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
		let next = path.posix.normalize(path.posix.join(path.posix.dirname(rel), m[1]))
		if (!next.endsWith('.js')) next += '.js'
		queue.push(next)
	}
	for (const m of src.matchAll(/from\s+['"](@?[^.'"][^'"]*)['"]/g)) {
		external.add(m[1])
	}
}

let bytes = 0
for (const f of seen) {
	try {
		bytes += fs.statSync(path.join(root, f)).size
	} catch {
		/* skip */
	}
}
console.log('files', seen.size)
console.log('kb', Math.round(bytes / 1024))
console.log('external', [...external])
fs.writeFileSync('scripts/fonteditor-deps.txt', [...seen].sort().join('\n'))
