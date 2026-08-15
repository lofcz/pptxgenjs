import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@rslib/core'
import { pluginPackageVersion } from './scripts/package-version.mjs'

const pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'package.json'), 'utf8')) as { version: string }

const banner = `/* PptxGenJS ${pkg.version} @ ${new Date().toISOString()} */\n`

const nodeLib = {
	autoExtension: false as const,
	syntax: 'es2016' as const,
	banner: { js: banner },
	output: {
		target: 'node' as const,
		minify: false,
		distPath: { root: './dist' },
		sourceMap: false,
	},
}

export default defineConfig({
	plugins: [pluginPackageVersion()],
	source: {
		entry: {
			index: './src/pptxgen.ts',
		},
		tsconfigPath: './tsconfig.json',
	},
	output: {
		cleanDistPath: true,
		filenameHash: false,
		legalComments: 'none',
	},
	lib: [
		{
			...nodeLib,
			format: 'esm',
			dts: {
				bundle: true,
				distPath: './types',
			},
			output: {
				...nodeLib.output,
				filename: { js: 'pptxgen.es.js' },
			},
		},
		{
			...nodeLib,
			format: 'cjs',
			dts: false,
			output: {
				...nodeLib.output,
				filename: { js: 'pptxgen.cjs.js' },
			},
			tools: {
				rspack (config) {
					config.output ??= {}
					config.output.library = { type: 'commonjs2', export: 'default' }
				},
			},
		},
		{
			format: 'umd',
			umdName: 'PptxGenJS',
			autoExtension: false,
			syntax: 'es2016',
			banner: { js: banner },
			autoExternal: true,
			dts: false,
			output: {
				target: 'web',
				minify: true,
				distPath: { root: './dist' },
				filename: { js: 'pptxgen.min.js' },
				sourceMap: false,
				externals: {
					'@node-projects/jszip': 'JSZip',
				},
			},
		},
		{
			format: 'umd',
			umdName: 'PptxGenJS',
			autoExtension: false,
			syntax: 'es2016',
			banner: { js: banner },
			autoExternal: false,
			dts: false,
			output: {
				target: 'web',
				minify: true,
				distPath: { root: './dist' },
				filename: { js: 'pptxgen.bundle.js' },
				sourceMap: false,
			},
		},
	],
})
