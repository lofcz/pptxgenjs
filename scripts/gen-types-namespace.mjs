/**
 * Appends a `PptxGenJS` namespace wrapper to the auto-generated type bundle
 * (`types/index.d.ts`) so consumers can use the historical `pptxgen.SomeType`
 * namespace style that the old hand-written declarations exposed.
 *
 * The bundled dts from Rslib only emits `export { PptxGenJS as default }` and
 * keeps every interface/enum/type as a module-local (non-exported) declaration.
 * This script scans the public source modules for the type surface and
 * re-exports each member from an `export as namespace` block.
 *
 * Runs as the final step of `npm run build` (after Rslib writes the bundle).
 */
import { existsSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const typesDir = join(root, 'types')
const bundlePath = join(typesDir, 'index.d.ts')

const DECL_RE = /^export (?:declare )?(?:interface|type|class|enum|const enum|function|const)\s+([A-Za-z0-9_]+)/
const PUBLIC_MODULES = ['src/core-interfaces.ts', 'src/core-enums.ts']

const names = new Set()
for (const file of PUBLIC_MODULES) {
	const src = readFileSync(join(root, file), 'utf8')
	for (const line of src.split('\n')) {
		const m = DECL_RE.exec(line.trim())
		if (m?.[1]) names.add(m[1])
	}
}
names.delete('PptxGenJS')

if (!existsSync(bundlePath)) {
	const generated = readdirSync(typesDir).filter(name => name.endsWith('.d.ts'))
	if (generated.length !== 1) {
		throw new Error(`expected types/index.d.ts, found: ${generated.join(', ') || '(none)'}`)
	}
	renameSync(join(typesDir, generated[0]), bundlePath)
}

const sorted = [...names].sort()
const namespaceBlock =
	'\n' +
	'export as namespace PptxGenJS\n\n' +
	'declare namespace PptxGenJS {\n' +
	sorted.map(n => `\texport { ${n} }`).join('\n') +
	'\n}\n'

let bundle = readFileSync(bundlePath, 'utf8')
bundle = bundle.replace(/\n?export as namespace PptxGenJS[\s\S]*$/, '')
const namedExports = '\n' + sorted.map(n => `export { ${n} }`).join('\n') + '\n'
writeFileSync(bundlePath, bundle.trimEnd() + '\n' + namedExports + namespaceBlock)
console.log(`types/index.d.ts: appended PptxGenJS namespace with ${sorted.length} members`)
