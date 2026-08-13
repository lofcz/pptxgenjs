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
	targetMode?: string
}

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
		const targetMode = entry['@_TargetMode']
		assert.equal(typeof id, 'string', `relationship without Id in ${name}`)
		assert.equal(typeof target, 'string', `relationship without Target in ${name}`)
		assert.ok(targetMode === undefined || typeof targetMode === 'string', `invalid TargetMode in ${name}`)
		return { id, target, targetMode }
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

export async function assertPptxPackageContracts (zip: JSZip): Promise<void> {
	await assertOoxmlPackageContracts(zip, REQUIRED_PPTX_PARTS)
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
