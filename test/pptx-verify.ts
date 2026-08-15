/**
 * Shared PPTX inspect + verify for the generator test suite.
 *
 * `verifyPptx` loads a package, returns a structured inventory, runs the existing
 * OOXML package contracts, and optionally opens the file with the hidden-desktop
 * PowerPoint sidecar (`tools/powerpoint-verify`).
 */
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSZip } from '@node-projects/jszip'
import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { assertEmbeddedXlsxContracts, assertPptxPackageContracts } from './pptx-contracts'
import {
	isPowerPointSidecarAvailable,
	verifyPptxWithPowerPoint,
	type PowerPointVerifyResult,
} from './powerpoint-verify'

const EMU_PER_INCH = 914400
const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

const SLIDE_REL_SUFFIX = '/relationships/slide'
const NOTES_REL_SUFFIX = '/relationships/notesSlide'
const CHART_URI = 'http://schemas.openxmlformats.org/drawingml/2006/chart'
const TABLE_URI = 'http://schemas.openxmlformats.org/drawingml/2006/table'

export type PptxSource = string | Uint8Array | ArrayBuffer | JSZip

export type VerifyPptxOptions = {
	/** Open the file with the Rust PowerPoint sidecar. Default false so CI stays headless. */
	powerpoint?: boolean | 'auto'
	timeoutMs?: number
}

export type PptxIssue = {
	code: string
	message: string
	part?: string
	spec?: string
}

export type PptxPart = {
	name: string
	size: number
	kind: 'xml' | 'rels' | 'media' | 'embedding' | 'font' | 'binary'
}

export type PptxRelationship = {
	id: string
	type?: string
	target: string
	resolved?: string
	targetMode?: string
}

export type PptxSlideObject = {
	kind: 'text' | 'shape' | 'table' | 'chart' | 'image' | 'connector' | 'group' | 'other'
	id?: string
	name?: string
	preset?: string
	relId?: string
	text: string[]
}

export type PptxSlide = {
	index: number
	part: string
	rId?: string
	sldId?: string
	notesPart?: string
	notes?: string
	hasTiming: boolean
	hasTransition: boolean
	texts: string[]
	objects: PptxSlideObject[]
}

export type PptxPresentation = {
	slideCount: number
	slideWidthEmu?: number
	slideHeightEmu?: number
	slideWidthIn?: number
	slideHeightIn?: number
	sldIds: Array<{ id?: string, rId?: string, part?: string }>
}

export type PptxVerifyReport = {
	ok: boolean
	zip: boolean
	path?: string
	parts: PptxPart[]
	contentTypes: {
		defaults: Array<{ extension: string, contentType: string }>
		overrides: Array<{ part: string, contentType: string }>
	}
	relationships: Record<string, PptxRelationship[]>
	presentation: PptxPresentation | null
	slides: PptxSlide[]
	layouts: string[]
	masters: string[]
	themes: string[]
	media: string[]
	charts: string[]
	embeddings: string[]
	fonts: string[]
	issues: PptxIssue[]
	powerpoint?: PowerPointVerifyResult | { skipped: string }
}

type XmlObject = Record<string, unknown>
type WritableDeck = {
	write: (props?: { outputType: 'nodebuffer' }) => Promise<unknown>
}

function isXmlObject (value: unknown): value is XmlObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asXmlObjects (value: unknown): XmlObject[] {
	if (Array.isArray(value)) return value.filter(isXmlObject)
	return isXmlObject(value) ? [value] : []
}

function localName (key: string): string {
	const colon = key.lastIndexOf(':')
	return colon === -1 ? key : key.slice(colon + 1)
}

function isZipSource (value: unknown): value is JSZip {
	return typeof value === 'object' && value !== null && 'files' in value && typeof (value as JSZip).file === 'function'
}

function parseXml (xml: string): XmlObject | undefined {
	if (XMLValidator.validate(xml) !== true) return undefined
	const parsed = xmlParser.parse(xml)
	return isXmlObject(parsed) ? parsed : undefined
}

function partKind (name: string): PptxPart['kind'] {
	if (name.endsWith('.rels')) return 'rels'
	if (name.endsWith('.xml')) return 'xml'
	if (name.startsWith('ppt/media/')) return 'media'
	if (name.startsWith('ppt/embeddings/')) return 'embedding'
	if (name.startsWith('ppt/fonts/')) return 'font'
	return 'binary'
}

function sourcePartForRelationships (relationshipPart: string): string | undefined {
	if (relationshipPart === '_rels/.rels') return undefined
	const marker = '/_rels/'
	const markerIndex = relationshipPart.lastIndexOf(marker)
	if (markerIndex === -1 || !relationshipPart.endsWith('.rels')) return undefined
	return relationshipPart.slice(0, markerIndex) + '/' + relationshipPart.slice(markerIndex + marker.length, -'.rels'.length)
}

function resolveTarget (sourcePart: string | undefined, target: string): string {
	if (target.startsWith('/')) return target.slice(1)
	const baseDir = sourcePart ? posix.dirname(sourcePart) : '.'
	return posix.normalize(posix.join(baseDir, target)).replace(/^\.\//, '')
}

function collectText (value: unknown, out: string[]): void {
	if (Array.isArray(value)) {
		value.forEach(item => collectText(item, out))
		return
	}
	if (!isXmlObject(value)) return
	for (const [key, child] of Object.entries(value)) {
		if (localName(key) === 't' && (typeof child === 'string' || typeof child === 'number')) {
			out.push(String(child))
		} else if (!key.startsWith('@_') && !key.startsWith('?')) {
			collectText(child, out)
		}
	}
}

function attr (node: XmlObject, name: string): string | undefined {
	const direct = node[`@_${name}`]
	if (typeof direct === 'string') return direct
	for (const [key, value] of Object.entries(node)) {
		if (key.startsWith('@_') && localName(key.slice(2)) === name && typeof value === 'string') return value
	}
	return undefined
}

function child (node: XmlObject, name: string): XmlObject | undefined {
	for (const [key, value] of Object.entries(node)) {
		if (localName(key) === name) return asXmlObjects(value)[0]
	}
	return undefined
}

function children (node: XmlObject, name: string): XmlObject[] {
	const found: XmlObject[] = []
	for (const [key, value] of Object.entries(node)) {
		if (localName(key) === name) found.push(...asXmlObjects(value))
	}
	return found
}

function emptyReport (issues: PptxIssue[], extras: Partial<PptxVerifyReport> = {}): PptxVerifyReport {
	return {
		ok: false,
		zip: false,
		parts: [],
		contentTypes: { defaults: [], overrides: [] },
		relationships: {},
		presentation: null,
		slides: [],
		layouts: [],
		masters: [],
		themes: [],
		media: [],
		charts: [],
		embeddings: [],
		fonts: [],
		issues,
		...extras,
	}
}

function issue (code: string, message: string, part?: string, spec?: string): PptxIssue {
	return { code, message, part, spec }
}

async function loadZip (source: PptxSource): Promise<{ zip?: JSZip, bytes?: Uint8Array, path?: string, error?: string }> {
	if (typeof source === 'string') {
		const bytes = await readFile(source)
		try {
			return { zip: await JSZip.loadAsync(bytes), bytes, path: source }
		} catch (err) {
			return { bytes, path: source, error: err instanceof Error ? err.message : String(err) }
		}
	}
	if (isZipSource(source)) {
		return { zip: source }
	}
	const bytes = source instanceof ArrayBuffer ? new Uint8Array(source) : source
	try {
		return { zip: await JSZip.loadAsync(bytes), bytes }
	} catch (err) {
		return { bytes, error: err instanceof Error ? err.message : String(err) }
	}
}

async function partBytes (zip: JSZip, name: string): Promise<number> {
	const file = zip.file(name)
	if (!file) return 0
	return (await file.async('uint8array')).byteLength
}

function relationshipsFromXml (xml: string): PptxRelationship[] {
	const parsed = parseXml(xml)
	if (!parsed) return []
	const relationships = parsed.Relationships
	if (!isXmlObject(relationships)) return []
	return asXmlObjects(relationships.Relationship).flatMap(entry => {
		const id = entry['@_Id']
		const target = entry['@_Target']
		if (typeof id !== 'string' || typeof target !== 'string') return []
		const type = typeof entry['@_Type'] === 'string' ? entry['@_Type'] : undefined
		const targetMode = typeof entry['@_TargetMode'] === 'string' ? entry['@_TargetMode'] : undefined
		return [{ id, target, type, targetMode }]
	})
}

function walkSlideObjects (node: XmlObject): PptxSlideObject[] {
	const objects: PptxSlideObject[] = []
	for (const [key, value] of Object.entries(node)) {
		if (key.startsWith('@_') || key.startsWith('?')) continue
		const name = localName(key)
		for (const childNode of asXmlObjects(value)) {
			if (name === 'sp') objects.push(shapeObject(childNode, 'shape'))
			else if (name === 'pic') objects.push(pictureObject(childNode))
			else if (name === 'graphicFrame') objects.push(graphicObject(childNode))
			else if (name === 'cxnSp') objects.push(shapeObject(childNode, 'connector'))
			else if (name === 'grpSp') {
				const texts: string[] = []
				collectText(childNode, texts)
				objects.push({ kind: 'group', name: cNvPr(childNode)?.name, id: cNvPr(childNode)?.id, text: texts })
				objects.push(...walkSlideObjects(childNode))
			} else if (name === 'spTree' || name === 'grpSpPr') {
				objects.push(...walkSlideObjects(childNode))
			}
		}
	}
	return objects
}

function cNvPr (node: XmlObject): { id?: string, name?: string } {
	const visit = (value: unknown): { id?: string, name?: string } | undefined => {
		if (Array.isArray(value)) {
			for (const item of value) {
				const found = visit(item)
				if (found) return found
			}
			return undefined
		}
		if (!isXmlObject(value)) return undefined
		for (const [key, childValue] of Object.entries(value)) {
			if (localName(key) === 'cNvPr' && isXmlObject(childValue)) {
				return { id: attr(childValue, 'id'), name: attr(childValue, 'name') }
			}
			if (!key.startsWith('@_')) {
				const found = visit(childValue)
				if (found) return found
			}
		}
		return undefined
	}
	return visit(node) ?? {}
}

function shapeObject (node: XmlObject, kind: 'shape' | 'connector'): PptxSlideObject {
	const texts: string[] = []
	collectText(node, texts)
	const geom = findFirst(node, 'prstGeom')
	const nv = cNvPr(node)
	return {
		kind: texts.length && kind === 'shape' ? 'text' : kind,
		id: nv.id,
		name: nv.name,
		preset: geom ? attr(geom, 'prst') : undefined,
		text: texts,
	}
}

function pictureObject (node: XmlObject): PptxSlideObject {
	const texts: string[] = []
	collectText(node, texts)
	const blip = findFirst(node, 'blip')
	const nv = cNvPr(node)
	return {
		kind: 'image',
		id: nv.id,
		name: nv.name,
		relId: blip ? attr(blip, 'embed') : undefined,
		text: texts,
	}
}

function graphicObject (node: XmlObject): PptxSlideObject {
	const texts: string[] = []
	collectText(node, texts)
	const graphicData = findFirst(node, 'graphicData')
	const uri = graphicData ? attr(graphicData, 'uri') : undefined
	const chart = graphicData ? findFirst(graphicData, 'chart') : undefined
	const nv = cNvPr(node)
	let kind: PptxSlideObject['kind'] = 'other'
	if (uri === TABLE_URI || (graphicData && findFirst(graphicData, 'tbl'))) kind = 'table'
	else if (uri === CHART_URI || chart) kind = 'chart'
	return {
		kind,
		id: nv.id,
		name: nv.name,
		relId: chart ? attr(chart, 'id') : undefined,
		text: texts,
	}
}

function findFirst (value: unknown, name: string): XmlObject | undefined {
	if (Array.isArray(value)) {
		for (const item of value) {
			const found = findFirst(item, name)
			if (found) return found
		}
		return undefined
	}
	if (!isXmlObject(value)) return undefined
	for (const [key, childValue] of Object.entries(value)) {
		if (localName(key) === name) return asXmlObjects(childValue)[0]
		if (!key.startsWith('@_') && !key.startsWith('?')) {
			const found = findFirst(childValue, name)
			if (found) return found
		}
	}
	return undefined
}

async function inspectZip (zip: JSZip): Promise<Omit<PptxVerifyReport, 'ok' | 'zip' | 'issues' | 'powerpoint' | 'path'>> {
	const names = Object.keys(zip.files).filter(name => !name.endsWith('/')).sort()
	const parts: PptxPart[] = []
	for (const name of names) {
		parts.push({ name, size: await partBytes(zip, name), kind: partKind(name) })
	}

	const contentTypes = { defaults: [] as Array<{ extension: string, contentType: string }>, overrides: [] as Array<{ part: string, contentType: string }> }
	const typesXml = zip.file('[Content_Types].xml') ? await zip.file('[Content_Types].xml')!.async('string') : ''
	const typesParsed = typesXml ? parseXml(typesXml) : undefined
	const typesRoot = typesParsed && isXmlObject(typesParsed.Types) ? typesParsed.Types : undefined
	if (typesRoot) {
		for (const entry of asXmlObjects(typesRoot.Default)) {
			const extension = entry['@_Extension']
			const contentType = entry['@_ContentType']
			if (typeof extension === 'string' && typeof contentType === 'string') {
				contentTypes.defaults.push({ extension, contentType })
			}
		}
		for (const entry of asXmlObjects(typesRoot.Override)) {
			const partName = entry['@_PartName']
			const contentType = entry['@_ContentType']
			if (typeof partName === 'string' && typeof contentType === 'string') {
				contentTypes.overrides.push({ part: partName.replace(/^\//, ''), contentType })
			}
		}
	}

	const relationships: Record<string, PptxRelationship[]> = {}
	for (const name of names.filter(part => part.endsWith('.rels'))) {
		const xml = await zip.file(name)!.async('string')
		const sourcePart = sourcePartForRelationships(name)
		relationships[name] = relationshipsFromXml(xml).map(rel => ({
			...rel,
			resolved: rel.targetMode === 'External' ? undefined : resolveTarget(sourcePart, rel.target),
		}))
	}

	const presentationRels = relationships['ppt/_rels/presentation.xml.rels'] ?? []
	const slideRelById = new Map(
		presentationRels
			.filter(rel => typeof rel.type === 'string' && rel.type.endsWith(SLIDE_REL_SUFFIX))
			.map(rel => [rel.id, rel]),
	)

	let presentation: PptxPresentation | null = null
	const slides: PptxSlide[] = []
	const presentationXml = zip.file('ppt/presentation.xml') ? await zip.file('ppt/presentation.xml')!.async('string') : ''
	const presentationParsed = presentationXml ? parseXml(presentationXml) : undefined
	const presentationRoot = presentationParsed ? findFirst(presentationParsed, 'presentation') : undefined
	if (presentationRoot) {
		const sldSz = child(presentationRoot, 'sldSz')
		const cx = sldSz ? Number(attr(sldSz, 'cx')) : undefined
		const cy = sldSz ? Number(attr(sldSz, 'cy')) : undefined
		const sldIds = children(child(presentationRoot, 'sldIdLst') ?? {}, 'sldId').map(entry => {
			const rid = typeof entry['@_r:id'] === 'string' ? entry['@_r:id'] : undefined
			const rel = rid ? slideRelById.get(rid) : undefined
			return {
				id: typeof entry['@_id'] === 'string' ? entry['@_id'] : undefined,
				rId: rid,
				part: rel?.resolved,
			}
		})
		presentation = {
			slideCount: sldIds.length,
			slideWidthEmu: Number.isFinite(cx) ? cx : undefined,
			slideHeightEmu: Number.isFinite(cy) ? cy : undefined,
			slideWidthIn: Number.isFinite(cx) ? (cx as number) / EMU_PER_INCH : undefined,
			slideHeightIn: Number.isFinite(cy) ? (cy as number) / EMU_PER_INCH : undefined,
			sldIds,
		}

		for (const [index, sld] of sldIds.entries()) {
			if (!sld.part || !zip.file(sld.part)) continue
			slides.push(await inspectSlide(zip, relationships, index + 1, sld.part, sld.rId, sld.id))
		}
	}

	const slideParts = names.filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
	if (slides.length === 0) {
		for (const [index, part] of slideParts.entries()) {
			slides.push(await inspectSlide(zip, relationships, index + 1, part))
		}
	}

	return {
		parts,
		contentTypes,
		relationships,
		presentation,
		slides,
		layouts: names.filter(name => /^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(name)),
		masters: names.filter(name => /^ppt\/slideMasters\/slideMaster\d+\.xml$/.test(name)),
		themes: names.filter(name => /^ppt\/theme\/theme\d+\.xml$/.test(name)),
		media: names.filter(name => name.startsWith('ppt/media/')),
		charts: names.filter(name => /^ppt\/charts\/chart\d+\.xml$/.test(name)),
		embeddings: names.filter(name => name.startsWith('ppt/embeddings/')),
		fonts: names.filter(name => name.startsWith('ppt/fonts/')),
	}
}

async function inspectSlide (
	zip: JSZip,
	relationships: Record<string, PptxRelationship[]>,
	index: number,
	part: string,
	rId?: string,
	sldId?: string,
): Promise<PptxSlide> {
	const xml = await zip.file(part)!.async('string')
	const parsed = parseXml(xml)
	const sld = parsed ? findFirst(parsed, 'sld') : undefined
	const cSld = sld ? child(sld, 'cSld') : undefined
	const spTree = cSld ? child(cSld, 'spTree') : undefined
	const objects = spTree ? walkSlideObjects(spTree) : []
	const texts: string[] = []
	if (sld) collectText(sld, texts)
	const relPart = `${posix.dirname(part)}/_rels/${posix.basename(part)}.rels`
	const notesRel = (relationships[relPart] ?? []).find(rel => typeof rel.type === 'string' && rel.type.endsWith(NOTES_REL_SUFFIX))
	let notes: string | undefined
	if (notesRel?.resolved && zip.file(notesRel.resolved)) {
		const notesXml = await zip.file(notesRel.resolved)!.async('string')
		const notesTexts: string[] = []
		const notesParsed = parseXml(notesXml)
		if (notesParsed) collectText(notesParsed, notesTexts)
		notes = notesTexts.join('')
	}
	return {
		index,
		part,
		rId,
		sldId,
		notesPart: notesRel?.resolved,
		notes,
		hasTiming: Boolean(sld && child(sld, 'timing')),
		hasTransition: Boolean(sld && (child(sld, 'transition') || findFirst(sld, 'AlternateContent'))),
		texts,
		objects,
	}
}

async function collectContractIssues (zip: JSZip): Promise<PptxIssue[]> {
	const issues: PptxIssue[] = []
	try {
		await assertPptxPackageContracts(zip)
	} catch (err) {
		issues.push(issue('package-contract', err instanceof Error ? err.message : String(err), undefined, 'ECMA-376 / MS-PPTX'))
	}
	try {
		await assertEmbeddedXlsxContracts(zip)
	} catch (err) {
		issues.push(issue('embedded-xlsx', err instanceof Error ? err.message : String(err), undefined, 'ECMA-376 SpreadsheetML'))
	}
	return issues
}

async function runPowerPoint (
	sourcePath: string | undefined,
	bytes: Uint8Array | undefined,
	zip: JSZip | undefined,
	options: VerifyPptxOptions,
): Promise<{ result?: PowerPointVerifyResult | { skipped: string }, issues: PptxIssue[] }> {
	const mode = options.powerpoint ?? false
	if (mode === false) return { issues: [] }
	if (!isPowerPointSidecarAvailable()) {
		const skipped = { skipped: 'powerpoint-unavailable' }
		if (mode === true) return { result: skipped, issues: [issue('powerpoint-unavailable', 'PowerPoint sidecar is not available on this machine')] }
		return { result: skipped, issues: [] }
	}

	let path = sourcePath
	let cleanup: string | undefined
	if (!path) {
		const directory = await mkdtemp(join(tmpdir(), 'pptxgenjs-verify-'))
		cleanup = directory
		path = join(directory, 'deck.pptx')
		const payload = bytes ?? (zip ? await zip.generateAsync({ type: 'uint8array' }) : undefined)
		if (!payload) {
			await rm(directory, { recursive: true, force: true })
			return { result: { skipped: 'no-bytes' }, issues: [issue('powerpoint-input', 'no PPTX bytes to hand to PowerPoint')] }
		}
		await writeFile(path, payload)
	}

	try {
		const [result] = await verifyPptxWithPowerPoint(path, { timeoutMs: options.timeoutMs })
		const issues: PptxIssue[] = []
		if (result.verdict !== 'ok') {
			issues.push(issue('powerpoint', `PowerPoint verdict: ${result.verdict}`, path, result.repairSummary ?? result.error ?? undefined))
		}
		return { result, issues }
	} finally {
		if (cleanup) await rm(cleanup, { recursive: true, force: true })
	}
}

export function isPowerPointResult (value: PptxVerifyReport['powerpoint']): value is PowerPointVerifyResult {
	return Boolean(value && 'verdict' in value)
}

export async function verifyPptx (source: PptxSource, options: VerifyPptxOptions = {}): Promise<PptxVerifyReport> {
	const loaded = await loadZip(source)
	if (!loaded.zip) {
		const issues = [issue('not-zip', loaded.error ?? 'input is not a ZIP/PPTX package')]
		const powerpoint = await runPowerPoint(loaded.path, loaded.bytes, undefined, options)
		return emptyReport([...issues, ...powerpoint.issues], {
			path: loaded.path,
			powerpoint: powerpoint.result,
		})
	}

	const inventory = await inspectZip(loaded.zip)
	const issues = await collectContractIssues(loaded.zip)
	const powerpoint = await runPowerPoint(loaded.path, loaded.bytes, loaded.zip, options)
	issues.push(...powerpoint.issues)

	return {
		ok: issues.length === 0,
		zip: true,
		path: loaded.path,
		...inventory,
		issues,
		powerpoint: powerpoint.result,
	}
}

export async function writeAndVerify (pptx: WritableDeck, options: VerifyPptxOptions = {}): Promise<PptxVerifyReport> {
	const bytes = await pptx.write({ outputType: 'nodebuffer' })
	return verifyPptx(bytes as Uint8Array, options)
}

/** Inspect each path, then open them all in one PowerPoint sidecar session. */
export async function verifyPptxFiles (paths: string[], options: VerifyPptxOptions = {}): Promise<PptxVerifyReport[]> {
	const reports = await Promise.all(paths.map(path => verifyPptx(path, { ...options, powerpoint: false })))
	const mode = options.powerpoint ?? false
	if (mode === false) return reports
	if (!isPowerPointSidecarAvailable()) {
		const skipped = { skipped: 'powerpoint-unavailable' }
		const extra = mode === true ? [issue('powerpoint-unavailable', 'PowerPoint sidecar is not available on this machine')] : []
		return reports.map(report => ({
			...report,
			ok: extra.length === 0 ? report.ok : false,
			issues: [...report.issues, ...extra],
			powerpoint: skipped,
		}))
	}
	const results = await verifyPptxWithPowerPoint(paths, { timeoutMs: options.timeoutMs })
	return reports.map((report, index) => {
		const result = results[index]
		const extra = result && result.verdict !== 'ok'
			? [issue('powerpoint', `PowerPoint verdict: ${result.verdict}`, paths[index], result.repairSummary ?? result.error ?? undefined)]
			: []
		return {
			...report,
			ok: report.ok && extra.length === 0,
			issues: [...report.issues, ...extra],
			powerpoint: result,
		}
	})
}

export function assertVerified (report: PptxVerifyReport): void {
	if (report.ok) return
	const detail = report.issues.map(item => item.part ? `${item.code}: ${item.message} (${item.part})` : `${item.code}: ${item.message}`).join('\n')
	throw new Error(detail || 'PPTX verification failed')
}

async function main (): Promise<void> {
	const args = process.argv.slice(2)
	const powerpoint = args.includes('--powerpoint') ? true : args.includes('--no-powerpoint') ? false : 'auto'
	const files = args.filter(arg => !arg.startsWith('--'))
	if (files.length === 0) {
		console.error('usage: bun test/pptx-verify.ts [--powerpoint|--no-powerpoint] <file.pptx>...')
		process.exit(2)
	}
	const reports = files.length > 1 && powerpoint !== false
		? await verifyPptxFiles(files, { powerpoint })
		: await Promise.all(files.map(file => verifyPptx(file, { powerpoint })))
	console.log(JSON.stringify(reports, null, 2))
	if (reports.some(report => !report.ok)) process.exit(1)
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (invokedDirectly) void main()
