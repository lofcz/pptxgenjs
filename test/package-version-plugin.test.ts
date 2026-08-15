import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import pptxgen from '../src/pptxgen'
import {
	pluginPackageVersion,
	readPackageVersion,
	renderVersionModule,
	writePackageVersion,
} from '../scripts/package-version.mjs'

const require = createRequire(import.meta.url)
const pkg = require('../package.json') as { version: string }

test('plugin: renderVersionModule emits a generated const from package.json', () => {
	assert.equal(
		renderVersionModule('4.1.17'),
		'/** @generated from package.json by plugin-package-version. Do not edit. */\n' +
			'export const VERSION = "4.1.17" as const\n'
	)
	assert.throws(() => renderVersionModule('not-a-version'), /semver/)
})

test('plugin: writePackageVersion reads package.json and skips unchanged writes', () => {
	const root = mkdtempSync(join(tmpdir(), 'pptxgen-version-'))
	writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'tmp', version: '9.8.7' }))
	const dest = join(root, 'src', 'version.generated.ts')
	const first = writePackageVersion({ root, dest })
	assert.equal(first.version, '9.8.7')
	assert.equal(first.written, true)
	assert.equal(readFileSync(dest, 'utf8'), renderVersionModule('9.8.7'))
	const second = writePackageVersion({ root, dest })
	assert.equal(second.written, false)
})

test('plugin: Rsbuild setup writes the generated module before compile', () => {
	const root = mkdtempSync(join(tmpdir(), 'pptxgen-version-plugin-'))
	mkdirSync(join(root, 'src'), { recursive: true })
	writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'tmp', version: '1.2.3-beta.1' }))
	const dest = join(root, 'src', 'version.generated.ts')
	const plugin = pluginPackageVersion({ root, dest })
	assert.equal(plugin.name, 'plugin-package-version')
	const notes: string[] = []
	plugin.setup({
		logger: {
			info (message: string) {
				notes.push(message)
			},
		},
		onBeforeCreateCompiler (fn: () => void) {
			fn()
		},
	})
	assert.equal(readPackageVersion(root), '1.2.3-beta.1')
	assert.equal(readFileSync(dest, 'utf8'), renderVersionModule('1.2.3-beta.1'))
	assert.match(notes[0] ?? '', /1\.2\.3-beta\.1/)
})

test('PptxGenJS.version matches package.json via the generated module', () => {
	assert.equal(new pptxgen().version, pkg.version)
	assert.equal(new pptxgen().version, readPackageVersion(join(import.meta.dirname, '..')))
})
