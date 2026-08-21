/**
 * MS-PPTX revision + change-tracking parts (§2.1.2 / §2.1.4) and identifiers (§2.2.9).
 *
 * Opt-in only: nothing is written unless the caller sets `pptx.revisionInfo` / `pptx.changesInfo`
 * or a slide/shape `creationId` / `modId`.
 */
import { encodeXmlEntities } from './gen-utils'
import type { ChangesInfoProps, RevisionInfoProps } from './core-interfaces'

export const REVISION_INFO_PART = 'ppt/revisionInfo.xml'
export const CHANGES_INFO_PART = 'ppt/changesInfo.xml'
export const REVISION_INFO_CONTENT_TYPE = 'application/vnd.ms-powerpoint.revisioninfo+xml'
export const CHANGES_INFO_CONTENT_TYPE = 'application/vnd.ms-powerpoint.changesinfo+xml'
export const REVISION_INFO_REL_TYPE = 'http://schemas.microsoft.com/office/2015/10/relationships/revisionInfo'
export const CHANGES_INFO_REL_TYPE = 'http://schemas.microsoft.com/office/2016/11/relationships/changesInfo'
export const REVISION_INFO_NS = 'http://schemas.microsoft.com/office/powerpoint/2015/10/main'
export const CHANGES_INFO_NS = 'http://schemas.microsoft.com/office/powerpoint/2013/main/command'
export const P14_NS = 'http://schemas.microsoft.com/office/powerpoint/2010/main'
export const CREATION_ID_URI = '{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}'
export const MOD_ID_URI = '{D42A27DB-BD31-4B8C-83A1-F6EECF244321}'
/** Deterministic, unique-per-object `p14:modId` base (MS-PPTX §2.3.1.19). */
export const TABLE_MOD_ID_BASE = 1579011935
/** Deterministic `p14:creationId` base when `slide.creationId === true` (MS-PPTX §2.3.1.4). */
export const CREATION_ID_BASE = 2147483648

export type RevisionTrackingOpt = boolean | RevisionInfoProps | undefined
export type ChangesTrackingOpt = boolean | ChangesInfoProps | undefined

/** True when the caller opted into the Revision Information part. */
export function wantsRevisionInfo (value: RevisionTrackingOpt): value is true | RevisionInfoProps {
	return value === true || (typeof value === 'object' && value !== null)
}

/** True when the caller opted into the Changes Information part. */
export function wantsChangesInfo (value: ChangesTrackingOpt): value is true | ChangesInfoProps {
	return value === true || (typeof value === 'object' && value !== null)
}

function unsignedInt (value: number): number {
	return Math.round(value) >>> 0
}

/** `p14:creationId` / `p14:modId` `val` — xsd:unsignedInt. */
export function randomIdVal (value: number): string {
	return String(unsignedInt(value))
}

/**
 * Resolve `slide.creationId` to an unsigned 32-bit integer, or `undefined` when unset/invalid.
 * `true` assigns a reproducible id from the slide number so callers can opt in without picking one.
 */
export function resolveCreationId (creationId: number | true | undefined, slideNum?: number): number | undefined {
	if (creationId === true) return CREATION_ID_BASE + (slideNum ?? 0)
	if (typeof creationId !== 'number' || !Number.isFinite(creationId)) {
		if (creationId !== undefined) console.warn(`[pptxgenjs] creationId must be \`true\` or an unsigned 32-bit integer - "${String(creationId)}" ignored`)
		return undefined
	}
	if (creationId < 0 || creationId > 0xffffffff || Math.floor(creationId) !== creationId) {
		console.warn(`[pptxgenjs] creationId must be an integer between 0 and 4294967295 - "${String(creationId)}" ignored`)
		return undefined
	}
	return creationId
}

/** `p:ext` wrapper for `p14:creationId` on `cSld` (MS-PPTX §2.2.9 / §2.3.1.4). */
export function genXmlCreationIdExt (creationId?: number | true, slideNum?: number): string {
	const resolved = resolveCreationId(creationId, slideNum)
	if (resolved === undefined) return ''
	return `<p:extLst><p:ext uri="${CREATION_ID_URI}"><p14:creationId xmlns:p14="${P14_NS}" val="${randomIdVal(resolved)}"/></p:ext></p:extLst>`
}

/** `p:ext` wrapper for `p14:modId` on `nvPr` (MS-PPTX §2.2.9 / §2.3.1.19). */
export function genXmlModIdExt (modId?: number): string {
	if (typeof modId !== 'number' || !Number.isFinite(modId)) return ''
	return `<p:extLst><p:ext uri="${MOD_ID_URI}"><p14:modId xmlns:p14="${P14_NS}" val="${randomIdVal(modId)}"/></p:ext></p:extLst>`
}

/** Generates `ppt/revisionInfo.xml` (`revInfo` / `CT_RevisionInfo`). */
export function makeXmlRevisionInfo (info: true | RevisionInfoProps): string {
	const props = info === true ? {} : info
	const clients = props.clients ?? []
	let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<p1510:revInfo xmlns:p1510="${REVISION_INFO_NS}">`
	if (clients.length > 0) {
		xml += '<p1510:revLst>'
		for (const client of clients) {
			if (!client.id) continue
			const dt = client.dt ?? new Date().toISOString()
			const v = typeof client.v === 'number' ? ` v="${unsignedInt(client.v)}"` : ''
			const vWet = typeof client.vWet === 'number' ? ` vWet="${unsignedInt(client.vWet)}"` : ''
			xml += `<p1510:client id="${encodeXmlEntities(client.id)}"${v}${vWet} dt="${encodeXmlEntities(dt)}"/>`
		}
		xml += '</p1510:revLst>'
	}
	return xml + '</p1510:revInfo>'
}

/** Generates `ppt/changesInfo.xml` (`chgInfo` / `CT_ChangesInfo`). Empty root is schema-valid. */
export function makeXmlChangesInfo (): string {
	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<pc:chgInfo xmlns:pc="${CHANGES_INFO_NS}"/>`
}
