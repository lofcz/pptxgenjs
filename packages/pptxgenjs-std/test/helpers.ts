/**
 * Shared parsers for the std tests.
 *
 * The helpers are asserted through a generated package rather than by inspecting the slide object
 * model: a construction like the waterfall riser only holds if the series reach PowerPoint intact.
 */
import assert from 'node:assert/strict'
import { JSZip } from '@node-projects/jszip'
/** One `<c:ser>` block, reduced to what a construction can get wrong */
export interface Series {
	name: string
	values: number[]
	labels: string[]
	/** Data label text supplied per point; empty strings are labels the construction suppressed */
	dataLabels: string[]
	noFill: boolean
	fillColor: string
}

type WritablePres = { write: (opts: { outputType: 'nodebuffer' }) => Promise<unknown> }

export const packageZip = async (pptx: WritablePres): Promise<JSZip> =>
	await JSZip.loadAsync((await pptx.write({ outputType: 'nodebuffer' })) as Buffer)

export const chartXml = async (pptx: WritablePres): Promise<string> => {
	const zip = await packageZip(pptx)
	const names = Object.keys(zip.files).filter(file => /^ppt\/charts\/chart\d+\.xml$/.test(file))
	assert.equal(names.length, 1, 'expected exactly one chart part')
	const part = await zip.file(names[0])?.async('string')
	assert.ok(part, 'chart part unreadable')
	return part
}

const numbers = (block: string, element: 'c:val' | 'c:cat'): string[] => {
	const scope = new RegExp(`<${element}>[\\s\\S]*?</${element}>`, 'g')
	return [...block.matchAll(scope)].flatMap(match => [...match[0].matchAll(/<c:v>(.*?)<\/c:v>/g)].map(hit => hit[1]))
}

/** `<c:ser>` blocks in document order */
export const series = (xml: string): Series[] =>
	xml.split('<c:ser>').slice(1).map(block => {
		const beforeCategories = block.slice(0, block.indexOf('<c:cat>'))
		return {
			name: /<c:tx>[\s\S]*?<c:v>(.*?)<\/c:v>/.exec(block)?.[1] ?? '',
			values: numbers(block, 'c:val').map(Number),
			labels: numbers(block, 'c:cat'),
			dataLabels: [...beforeCategories.matchAll(/<a:t>(.*?)<\/a:t>/g)].map(hit => hit[1]),
			noFill: /<a:noFill\/>/.test(beforeCategories),
			fillColor: /<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"\/>/.exec(beforeCategories)?.[1] ?? '',
		}
	})
