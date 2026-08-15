/**
 * MS-PPTX content-part / ink / Office App AlternateContent helpers.
 *
 * §2.2.3 contentPart → mc:Choice (p14) + Fallback `sp`
 * §2.2.3.1 ink → mc:Choice (p14 + inkAction) + Fallback `pic`
 * §2.2.13 Office App → mc:Choice (webextension + contentapp) + Fallback `pic`
 * Office App refs are MS-OWEXML `we:webextensionref` (CT_WebExtensionPartRef).
 */

import { encodeXmlEntities, getUuid } from '../gen-utils'
import type { OfficeAppProps, OfficeAppReference } from '../core-interfaces'
import { A14_NS, MC_NS, P14_NS } from './text'

export const INK_ACTION_NS = 'http://schemas.microsoft.com/office/powerpoint/2014/inkAction'
export const WE_NS = 'http://schemas.microsoft.com/office/webextensions/webextension/2010/11'
export const CONTENTAPP_NS = 'http://schemas.microsoft.com/office/powerpoint/2013/contentapp'

export const REL_TYPE_CUSTOM_XML = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml'
export const REL_TYPE_WEBEXTENSION = 'http://schemas.microsoft.com/office/2011/relationships/webextension'
export const CT_WEBEXTENSION = 'application/vnd.ms-office.webextension+xml'
export const CT_INKML = 'application/inkml+xml'

export type ContentPartKind = 'content' | 'ink'

export interface ContentPartXmlArgs {
	kind: ContentPartKind
	rId: number
	shapeId: number
	name: string
	altText: string
	x: number
	y: number
	cx: number
	cy: number
	locationAttr: string
	bwMode?: string
	coverRid?: number
}

export interface OfficeAppXmlArgs {
	rId: number
	shapeId: number
	name: string
	altText: string
	x: number
	y: number
	cx: number
	cy: number
	locationAttr: string
	coverRid: number
}

function xfrmInner (x: number, y: number, cx: number, cy: number): string {
	return `<a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/>`
}

function fallbackSp (args: ContentPartXmlArgs): string {
	const descr = encodeXmlEntities(args.altText)
	return (
		'<p:sp>' +
		'<p:nvSpPr>' +
		`<p:cNvPr id="${args.shapeId}" name="${args.name}" descr="${descr}"/>` +
		'<p:cNvSpPr/><p:nvPr/>' +
		'</p:nvSpPr>' +
		`<p:spPr><a:xfrm${args.locationAttr}>${xfrmInner(args.x, args.y, args.cx, args.cy)}</a:xfrm>` +
		'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>' +
		'<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr/></a:p></p:txBody>' +
		'</p:sp>'
	)
}

function fallbackPic (args: { shapeId: number, name: string, altText: string, x: number, y: number, cx: number, cy: number, locationAttr: string, coverRid: number }): string {
	const descr = encodeXmlEntities(args.altText)
	return (
		'<p:pic><p:nvPicPr>' +
		`<p:cNvPr id="${args.shapeId}" name="${args.name}" descr="${descr}"/>` +
		'<p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>' +
		`<p:blipFill><a:blip r:embed="rId${args.coverRid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>` +
		`<p:spPr><a:xfrm${args.locationAttr}>${xfrmInner(args.x, args.y, args.cx, args.cy)}</a:xfrm>` +
		'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>'
	)
}

function contentPartElement (args: ContentPartXmlArgs): string {
	const descr = encodeXmlEntities(args.altText)
	const bw = args.bwMode ? ` p14:bwMode="${encodeXmlEntities(args.bwMode)}"` : ''
	const inkPr = args.kind === 'ink'
		? `<p14:cNvContentPartPr><a14:cpLocks xmlns:a14="${A14_NS}" noChangeAspect="1"/></p14:cNvContentPartPr>`
		: ''
	return (
		`<p:contentPart r:id="rId${args.rId}"${bw}>` +
		'<p14:nvContentPartPr>' +
		`<p14:cNvPr id="${args.shapeId}" name="${args.name}" descr="${descr}"/>` +
		inkPr +
		'<p14:nvPr/>' +
		'</p14:nvContentPartPr>' +
		`<p14:xfrm${args.locationAttr}>${xfrmInner(args.x, args.y, args.cx, args.cy)}</p14:xfrm>` +
		'</p:contentPart>'
	)
}

/** MS-PPTX §2.2.3 / §2.2.3.1: contentPart or ink AlternateContent. */
export function genXmlContentPartAlternate (args: ContentPartXmlArgs): string {
	const requires = args.kind === 'ink' ? 'p14 pInk' : 'p14'
	const inkNs = args.kind === 'ink' ? ` xmlns:pInk="${INK_ACTION_NS}"` : ''
	const fallback = args.kind === 'ink'
		? fallbackPic({ ...args, coverRid: args.coverRid ?? 0 })
		: fallbackSp(args)
	return (
		`<mc:AlternateContent xmlns:mc="${MC_NS}">` +
		`<mc:Choice Requires="${requires}" xmlns:p14="${P14_NS}"${inkNs}>` +
		contentPartElement(args) +
		'</mc:Choice>' +
		`<mc:Fallback>${fallback}</mc:Fallback>` +
		'</mc:AlternateContent>'
	)
}

/** MS-PPTX §2.2.13 + MS-OWEXML §2.1.3: webextensionref AlternateContent. */
export function genXmlOfficeAppAlternate (args: OfficeAppXmlArgs): string {
	return (
		`<mc:AlternateContent xmlns:mc="${MC_NS}">` +
		`<mc:Choice Requires="we cap" xmlns:we="${WE_NS}" xmlns:cap="${CONTENTAPP_NS}">` +
		`<we:webextensionref r:id="rId${args.rId}"/>` +
		'</mc:Choice>' +
		`<mc:Fallback>${fallbackPic(args)}</mc:Fallback>` +
		'</mc:AlternateContent>'
	)
}

function propertyEntries (properties?: OfficeAppProps['properties']): Array<{ name: string, value: string }> {
	if (!properties) return []
	if (Array.isArray(properties)) return properties
	return Object.entries(properties).map(([name, value]) => ({ name, value }))
}

/** MS-OWEXML CT_OsfWebExtension part (`ppt/webextensions/webextension*.xml`). */
export function makeXmlWebExtension (opt: {
	id?: string
	reference: OfficeAppReference
	properties?: OfficeAppProps['properties']
	frozen?: boolean
}): string {
	const id = opt.id || getUuid('{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}')
	const version = opt.reference.version || '1.0.0.0'
	const store = opt.reference.store ? ` store="${encodeXmlEntities(opt.reference.store)}"` : ''
	const storeType = opt.reference.storeType ? ` storeType="${encodeXmlEntities(opt.reference.storeType)}"` : ''
	const frozen = opt.frozen ? ' frozen="true"' : ''
	const props = propertyEntries(opt.properties)
		.map(p => `<we:property name="${encodeXmlEntities(p.name)}" value="${encodeXmlEntities(p.value)}"/>`)
		.join('')
	return (
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
		`<we:webextension xmlns:we="${WE_NS}" id="${encodeXmlEntities(id)}"${frozen}>` +
		`<we:reference id="${encodeXmlEntities(opt.reference.id)}" version="${encodeXmlEntities(version)}"${store}${storeType}/>` +
		`<we:properties>${props}</we:properties>` +
		'<we:bindings/>' +
		'</we:webextension>'
	)
}

/** Resolve a slide-rel Target (`../foo/bar.xml`) to a package path (`ppt/foo/bar.xml`). */
export function extPartPackagePath (target: string): string {
	return target.replace(/^\.\.\//, 'ppt/')
}
