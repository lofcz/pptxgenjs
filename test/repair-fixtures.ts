/**
 * Builds small PPTX files that PowerPoint should offer to repair.
 * Mutations come from documented repair triggers in this repo (cNvPr, empty cells,
 * missing content types, NaN attrs, stripped txBody / effectLst).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSZip } from '@node-projects/jszip'
import pptxgen from '../src/pptxgen'

export type RepairExpect = 'ok' | 'repair' | 'reject'

export type RepairFixture = {
	id: string
	title: string
	/** What Office has been observed to do. Updated after a sidecar classify run. */
	expect: RepairExpect
	mutate?: (zip: JSZip) => Promise<void>
}

const here = dirname(fileURLToPath(import.meta.url))
export const REPAIR_FIXTURE_DIR = join(here, 'fixtures', 'repair')

function mustReplace (xml: string, pattern: RegExp | string, replacement: string, label: string): string {
	if (typeof pattern === 'string') {
		if (!xml.includes(pattern)) throw new Error(`${label}: missing ${JSON.stringify(pattern)}`)
		return xml.replace(pattern, replacement)
	}
	if (!pattern.test(xml)) throw new Error(`${label}: missing ${pattern}`)
	return xml.replace(pattern, replacement)
}

async function rewrite (zip: JSZip, part: string, rewriteXml: (xml: string) => string): Promise<void> {
	const file = zip.file(part)
	if (!file) throw new Error(`missing part ${part}`)
	zip.file(part, rewriteXml(await file.async('string')))
}

export const REPAIR_FIXTURES: RepairFixture[] = [
	{
		id: 'ok-baseline',
		title: 'Unmutated control deck',
		expect: 'ok',
	},
	{
		id: 'invalid-cnvid',
		title: 'Non-numeric p:cNvPr@id (MS-PPT repair)',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/slide1.xml', xml =>
			mustReplace(xml, '<p:cNvPr id="2"', '<p:cNvPr id="abc"', 'invalid-cnvid')),
	},
	{
		id: 'duplicate-cnvid',
		title: 'Two drawing objects share the same cNvPr id',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/slide1.xml', xml =>
			mustReplace(xml, '<p:cNvPr id="3"', '<p:cNvPr id="2"', 'duplicate-cnvid')),
	},
	{
		id: 'missing-txbody',
		title: 'Shape with no p:txBody (OOXML requires it)',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/slide1.xml', xml =>
			mustReplace(xml, /<p:txBody>[\s\S]*?<\/p:txBody>/, '', 'missing-txbody')),
	},
	{
		id: 'empty-txbody',
		title: 'Empty p:txBody with no paragraph',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/slide1.xml', xml =>
			mustReplace(xml, /<p:txBody>[\s\S]*?<\/p:txBody>/, '<p:txBody/>', 'empty-txbody')),
	},
	{
		id: 'empty-table-cell',
		title: 'Table cell with a txBody but no paragraphs',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/slide1.xml', xml =>
			mustReplace(
				xml,
				/<a:tc>(<a:txBody>[\s\S]*?<\/a:txBody>)/,
				'<a:tc><a:txBody><a:bodyPr/><a:lstStyle/></a:txBody>',
				'empty-table-cell',
			)),
	},
	{
		id: 'missing-effectlst',
		title: 'Solid slide background without a:effectLst',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/slide1.xml', xml =>
			mustReplace(xml, '<a:effectLst/>', '', 'missing-effectlst')),
	},
	{
		id: 'nan-cell-margin',
		title: 'Table cell marL="NaN"',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/slide1.xml', xml =>
			mustReplace(xml, /marL="\d+"/, 'marL="NaN"', 'nan-cell-margin')),
	},
	{
		id: 'invalid-sldid',
		title: 'p:sldId@id is not an unsigned int',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/presentation.xml', xml =>
			mustReplace(xml, /<p:sldId id="\d+"/, '<p:sldId id="xyz"', 'invalid-sldid')),
	},
	{
		id: 'missing-slide-override',
		title: 'Slide part has no [Content_Types] Override',
		expect: 'repair',
		mutate: zip => rewrite(zip, '[Content_Types].xml', xml =>
			mustReplace(
				xml,
				/<Override PartName="\/ppt\/slides\/slide1\.xml"[^>]*\/>/,
				'',
				'missing-slide-override',
			)),
	},
	{
		id: 'phantom-slidemaster',
		title: 'Content type Override for a slideMaster that does not exist',
		expect: 'repair',
		mutate: zip => rewrite(zip, '[Content_Types].xml', xml =>
			mustReplace(
				xml,
				'</Types>',
				'<Override PartName="/ppt/slideMasters/slideMaster2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/></Types>',
				'phantom-slidemaster',
			)),
	},
	{
		id: 'dangling-media-rel',
		title: 'Slide relationship points at a missing media part',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/_rels/slide1.xml.rels', xml =>
			mustReplace(
				xml,
				'</Relationships>',
				'<Relationship Id="rId99" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/missing.png"/></Relationships>',
				'dangling-media-rel',
			)),
	},
	{
		id: 'missing-notesmaster-override',
		title: 'notesMaster part without a content-type Override',
		expect: 'repair',
		mutate: zip => rewrite(zip, '[Content_Types].xml', xml =>
			mustReplace(
				xml,
				/<Override PartName="\/ppt\/notesMasters\/notesMaster1\.xml"[^>]*\/>/,
				'',
				'missing-notesmaster-override',
			)),
	},
	{
		id: 'empty-ppr',
		title: 'Empty a:pPr element (known repair / dropped runs)',
		expect: 'repair',
		mutate: zip => rewrite(zip, 'ppt/slides/slide1.xml', xml =>
			mustReplace(xml, /<a:pPr\b[\s\S]*?<\/a:pPr>/, '<a:pPr></a:pPr>', 'empty-ppr')),
	},
	{
		id: 'chart-bestfit-on-bar',
		title: 'Pie-only dLbls bestFit on a bar chart',
		expect: 'repair',
		mutate: async zip => {
			const charts = Object.keys(zip.files).filter(name => /^ppt\/charts\/chart\d+\.xml$/.test(name))
			if (charts.length === 0) throw new Error('chart-bestfit-on-bar: no chart part')
			await rewrite(zip, charts[0], xml => {
				if (xml.includes('<c:dLbls>')) {
					return mustReplace(xml, '<c:dLbls>', '<c:dLbls><c:showBestFit val="1"/>', 'chart-bestfit-on-bar')
				}
				return mustReplace(
					xml,
					'</c:ser>',
					'<c:dLbls><c:showBestFit val="1"/><c:showVal val="1"/></c:dLbls></c:ser>',
					'chart-bestfit-on-bar',
				)
			})
		},
	},
]

async function basePackage (): Promise<JSZip> {
	const pptx = new pptxgen()
	const slide = pptx.addSlide()
	slide.addNotes('repair fixture notes')
	slide.background = { color: 'F5F5F5' }
	slide.addText('Repair fixture', { x: 0.5, y: 0.3, w: 8, h: 0.5, fontSize: 20, bold: true })
	slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.0, w: 2, h: 1, fill: { color: 'FF0000' } })
	slide.addTable([['A', 'B'], ['1', '2']], { x: 0.5, y: 2.3, w: 4 })
	slide.addChart(pptx.ChartType.bar, [{ name: 'Sales', labels: ['Q1', 'Q2'], values: [10, 20] }], { x: 5.2, y: 1.0, w: 5, h: 3 })
	return JSZip.loadAsync((await pptx.write({ outputType: 'nodebuffer' })) as Buffer)
}

export function fixturePath (id: string): string {
	return join(REPAIR_FIXTURE_DIR, `${id}.pptx`)
}

export async function buildRepairFixtures (directory = REPAIR_FIXTURE_DIR): Promise<string[]> {
	await mkdir(directory, { recursive: true })
	const written: string[] = []
	for (const fixture of REPAIR_FIXTURES) {
		const zip = await basePackage()
		if (fixture.mutate) await fixture.mutate(zip)
		const path = join(directory, `${fixture.id}.pptx`)
		await writeFile(path, await zip.generateAsync({ type: 'nodebuffer' }))
		written.push(path)
	}
	const manifest = {
		directory,
		fixtures: REPAIR_FIXTURES.map(fixture => ({
			id: fixture.id,
			file: `${fixture.id}.pptx`,
			title: fixture.title,
			expect: fixture.expect,
		})),
	}
	await writeFile(join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
	return written
}

async function main (): Promise<void> {
	const paths = await buildRepairFixtures()
	console.log(`wrote ${paths.length} fixtures to ${REPAIR_FIXTURE_DIR}`)
	for (const fixture of REPAIR_FIXTURES) {
		console.log(`  ${fixture.id}.pptx  expect=${fixture.expect}  ${fixture.title}`)
	}
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (invokedDirectly) void main()
