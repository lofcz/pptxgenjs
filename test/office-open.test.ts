/**
 * Opens a generated presentation with LibreOffice and converts it to PDF.
 * Run explicitly with PPTXGENJS_OFFICE_BIN set to libreoffice or soffice.
 */
import assert from 'node:assert/strict'
import { execFile as execFileCallback } from 'node:child_process'
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { test } from 'node:test'
import pptxgen from '../src/pptxgen'

const officeBinary = process.env.PPTXGENJS_OFFICE_BIN
if (!officeBinary) throw new Error('Set PPTXGENJS_OFFICE_BIN to the LibreOffice executable before running npm run test:office')

const execFile = promisify(execFileCallback)

test('office: LibreOffice opens and converts a generated presentation', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'pptxgenjs-office-'))
	const presentationPath = join(directory, 'smoke.pptx')

	try {
		const pptx = new pptxgen()
		const slide = pptx.addSlide()
		slide.addText('OOXML consumer smoke test', { x: 0.5, y: 0.5, w: 5, h: 0.5 })
		slide.addTable([['Region', 'Sales'], ['West', '20']], { x: 0.5, y: 1.5, w: 5 })
		slide.addChart(pptx.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [10, 20] }], { x: 0.5, y: 3, w: 6, h: 3 })
		await writeFile(presentationPath, (await pptx.write({ outputType: 'nodebuffer' })) as Buffer)

		await execFile(officeBinary, ['--headless', '--convert-to', 'pdf', '--outdir', directory, presentationPath], { timeout: 60_000 })
		assert.ok((await stat(join(directory, 'smoke.pdf'))).size > 0, 'LibreOffice did not produce a PDF')
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
})

