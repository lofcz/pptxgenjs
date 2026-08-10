/**
 * Appends a `PptxGenJS` namespace wrapper to the auto-generated type bundle
 * (`types/index.d.ts`) so consumers can use the historical `pptxgen.SomeType`
 * namespace style that the old hand-written declarations exposed.
 *
 * The bundle produced by rollup-plugin-dts only emits `export { PptxGenJS as
 * default }` and keeps every interface/enum/type as a module-local (non-exported)
 * declaration. This script scans the emitted `out/defs` files for the public
 * type surface and re-exports each member from an `export as namespace` block —
 * restoring parity with the legacy `.d.ts` without hand-maintaining it.
 *
 * Runs as the final step of `npm run build` (after rollup writes the bundle).
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const defsDir = join(root, 'out', 'defs')
const bundlePath = join(root, 'types', 'index.d.ts')

// Matches top-level exported declarations in the emitted per-module .d.ts files.
const DECL_RE = /^export declare (?:interface|type|class|enum|const enum|function|const)\s+([A-Za-z0-9_]+)|^export (?:interface|type|enum)\s+([A-Za-z0-9_]+)/

// Modules whose members form the public API surface (mirrors what the legacy
// hand-written types/index.d.ts re-exported under the PptxGenJS namespace).
const PUBLIC_MODULES = ['core-interfaces.d.ts', 'core-enums.d.ts']

const names = new Set()
for (const file of PUBLIC_MODULES) {
	const src = readFileSync(join(defsDir, file), 'utf8')
	for (const line of src.split('\n')) {
		const m = DECL_RE.exec(line.trim())
		const name = m?.[1] ?? m?.[2]
		if (name) names.add(name)
	}
}

// The default-exported class is also a namespace member (constructor type).
names.delete('PptxGenJS')

const sorted = [...names].sort()
const namespaceBlock =
	'\n' +
	'export as namespace PptxGenJS\n\n' +
	'declare namespace PptxGenJS {\n' +
	sorted.map(n => `\texport { ${n} }`).join('\n') +
	'\n}\n'

let bundle = readFileSync(bundlePath, 'utf8')

// Re-emit each public name as a module-level export so the namespace re-export
// resolves, then expose them under the namespace. Idempotent: strip any prior
// generated block first.
bundle = bundle.replace(/\n?export as namespace PptxGenJS[\s\S]*$/, '')

const namedExports =
	'\n' + sorted.map(n => `export { ${n} }`).join('\n') + '\n'

writeFileSync(bundlePath, bundle.trimEnd() + '\n' + namedExports + namespaceBlock)
console.log(`types/index.d.ts: appended PptxGenJS namespace with ${sorted.length} members`)
