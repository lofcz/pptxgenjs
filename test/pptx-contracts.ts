/**
 * Executable contracts for generated OOXML packages.
 *
 * These validate package semantics rather than comparing whole XML documents. Feature-specific
 * XML assertions stay next to the test that creates the feature.
 */
import assert from 'node:assert/strict'
import { posix } from 'node:path'
import { JSZip } from '@node-projects/jszip'
import { XMLParser, XMLValidator } from 'fast-xml-parser'
import {
	AUTHOR_PART_CONTENT_TYPE,
	AUTHOR_REL_TYPE,
	COMMENT_PART_CONTENT_TYPE,
	COMMENT_REL_TYPE,
	P188_NS,
} from '../src/gen-comments'

const REQUIRED_PPTX_PARTS = [
	'[Content_Types].xml',
	'_rels/.rels',
	'ppt/presentation.xml',
	'ppt/_rels/presentation.xml.rels',
]
const REQUIRED_XLSX_PARTS = [
	'[Content_Types].xml',
	'_rels/.rels',
	'xl/workbook.xml',
	'xl/_rels/workbook.xml.rels',
]
const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

type XmlObject = Record<string, unknown>
type Relationship = {
	id: string
	target: string
	type?: string
	targetMode?: string
}

const SLIDE_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml'
const SLIDE_RELATIONSHIP_SUFFIX = '/relationships/slide'

/** Read a generated OOXML part and fail with its package path when it is absent. */
export async function readPart (zip: JSZip, name: string): Promise<string> {
	const part = zip.file(name)
	assert.ok(part, `missing package part: ${name}`)
	return await part.async('string')
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

function isXmlObject (value: unknown): value is XmlObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asXmlObjects (value: unknown): XmlObject[] {
	if (Array.isArray(value)) return value.filter(isXmlObject)
	return isXmlObject(value) ? [value] : []
}

function parseXml (xml: string, name: string): XmlObject {
	const parsed = xmlParser.parse(xml)
	assert.ok(isXmlObject(parsed), `invalid XML object in ${name}`)
	return parsed
}

function contentTypeForPart (partName: string, defaults: Set<string>, overrides: Set<string>): boolean {
	if (partName === '[Content_Types].xml') return true
	const extension = partName.endsWith('.rels') ? 'rels' : posix.extname(partName).slice(1).toLowerCase()
	return overrides.has(partName) || defaults.has(extension)
}

async function assertContentTypes (zip: JSZip, packageParts: Set<string>): Promise<void> {
	const contentTypes = parseXml(await readPart(zip, '[Content_Types].xml'), '[Content_Types].xml')
	const types = contentTypes.Types
	assert.ok(isXmlObject(types), 'missing Types root in [Content_Types].xml')

	const defaults = new Set<string>()
	for (const entry of asXmlObjects(types.Default)) {
		const extension = entry['@_Extension']
		const contentType = entry['@_ContentType']
		assert.equal(typeof extension, 'string', 'content type default without Extension')
		assert.equal(typeof contentType, 'string', `content type default without ContentType for ${extension}`)
		const normalizedExtension = extension.toLowerCase()
		assert.ok(!defaults.has(normalizedExtension), `duplicate content type default for .${extension}`)
		defaults.add(normalizedExtension)
	}

	const overrides = new Set<string>()
	for (const entry of asXmlObjects(types.Override)) {
		const partName = entry['@_PartName']
		const contentType = entry['@_ContentType']
		assert.equal(typeof partName, 'string', 'content type override without PartName')
		assert.equal(typeof contentType, 'string', `content type override without ContentType for ${partName}`)
		const normalizedPartName = partName.replace(/^\//, '')
		assert.ok(packageParts.has(normalizedPartName), `content type points to missing package part: ${normalizedPartName}`)
		assert.ok(!overrides.has(normalizedPartName), `duplicate content type override for ${normalizedPartName}`)
		overrides.add(normalizedPartName)
	}

	for (const partName of packageParts) {
		assert.ok(contentTypeForPart(partName, defaults, overrides), `package part has no content type: ${partName}`)
	}
}

function relationshipsFromXml (xml: string, name: string): Relationship[] {
	const parsed = parseXml(xml, name)
	const relationships = parsed.Relationships
	assert.ok(isXmlObject(relationships), `missing Relationships root in ${name}`)

	return asXmlObjects(relationships.Relationship).map(entry => {
		const id = entry['@_Id']
		const target = entry['@_Target']
		const type = entry['@_Type']
		const targetMode = entry['@_TargetMode']
		assert.equal(typeof id, 'string', `relationship without Id in ${name}`)
		assert.equal(typeof target, 'string', `relationship without Target in ${name}`)
		assert.ok(type === undefined || typeof type === 'string', `invalid Type in ${name}`)
		assert.ok(targetMode === undefined || typeof targetMode === 'string', `invalid TargetMode in ${name}`)
		return { id, target, type: typeof type === 'string' ? type : undefined, targetMode }
	})
}

function collectRelationshipIds (value: unknown, ids: Set<string>): void {
	if (Array.isArray(value)) {
		value.forEach(item => collectRelationshipIds(item, ids))
		return
	}
	if (!isXmlObject(value)) return

	for (const [key, child] of Object.entries(value)) {
		if ((key === '@_r:id' || key === '@_r:embed' || key === '@_r:link') && typeof child === 'string' && child) {
			ids.add(child)
		} else {
			collectRelationshipIds(child, ids)
		}
	}
}

async function assertOoxmlPackageContracts (zip: JSZip, requiredParts: string[]): Promise<void> {
	for (const name of requiredParts) assert.ok(zip.file(name), `missing required package part: ${name}`)

	const packageParts = new Set(Object.keys(zip.files).filter(name => !name.endsWith('/')))
	for (const name of packageParts) {
		if (!name.endsWith('.xml') && !name.endsWith('.rels')) continue
		const xml = await readPart(zip, name)
		assert.equal(XMLValidator.validate(xml), true, `malformed XML in ${name}`)
	}

	await assertContentTypes(zip, packageParts)

	const relationshipIdsBySource = new Map<string, Set<string>>()
	for (const name of packageParts) {
		if (!name.endsWith('.rels')) continue
		const sourcePart = sourcePartForRelationships(name)
		if (sourcePart) assert.ok(packageParts.has(sourcePart), `relationship source is missing: ${sourcePart}`)

		const ids = new Set<string>()
		for (const relationship of relationshipsFromXml(await readPart(zip, name), name)) {
			assert.ok(!ids.has(relationship.id), `duplicate relationship Id ${relationship.id} in ${name}`)
			ids.add(relationship.id)
			if (relationship.targetMode === 'External') continue

			const targetPart = resolveTarget(sourcePart, relationship.target)
			assert.ok(packageParts.has(targetPart), `relationship target is missing: ${name} -> ${targetPart}`)
		}
		if (sourcePart) relationshipIdsBySource.set(sourcePart, ids)
	}

	for (const [sourcePart, relationshipIds] of relationshipIdsBySource) {
		const references = new Set<string>()
		collectRelationshipIds(parseXml(await readPart(zip, sourcePart), sourcePart), references)
		for (const id of references) {
			assert.ok(relationshipIds.has(id), `missing ${id} relationship for ${sourcePart}`)
		}
	}
}

async function assertPresentationSlideList (zip: JSZip): Promise<void> {
	const contentTypes = parseXml(await readPart(zip, '[Content_Types].xml'), '[Content_Types].xml')
	const types = contentTypes.Types
	assert.ok(isXmlObject(types), 'missing Types root in [Content_Types].xml')

	const slideOverrides = new Set<string>()
	for (const entry of asXmlObjects(types.Override)) {
		if (entry['@_ContentType'] !== SLIDE_CONTENT_TYPE) continue
		const partName = entry['@_PartName']
		assert.equal(typeof partName, 'string', 'slide Override without PartName')
		slideOverrides.add(partName.replace(/^\//, ''))
	}

	const slideParts = Object.keys(zip.files)
		.filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
		.sort((a, b) => {
			const n1 = Number(/slide(\d+)\.xml/.exec(a)?.[1] || 0)
			const n2 = Number(/slide(\d+)\.xml/.exec(b)?.[1] || 0)
			return n1 - n2
		})
	for (const partName of slideParts) {
		assert.ok(
			slideOverrides.has(partName),
			`ECMA-376 §13.3.8: ${partName} must Override as ${SLIDE_CONTENT_TYPE}`
		)
	}

	const presentation = parseXml(await readPart(zip, 'ppt/presentation.xml'), 'ppt/presentation.xml')
	const presentationRoot = presentation['p:presentation']
	assert.ok(isXmlObject(presentationRoot), 'missing p:presentation')
	const sldIdLst = presentationRoot['p:sldIdLst']
	const sldIds = isXmlObject(sldIdLst) ? asXmlObjects(sldIdLst['p:sldId']) : []
	assert.equal(sldIds.length, slideParts.length, 'p:sldIdLst count must match slide parts')

	const rels = relationshipsFromXml(await readPart(zip, 'ppt/_rels/presentation.xml.rels'), 'ppt/_rels/presentation.xml.rels')
	const relById = new Map(rels.map(rel => [rel.id, rel]))
	const orderedTargets: string[] = []
	for (const sldId of sldIds) {
		const rid = sldId['@_r:id']
		assert.equal(typeof rid, 'string', 'p:sldId missing r:id (ECMA-376 §4.3.1.29)')
		if (typeof rid !== 'string') continue
		const rel = relById.get(rid)
		assert.ok(rel, `p:sldId r:id ${rid} has no presentation relationship`)
		if (!rel) continue
		assert.ok(
			typeof rel.type === 'string' && rel.type.endsWith(SLIDE_RELATIONSHIP_SUFFIX),
			`relationship ${rid} must be a slide relationship, got ${rel.type ?? '(none)'}`
		)
		assert.notEqual(rel.targetMode, 'External', `slide relationship ${rid} must be Internal (ECMA-376 §13.3.8)`)
		const target = resolveTarget('ppt/presentation.xml', rel.target)
		assert.ok(zip.file(target), `slide relationship ${rid} target missing: ${target}`)
		orderedTargets.push(target)
	}

	assert.deepEqual(orderedTargets, slideParts, 'generated p:sldIdLst order must match slide1..N parts')
}

function rootElement (parsed: XmlObject): { name: string, node: XmlObject } | undefined {
	for (const [key, value] of Object.entries(parsed)) {
		if (key.startsWith('?xml') || key.startsWith('?')) continue
		if (isXmlObject(value)) return { name: key, node: value }
	}
	return undefined
}

function contentTypeOverrides (types: XmlObject): Array<{ partName: string, contentType: string }> {
	return asXmlObjects(types.Override).flatMap(entry => {
		const partName = entry['@_PartName']
		const contentType = entry['@_ContentType']
		if (typeof partName !== 'string' || typeof contentType !== 'string') return []
		return [{ partName: partName.replace(/^\//, ''), contentType }]
	})
}

function isInternalTarget (targetMode: string | undefined): boolean {
	return targetMode === undefined || targetMode === 'Internal'
}

/**
 * MS-PPTX §2.1.5–2.1.6: modern comment / author part content types and relationship constraints.
 * No-op when the package has neither authors nor comment parts.
 */
export async function assertModernCommentPartContracts (zip: JSZip): Promise<void> {
	const packageParts = new Set(Object.keys(zip.files).filter(name => !name.endsWith('/')))
	const authorParts = [...packageParts].filter(name => name === 'ppt/authors.xml')
	const commentParts = [...packageParts].filter(name => /^ppt\/comments\/commentSlide\d+\.xml$/.test(name))
	if (authorParts.length === 0 && commentParts.length === 0) return

	assert.ok(authorParts.length <= 1, 'MS-PPTX §2.1.6: package MUST contain zero or one Author part')
	assert.ok(!packageParts.has('ppt/authors.xml.rels'), 'MS-PPTX §2.1.6: Author part MUST NOT have relationships to other parts')

	const contentTypes = parseXml(await readPart(zip, '[Content_Types].xml'), '[Content_Types].xml')
	const types = contentTypes.Types
	assert.ok(isXmlObject(types), 'missing Types root in [Content_Types].xml')
	const overrides = contentTypeOverrides(types)
	const overrideByPart = new Map(overrides.map(entry => [entry.partName, entry.contentType]))

	if (authorParts.length === 1) {
		assert.equal(overrideByPart.get('ppt/authors.xml'), AUTHOR_PART_CONTENT_TYPE, 'MS-PPTX §2.1.6: Author part content type')
		const authorsXml = await readPart(zip, 'ppt/authors.xml')
		const authorsRoot = rootElement(parseXml(authorsXml, 'ppt/authors.xml'))
		assert.ok(authorsRoot, 'authors.xml missing root')
		assert.match(authorsRoot!.name, /(?:^|:)authorLst$/, 'MS-PPTX §2.1.6: Author part root MUST be authorLst')
		const ns = authorsRoot!.node['@_xmlns:p188'] ?? authorsRoot!.node['@_xmlns']
		assert.equal(ns, P188_NS, 'MS-PPTX §2.1.6: Author part root namespace')
	}

	for (const commentPart of commentParts) {
		assert.equal(overrideByPart.get(commentPart), COMMENT_PART_CONTENT_TYPE, `MS-PPTX §2.1.5: Comment part content type for ${commentPart}`)
		const commentXml = await readPart(zip, commentPart)
		const commentRoot = rootElement(parseXml(commentXml, commentPart))
		assert.ok(commentRoot, `${commentPart} missing root`)
		assert.match(commentRoot!.name, /(?:^|:)cmLst$/, `MS-PPTX §2.1.5: Comment part root MUST be cmLst (${commentPart})`)
		const ns = commentRoot!.node['@_xmlns:p188'] ?? commentRoot!.node['@_xmlns']
		assert.equal(ns, P188_NS, `MS-PPTX §2.1.5: Comment part root namespace (${commentPart})`)
	}

	const presentationRels = relationshipsFromXml(await readPart(zip, 'ppt/_rels/presentation.xml.rels'), 'ppt/_rels/presentation.xml.rels')
	const authorRels = presentationRels.filter(rel => rel.type === AUTHOR_REL_TYPE)
	const commentRelsFromPres = presentationRels.filter(rel => rel.type === COMMENT_REL_TYPE)
	assert.equal(commentRelsFromPres.length, 0, 'MS-PPTX §2.1.5: Comment part MUST be related from the Slide part, not Presentation')

	if (authorParts.length === 1) {
		assert.equal(authorRels.length, 1, 'MS-PPTX §2.1.6: Author part MUST be the target of an implicit relationship from the Presentation part')
		assert.ok(isInternalTarget(authorRels[0].targetMode), 'MS-PPTX §2.1.6: Author relationship TargetMode MUST be Internal')
		assert.equal(resolveTarget('ppt/presentation.xml', authorRels[0].target), 'ppt/authors.xml', 'MS-PPTX §2.1.6: authors relationship target')
	} else {
		assert.equal(authorRels.length, 0, 'authors relationship without an Author part')
	}

	const commentTargetsFromSlides = new Set<string>()
	for (const name of packageParts) {
		if (!/^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/.test(name)) continue
		const sourcePart = sourcePartForRelationships(name)
		assert.ok(sourcePart, `could not resolve source for ${name}`)
		const rels = relationshipsFromXml(await readPart(zip, name), name)
		const authorFromSlide = rels.filter(rel => rel.type === AUTHOR_REL_TYPE)
		assert.equal(authorFromSlide.length, 0, `MS-PPTX §2.1.6: Author part is related from Presentation, not ${name}`)
		for (const rel of rels.filter(rel => rel.type === COMMENT_REL_TYPE)) {
			assert.ok(isInternalTarget(rel.targetMode), `MS-PPTX §2.1.5: Comment relationship TargetMode MUST be Internal (${name})`)
			const target = resolveTarget(sourcePart, rel.target)
			assert.ok(commentParts.includes(target), `MS-PPTX §2.1.5: comments relationship target missing: ${name} -> ${target}`)
			commentTargetsFromSlides.add(target)
		}
	}

	for (const commentPart of commentParts) {
		assert.ok(commentTargetsFromSlides.has(commentPart), `MS-PPTX §2.1.5: ${commentPart} MUST be the target of an explicit relationship from a Slide part`)
	}
}

export async function assertPptxPackageContracts (zip: JSZip): Promise<void> {
	await assertOoxmlPackageContracts(zip, REQUIRED_PPTX_PARTS)
	await assertPresentationSlideList(zip)
	await assertModernCommentPartContracts(zip)
}

export async function assertXlsxPackageContracts (zip: JSZip): Promise<void> {
	await assertOoxmlPackageContracts(zip, REQUIRED_XLSX_PARTS)
}

/** Validate every chart workbook embedded in a generated presentation. */
export async function assertEmbeddedXlsxContracts (pptxZip: JSZip): Promise<void> {
	for (const name of Object.keys(pptxZip.files).filter(name => /^ppt\/embeddings\/.*\.xlsx$/.test(name))) {
		const part = pptxZip.file(name)
		assert.ok(part, `missing embedded workbook part: ${name}`)
		await assertXlsxPackageContracts(await JSZip.loadAsync(await part.async('nodebuffer')))
	}
}
