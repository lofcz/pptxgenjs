/**
 * Probe which PowerPoint math wrappers survive open+save.
 * Run: npx tsx test/probe-a14-math.mjs
 */
import { createRequire } from 'module'
import { JSZip } from '@node-projects/jszip'
import fs from 'fs'
import { execFileSync } from 'child_process'
import path from 'path'

const require = createRequire(import.meta.url)
const pptxgen = require('../dist/pptxgen.cjs.js')

const MATH_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/math'
const A14_NS = 'http://schemas.microsoft.com/office/drawing/2010/main'
const MC_NS = 'http://schemas.openxmlformats.org/markup-compatibility/2006'
const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

const innerOmml = [
	`<m:oMath xmlns:m="${MATH_NS}" xmlns:w="${W_NS}">`,
	'<m:r><m:t xml:space="preserve">v=</m:t></m:r>',
	'<m:f><m:fPr><m:type m:val="bar"/></m:fPr>',
	'<m:num><m:r><m:t xml:space="preserve">s</m:t></m:r></m:num>',
	'<m:den><m:r><m:t xml:space="preserve">t</m:t></m:r></m:den>',
	'</m:f></m:oMath>',
].join('')

const payloads = {
	bare: innerOmml,
	a14_omath: `<a14:m xmlns:a14="${A14_NS}">${innerOmml}</a14:m>`,
	a14_omathPara:
		`<a14:m xmlns:a14="${A14_NS}">` +
		`<m:oMathPara xmlns:m="${MATH_NS}">` +
		'<m:oMathParaPr><m:jc m:val="left"/></m:oMathParaPr>' +
		innerOmml +
		'</m:oMathPara></a14:m>',
}

const outDir = path.resolve('test/probe-math-out')
fs.mkdirSync(outDir, { recursive: true })

async function writeVariant (name, ommlPayload, { addIgnorable, wrapAltContent }) {
	const pptx = new pptxgen()
	pptx.addSlide().addText('MARKER_LEFT MATH_HERE MARKER_RIGHT', {
		x: 0.4, y: 0.8, w: 9, h: 1.5, fontSize: 20,
	})
	const buf = Buffer.from(await pptx.write({ outputType: 'nodebuffer' }))
	const z = await JSZip.loadAsync(buf)
	let xml = await z.file('ppt/slides/slide1.xml').async('string')

	// Split the single text run into: left text | math | right text
	xml = xml.replace(
		/<a:t>MARKER_LEFT MATH_HERE MARKER_RIGHT<\/a:t>/,
		`<a:t>Konstantní rychlost: </a:t></a:r>${ommlPayload}<a:r><a:rPr lang="en-US" sz="2000" dirty="0"/><a:t> — trailing.</a:t>`,
	)

	if (addIgnorable) {
		xml = xml.replace(
			/<p:sld /,
			`<p:sld xmlns:mc="${MC_NS}" xmlns:a14="${A14_NS}" mc:Ignorable="a14" `,
		)
	}

	if (wrapAltContent) {
		xml = xml.replace(
			/(<p:sp>[\s\S]*?(?:a14:m|m:oMath)[\s\S]*?<\/p:sp>)/,
			(sp) => {
				const withTx = sp
					.replace('<p:cNvSpPr/>', '<p:cNvSpPr txBox="1"/>')
					.replace('<p:cNvSpPr></p:cNvSpPr>', '<p:cNvSpPr txBox="1"/>')
				const fallback = withTx
					.replace(/<a14:m[\s\S]*?<\/a14:m>/g, '')
					.replace(/<m:oMathPara[\s\S]*?<\/m:oMathPara>/g, '')
					.replace(/<m:oMath[\s\S]*?<\/m:oMath>/g, '')
				return (
					`<mc:AlternateContent xmlns:mc="${MC_NS}">` +
					`<mc:Choice xmlns:a14="${A14_NS}" Requires="a14">${withTx}</mc:Choice>` +
					`<mc:Fallback>${fallback}</mc:Fallback>` +
					'</mc:AlternateContent>'
				)
			},
		)
	}

	z.file('ppt/slides/slide1.xml', xml)
	const out = path.join(outDir, `${name}.pptx`)
	fs.writeFileSync(out, await z.generateAsync({ type: 'nodebuffer' }))
	fs.writeFileSync(path.join(outDir, `${name}.slide1.xml`), xml)
	return out
}

const cases = [
	{ name: '01-bare', payload: payloads.bare, opts: { addIgnorable: false, wrapAltContent: false } },
	{ name: '02-a14-omath', payload: payloads.a14_omath, opts: { addIgnorable: true, wrapAltContent: false } },
	{ name: '03-a14-omathPara', payload: payloads.a14_omathPara, opts: { addIgnorable: true, wrapAltContent: false } },
	{ name: '04-a14-omathPara-alt', payload: payloads.a14_omathPara, opts: { addIgnorable: true, wrapAltContent: true } },
	{ name: '05-a14-omath-alt', payload: payloads.a14_omath, opts: { addIgnorable: true, wrapAltContent: true } },
]

const files = []
for (const c of cases) {
	files.push({ name: c.name, file: await writeVariant(c.name, c.payload, c.opts) })
	console.log('wrote', c.name)
}

const fileList = files.map(f => f.file.replace(/'/g, "''")).map(f => `'${f}'`).join(',')
const outDirPs = outDir.replace(/'/g, "''")
const ps = `
$ErrorActionPreference = 'Continue'
$app = New-Object -ComObject PowerPoint.Application
$app.Visible = -1
$lines = @()
foreach ($item in @(${fileList})) {
  $name = [IO.Path]::GetFileNameWithoutExtension($item)
  $repaired = Join-Path '${outDirPs}' ($name + '-after.pptx')
  try {
    $pres = $app.Presentations.Open($item, $false, $false, $false)
    Start-Sleep -Milliseconds 1000
    if (Test-Path $repaired) { Remove-Item $repaired -Force }
    $pres.SaveAs($repaired)
    $pres.Close()
    $lines += ($name + '|ok|' + $repaired)
  } catch {
    $lines += ($name + '|fail|' + $_.Exception.Message)
  }
}
$app.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null
$lines -join [Environment]::NewLine
`

const psOut = execFileSync('powershell', ['-NoProfile', '-Command', ps], { encoding: 'utf8', timeout: 120000 })
console.log('COM:\n' + psOut)

for (const line of psOut.trim().split(/\r?\n/).filter(Boolean)) {
	const [name, status, repaired] = line.split('|')
	if (status !== 'ok') {
		console.log(name, 'FAILED', repaired)
		continue
	}
	const z = await JSZip.loadAsync(fs.readFileSync(repaired))
	const xml = await z.file('ppt/slides/slide1.xml').async('string')
	const oMath = (xml.match(/<m:oMath[\s/>]/g) || []).length
	const a14 = (xml.match(/<a14:m[\s/>]/g) || []).length
	const texts = [...xml.matchAll(/<a:t[^>]*>([^<]*)<\/a:t>/g)].map(m => m[1]).join('|')
	console.log(`${name}: SURVIVED oMath=${oMath} a14=${a14} texts=${JSON.stringify(texts)}`)
}
