/**
 * Keep `packages/pptxgenjs-jsx` on the same version as the root package.
 *
 * The workspace copy depends on `pptxgenjs-plus` via `file:../..` (Bun cannot
 * resolve `workspace:*` to the root package). npm cannot publish that, so
 * `--publish` rewrites the dependency to the shared version for the tarball.
 *
 *   bun scripts/sync-jsx-version.mjs            # match version, restore file: dep
 *   bun scripts/sync-jsx-version.mjs --publish  # match version, registry dep
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const WORKSPACE_DEP = 'file:../..'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rootPkgPath = join(root, 'package.json')
const jsxPkgPath = join(root, 'packages', 'pptxgenjs-jsx', 'package.json')

export function syncJsxPackage ({ publish = false } = {}) {
	const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'))
	const jsxPkg = JSON.parse(readFileSync(jsxPkgPath, 'utf8'))
	const version = rootPkg.version
	if (typeof version !== 'string' || !/^\d+\.\d+\.\d+/.test(version)) {
		throw new Error(`root package.json has no valid version: ${JSON.stringify(version)}`)
	}

	jsxPkg.version = version
	jsxPkg.dependencies = { ...jsxPkg.dependencies, 'pptxgenjs-plus': publish ? version : WORKSPACE_DEP }

	writeFileSync(jsxPkgPath, JSON.stringify(jsxPkg, null, '\t') + '\n')
	return { version, publish, dependency: jsxPkg.dependencies['pptxgenjs-plus'] }
}

const thisFile = fileURLToPath(import.meta.url)
const invoked = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === pathToFileURL(thisFile).href
if (invoked) {
	const publish = process.argv.includes('--publish')
	const { version, dependency } = syncJsxPackage({ publish })
	console.log(`pptxgenjs-plus-jsx@${version} → pptxgenjs-plus@${dependency}`)
}
