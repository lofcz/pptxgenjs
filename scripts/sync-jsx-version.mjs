/**
 * Keep workspace packages on the same version as the root package.
 *
 * JSX depends on `pptxgenjs-plus` via `file:../..` (Bun cannot resolve
 * `workspace:*` to the root). Std peers the same package and uses `file:../..`
 * only as a devDependency. npm cannot publish `file:` deps, so `--publish`
 * rewrites them to the shared version for the tarball.
 *
 *   bun scripts/sync-jsx-version.mjs            # match versions, restore file: deps
 *   bun scripts/sync-jsx-version.mjs --publish  # match versions, registry deps
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const WORKSPACE_DEP = 'file:../..'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rootPkgPath = join(root, 'package.json')
const jsxPkgPath = join(root, 'packages', 'pptxgenjs-jsx', 'package.json')
const stdPkgPath = join(root, 'packages', 'pptxgenjs-std', 'package.json')

function readJson (path) {
	return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson (path, value) {
	writeFileSync(path, JSON.stringify(value, null, '\t') + '\n')
}

function rootVersion () {
	const version = readJson(rootPkgPath).version
	if (typeof version !== 'string' || !/^\d+\.\d+\.\d+/.test(version)) {
		throw new Error(`root package.json has no valid version: ${JSON.stringify(version)}`)
	}
	return version
}

export function syncJsxPackage ({ publish = false } = {}) {
	return syncWorkspacePackages({ publish }).jsx
}

export function syncWorkspacePackages ({ publish = false } = {}) {
	const version = rootVersion()
	const coreDep = publish ? version : WORKSPACE_DEP

	const jsxPkg = readJson(jsxPkgPath)
	jsxPkg.version = version
	jsxPkg.dependencies = { ...jsxPkg.dependencies, 'pptxgenjs-plus': coreDep }
	writeJson(jsxPkgPath, jsxPkg)

	const stdPkg = readJson(stdPkgPath)
	stdPkg.version = version
	stdPkg.peerDependencies = { ...stdPkg.peerDependencies, 'pptxgenjs-plus': version }
	stdPkg.devDependencies = { ...stdPkg.devDependencies, 'pptxgenjs-plus': coreDep }
	writeJson(stdPkgPath, stdPkg)

	return {
		version,
		publish,
		jsx: { version, dependency: jsxPkg.dependencies['pptxgenjs-plus'] },
		std: { version, peer: stdPkg.peerDependencies['pptxgenjs-plus'], dependency: stdPkg.devDependencies['pptxgenjs-plus'] },
	}
}

const thisFile = fileURLToPath(import.meta.url)
const invoked = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === pathToFileURL(thisFile).href
if (invoked) {
	const publish = process.argv.includes('--publish')
	const { version, jsx, std } = syncWorkspacePackages({ publish })
	console.log(`pptxgenjs-plus-jsx@${version} → pptxgenjs-plus@${jsx.dependency}`)
	console.log(`pptxgenjs-plus-std@${version} peer pptxgenjs-plus@${std.peer} (dev ${std.dependency})`)
}
