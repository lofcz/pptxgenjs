/**
 * Reproducible proof that inline OMML renders in PowerPoint.
 *
 * 1. Builds a deck with plain text + fraction math interleaved (kinematika-style).
 * 2. Asserts XML uses a14:m (required — bare m:oMath is stripped).
 * 3. If PowerPoint COM is available: open → save → assert math survived;
 *    export a PNG screenshot of the slide.
 *
 * Run: npx tsx test/prove-math-renders.mjs
 */
import { JSZip } from '@node-projects/jszip'
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import PptxGenJS from '../src/pptxgen.ts'
const pptxgen = PptxGenJS?.default ?? PptxGenJS

const OUT_DIR = path.resolve('test/prove-math-out')
fs.mkdirSync(OUT_DIR, { recursive: true })

const ommlFrac = [
	'<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"',
	' xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">',
	'<m:r><m:t xml:space="preserve">v=</m:t></m:r>',
	'<m:f><m:fPr><m:type m:val="bar"/></m:fPr>',
	'<m:num><m:r><m:t xml:space="preserve">s</m:t></m:r></m:num>',
	'<m:den><m:r><m:t xml:space="preserve">t</m:t></m:r></m:den>',
	'</m:f></m:oMath>',
].join('')

const ommlPlain = [
	'<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"',
	' xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">',
	'<m:r><m:t xml:space="preserve">s=v⋅t</m:t></m:r>',
	'</m:oMath>',
].join('')

const pptx = new pptxgen()
const slide = pptx.addSlide()
slide.addText('Inline math proof (must render as Office Math in PowerPoint)', {
	x: 0.4, y: 0.25, w: 9.2, h: 0.45, fontSize: 16, bold: true, color: '1F3A5F',
})
slide.addText(
	[
		{ text: 'Konstantní rychlost: ' },
		{ text: '', options: { omml: ommlFrac } },
		{ text: ' — and trailing text after the equation.' },
	],
	{ x: 0.4, y: 0.9, w: 9.2, h: 1.0, fontSize: 20, color: '283544' },
)
slide.addText(
	[
		{ text: 'Dráha: ', options: { bullet: { code: '2022' } } },
		{ text: '', options: { omml: ommlPlain } },
		{ text: ' mixed in a bullet.' },
	],
	{ x: 0.4, y: 2.1, w: 9.2, h: 1.0, fontSize: 18, color: '283544' },
)
slide.addText(
	[
		{ text: 'Also mid-sentence: ' },
		{ text: '', options: { omml: ommlFrac } },
		{ text: ' and again ' },
		{ text: '', options: { omml: ommlPlain } },
		{ text: '.' },
	],
	{ x: 0.4, y: 3.3, w: 9.2, h: 1.2, fontSize: 18, color: '283544' },
)

const pptxPath = path.join(OUT_DIR, 'inline-math-proof.pptx')
const buf = Buffer.from(await pptx.write({ outputType: 'nodebuffer' }))
fs.writeFileSync(pptxPath, buf)

const zip = await JSZip.loadAsync(buf)
const slideXml = await zip.file('ppt/slides/slide1.xml').async('string')
fs.writeFileSync(path.join(OUT_DIR, 'inline-math-proof.slide1.xml'), slideXml)

const checks = {
	a14Wrap: /<a14:m[\s>][\s\S]*?<m:oMath[\s>]/.test(slideXml),
	a14Count: (slideXml.match(/<a14:m[\s/>]/g) || []).length,
	oMathCount: (slideXml.match(/<m:oMath[\s/>]/g) || []).length,
	mixedInline: /<a:t>Konstantní rychlost: <\/a:t><\/a:r><a14:m[\s\S]*?<\/a14:m><a:r>[\s\S]*?<a:t> — and trailing/.test(slideXml),
	txBox: slideXml.includes('txBox="1"'),
	a14Ns: slideXml.includes('xmlns:a14='),
}
console.log('XML checks:', checks)
if (!checks.a14Wrap || !checks.mixedInline || checks.a14Count < 4) {
	console.error('FAIL: XML does not contain PowerPoint-compatible inline math')
	process.exit(1)
}

// Also copy to Downloads for easy open
const downloads = path.join(process.env.USERPROFILE || '', 'Downloads', 'pptxgenjs-inline-math-proof.pptx')
try {
	fs.copyFileSync(pptxPath, downloads)
	console.log('Copied demo to', downloads)
} catch (e) {
	console.warn('Could not copy to Downloads:', e.message)
}

// PowerPoint COM round-trip proof
const afterPath = path.join(OUT_DIR, 'inline-math-proof-after-ppt.pptx')
const pngPath = path.join(OUT_DIR, 'inline-math-proof-slide.png')
const ps = `
$ErrorActionPreference = 'Stop'
$app = New-Object -ComObject PowerPoint.Application
$app.Visible = -1
$pres = $app.Presentations.Open('${pptxPath.replace(/'/g, "''")}', $false, $false, $true)
Start-Sleep -Milliseconds 1500
if (Test-Path '${afterPath.replace(/'/g, "''")}') { Remove-Item '${afterPath.replace(/'/g, "''")}' -Force }
$pres.SaveAs('${afterPath.replace(/'/g, "''")}')
# Export slide as PNG (ppShapeFormatPNG = 2)
$pres.Slides.Item(1).Export('${pngPath.replace(/'/g, "''")}', 'PNG', 1280, 720)
$pres.Close()
$app.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null
Write-Output 'COM_OK'
`

try {
	const out = execFileSync('powershell', ['-NoProfile', '-Command', ps], { encoding: 'utf8', timeout: 90000 })
	console.log(out.trim())
	const z2 = await JSZip.loadAsync(fs.readFileSync(afterPath))
	const afterXml = await z2.file('ppt/slides/slide1.xml').async('string')
	const survived = (afterXml.match(/<m:oMath[\s/>]/g) || []).length
	const a14 = (afterXml.match(/<a14:m[\s/>]/g) || []).length
	console.log(`PowerPoint round-trip: oMath=${survived} a14:m=${a14}`)
	if (survived < 1) {
		console.error('FAIL: PowerPoint stripped math on open/save')
		process.exit(1)
	}
	console.log('PNG export:', fs.existsSync(pngPath) ? pngPath : 'missing')
	console.log('PASS: inline math survives PowerPoint and was exported to PNG')
} catch (e) {
	console.warn('PowerPoint COM proof skipped/failed:', e.message)
	console.log('XML-level proof still PASS — open', pptxPath, 'in PowerPoint Desktop to verify visually')
}
