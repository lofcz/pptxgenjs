/**
 * Generate `src/version.generated.ts` from package.json.
 *
 * The library version is not hand-maintained. The Rsbuild plugin rewrites the
 * generated module before the compiler starts so tsc, bun tests, and the
 * bundle all read the same value.
 *
 *   import { pluginPackageVersion, writePackageVersion } from './package-version.mjs'
 *   bun scripts/package-version.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const PLUGIN_NAME = 'plugin-package-version'
const GENERATED_REL = 'src/version.generated.ts'
const SEMVER_RE = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/

export function defaultGeneratedPath (root) {
	return join(root, GENERATED_REL)
}

export function renderVersionModule (version) {
	if (typeof version !== 'string' || !SEMVER_RE.test(version)) {
		throw new Error(`${PLUGIN_NAME}: package.json "version" is not a semver string: ${JSON.stringify(version)}`)
	}
	return (
		'/** @generated from package.json by plugin-package-version. Do not edit. */\n' +
		`export const VERSION = ${JSON.stringify(version)} as const\n`
	)
}

export function readPackageVersion (root) {
	const pkgPath = join(root, 'package.json')
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
	if (typeof pkg.version !== 'string' || !SEMVER_RE.test(pkg.version)) {
		throw new Error(`${PLUGIN_NAME}: ${pkgPath} has no valid "version"`)
	}
	return pkg.version
}

export function writePackageVersion ({ root, dest } = {}) {
	const resolvedRoot = resolve(root ?? join(dirname(fileURLToPath(import.meta.url)), '..'))
	const version = readPackageVersion(resolvedRoot)
	const outFile = resolve(dest ?? defaultGeneratedPath(resolvedRoot))
	const source = renderVersionModule(version)
	mkdirSync(dirname(outFile), { recursive: true })
	let previous = null
	try {
		previous = readFileSync(outFile, 'utf8')
	} catch (err) {
		if (err.code !== 'ENOENT') throw err
	}
	if (previous !== source) writeFileSync(outFile, source)
	return { version, dest: outFile, written: previous !== source }
}

/** Rsbuild plugin — writes the generated version module before the compiler starts. */
export function pluginPackageVersion (options = {}) {
	const root = resolve(options.root ?? join(dirname(fileURLToPath(import.meta.url)), '..'))
	const dest = resolve(options.dest ?? defaultGeneratedPath(root))

	return {
		name: PLUGIN_NAME,
		setup (api) {
			const write = () => {
				const { version, written } = writePackageVersion({ root, dest })
				api.logger.info(`${PLUGIN_NAME}: ${written ? 'wrote' : 'unchanged'} ${dest} (${version})`)
			}
			api.onBeforeCreateCompiler(write)
		},
	}
}

export default pluginPackageVersion

const thisFile = fileURLToPath(import.meta.url)
const invoked = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === pathToFileURL(thisFile).href
if (invoked) {
	const { dest, version, written } = writePackageVersion()
	console.log(`${written ? 'wrote' : 'unchanged'} ${dest} (${version})`)
}
