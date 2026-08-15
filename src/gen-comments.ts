/**
 * Modern threaded comments (MS-PPTX §2.16) plus collaboration extensions
 * (§2.19 cmChg, §2.20 taskDetails, §2.21 reactions).
 *
 * Two part families:
 *  - `ppt/authors.xml`  (`authorLst` / `CT_AuthorList`) — implicit rel from presentation (§2.1.6).
 *  - `ppt/comments/commentSlide<N>.xml` (`cmLst` / `CT_CommentList`) — explicit rel from each slide (§2.1.5).
 *
 * Each `cm` anchors to its slide via `pc:sldMkLst` (a document + slide moniker chain, §2.12) and
 * carries the comment text in a DrawingML `a:txBody`. Replies nest under `replyLst` (§2.16.3.7).
 */
import { encodeXmlEntities, getUuid } from './gen-utils'
import type {
	CommentAuthorProps,
	CommentAuthorRef,
	CommentChangeBit,
	CommentChangeProps,
	CommentProps,
	CommentReactionProps,
	CommentReplyChangeBit,
	CommentReplyProps,
	CommentTaskEventProps,
	PresSlide,
} from './core-interfaces'

export const P188_NS = 'http://schemas.microsoft.com/office/powerpoint/2018/8/main'
export const PC_NS = 'http://schemas.microsoft.com/office/powerpoint/2013/main/command'
export const P223_NS = 'http://schemas.microsoft.com/office/powerpoint/2022/03/main'
export const P228_NS = 'http://schemas.microsoft.com/office/powerpoint/2022/08/main'
export const PC2_NS = 'http://schemas.microsoft.com/office/powerpoint/2019/9/main/command'
export const PC226_NS = 'http://schemas.microsoft.com/office/powerpoint/2022/06/main/command'

export const COMMENT_PART_CONTENT_TYPE = 'application/vnd.ms-powerpoint.comments+xml'
export const AUTHOR_PART_CONTENT_TYPE = 'application/vnd.ms-powerpoint.authors+xml'
export const COMMENT_REL_TYPE = 'http://schemas.microsoft.com/office/2018/10/relationships/comments'
export const AUTHOR_REL_TYPE = 'http://schemas.microsoft.com/office/2018/10/relationships/authors'
/** Slide `extLst` URI for `commentRel` (MS-PPTX §2.2.10). */
export const COMMENT_REL_URI = '{6950BFC3-D8DA-4A85-94F7-54DA5524770B}'
/** Comment `extLst` URI for `taskDetails` (Office-observed; Open XML SDK #1751). */
export const TASK_DETAILS_EXT_URI = '{5BB2D875-25FF-4072-B9AC-8F64D62656EB}'
/** Comment `extLst` URI for `reactions` (p223 parent is `p188:ext` / `p:ext`). */
export const REACTIONS_EXT_URI = '{C6F1C903-AEFE-4B07-9C12-28C0410C1C80}'
/** Comment `extLst` URI for `cmChg` (MS-PPTX §2.19). */
export const COMMENT_CHANGE_EXT_URI = '{8F3C1A62-9B14-4E7A-A6D0-2C5E91B4F8D3}'

const GUID_FMT = '{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}'

function newGuid (): string {
	return getUuid(GUID_FMT)
}

function asAuthorRefs (ref: CommentAuthorRef | CommentAuthorRef[] | undefined): CommentAuthorRef[] {
	if (ref === undefined) return []
	return Array.isArray(ref) ? ref : [ref]
}

function eachCommentNode (slides: PresSlide[], visit: (node: CommentProps | CommentReplyProps, parent?: CommentProps) => void): void {
	slides.forEach(slide => {
		;(slide.comments ?? []).forEach(cm => {
			visit(cm)
			;(cm.replies ?? []).forEach(reply => visit(reply, cm))
		})
	})
}

function eachAuthorRefOnNode (node: CommentProps | CommentReplyProps, visit: (ref: CommentAuthorRef) => void): void {
	if (node.author !== undefined) visit(node.author)
	;(node.reactions ?? []).forEach(rxn => {
		;(rxn.authors ?? []).forEach(visit)
		;(rxn.instances ?? []).forEach(inst => { if (inst.author !== undefined) visit(inst.author) })
	})
	if ('assignedTo' in node) asAuthorRefs(node.assignedTo).forEach(visit)
	if ('task' in node) {
		;(node.task?.history ?? []).forEach(ev => {
			if (ev.author !== undefined) visit(ev.author)
			if (ev.assignTo !== undefined) visit(ev.assignTo)
		})
	}
}

/** Resolve a slide's comments' author references into a deduped author table (index-addressable). */
export function collectCommentAuthors (slides: PresSlide[], declared: CommentAuthorProps[] | undefined): CommentAuthorProps[] {
	const authors: CommentAuthorProps[] = (declared ?? []).map(a => ({ ...a, id: a.id ?? newGuid(), userId: a.userId ?? a.id ?? '', providerId: a.providerId ?? 'None' }))
	const byName = new Map<string, number>()
	const byId = new Map<string, number>()
	authors.forEach((a, i) => {
		byName.set(a.name.toLowerCase(), i)
		if (a.id) byId.set(a.id, i)
	})

	const ensure = (ref: CommentAuthorRef): void => {
		if (typeof ref === 'number') return
		if (byId.has(ref) || byName.has(ref.toLowerCase())) return
		const id = newGuid()
		byName.set(ref.toLowerCase(), authors.length)
		byId.set(id, authors.length)
		authors.push({ name: ref, id, userId: id, providerId: 'None' })
	}

	eachCommentNode(slides, node => eachAuthorRefOnNode(node, ensure))
	authors.forEach(a => { if (!a.userId) a.userId = a.id ?? '' })
	return authors
}

/** Resolve an author ref (index, name, or GUID) to a GUID authorId. */
function authorId (ref: CommentAuthorRef | undefined, authors: CommentAuthorProps[]): string {
	if (typeof ref === 'number') return authors[ref]?.id ?? authors[0]?.id ?? ''
	if (typeof ref === 'string') {
		const byGuid = authors.find(x => x.id === ref)
		if (byGuid?.id) return byGuid.id
		const byName = authors.find(x => x.name.toLowerCase() === ref.toLowerCase())
		return byName?.id ?? authors[0]?.id ?? ''
	}
	return authors[0]?.id ?? ''
}

function assignedToAttr (ref: CommentAuthorRef | CommentAuthorRef[] | undefined, authors: CommentAuthorProps[]): string {
	const ids = asAuthorRefs(ref).map(r => authorId(r, authors)).filter(Boolean)
	return ids.length ? ` assignedTo="${ids.join(' ')}"` : ''
}

function percentValue (val: number | string | undefined): string | undefined {
	if (val === undefined) return undefined
	if (typeof val === 'number') return `${val}%`
	return val.includes('%') ? val : `${val}%`
}

function txBody (text: string): string {
	return `<p188:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" dirty="0"/><a:t>${encodeXmlEntities(text)}</a:t></a:r></a:p></p188:txBody>`
}

function reactionInstances (rxn: CommentReactionProps): Array<{ author?: CommentAuthorRef, time?: string }> {
	if (rxn.instances && rxn.instances.length > 0) return rxn.instances
	return (rxn.authors ?? []).map(author => ({ author, time: rxn.time }))
}

function reactionsXml (reactions: CommentReactionProps[] | undefined, authors: CommentAuthorProps[], now: string): string {
	if (!reactions || reactions.length === 0) return ''
	const rxns = reactions.map(rxn => {
		const instances = reactionInstances(rxn).map(inst =>
			`<p223:instance time="${encodeXmlEntities(inst.time ?? rxn.time ?? now)}" authorId="${authorId(inst.author, authors)}"/>`
		).join('')
		return `<p223:rxn type="${encodeXmlEntities(rxn.type)}">${instances}</p223:rxn>`
	}).join('')
	return `<p:ext uri="${REACTIONS_EXT_URI}"><p223:reactions xmlns:p223="${P223_NS}">${rxns}</p223:reactions></p:ext>`
}

function taskEventXml (ev: CommentTaskEventProps, commentId: string, authors: CommentAuthorProps[], now: string): string {
	const time = ev.time ?? now
	const id = ev.id ?? newGuid()
	const atrbtn = `<p228:atrbtn authorId="${authorId(ev.author, authors)}"/>`
	const anchr = `<p228:anchr><p228:comment id="${commentId}"/></p228:anchr>`
	let body = ''
	switch (ev.kind) {
		case 'add': body = '<p228:add/>'; break
		case 'asgn': body = `<p228:asgn authorId="${authorId(ev.assignTo, authors)}"/>`; break
		case 'title': body = `<p228:title val="${encodeXmlEntities(ev.title ?? '')}"/>`; break
		case 'date': {
			const st = ev.startDate ? ` stDt="${encodeXmlEntities(ev.startDate)}"` : ''
			const end = ev.endDate ? ` endDt="${encodeXmlEntities(ev.endDate)}"` : ''
			body = `<p228:date${st}${end}/>`
			break
		}
		case 'pcntCmplt': body = `<p228:pcntCmplt val="${encodeXmlEntities(percentValue(ev.complete) ?? '0%')}"/>`; break
		case 'unasgnAll': body = '<p228:unasgnAll/>'; break
		case 'undo': body = `<p228:undo id="${encodeXmlEntities(ev.undoId ?? '')}"/>`; break
		case 'unknown': body = '<p228:unknown/>'; break
	}
	return `<p228:event time="${encodeXmlEntities(time)}" id="${id}">${atrbtn}${anchr}${body}</p228:event>`
}

function taskDetailsXml (task: CommentProps['task'], commentId: string, authors: CommentAuthorProps[], now: string): string {
	if (!task || task.history.length === 0) return ''
	const events = task.history.map(ev => taskEventXml(ev, commentId, authors, now)).join('')
	return `<p:ext uri="${TASK_DETAILS_EXT_URI}"><p228:taskDetails xmlns:p228="${P228_NS}"><p228:history>${events}</p228:history></p228:taskDetails></p:ext>`
}

function changeBits (chg: CommentChangeBit | CommentChangeBit[] | CommentReplyChangeBit | CommentReplyChangeBit[]): string {
	return (Array.isArray(chg) ? chg : [chg]).join(' ')
}

function commentChangesXml (changes: CommentChangeProps[] | undefined, commentId: string, replyIds: string[]): string {
	if (!changes || changes.length === 0) return ''
	const records = changes.map(chg => {
		const replyChgs = (chg.replies ?? []).map((rChg, rIdx) => {
			const replyId = rChg.replyId ?? replyIds[rIdx] ?? replyIds[0] ?? commentId
			return `<pc226:cmRplyChg chg="${changeBits(rChg.chg)}"><pc2:cmRplyMkLst xmlns:pc2="${PC2_NS}"><pc2:cmRplyMk id="${replyId}"/></pc2:cmRplyMkLst></pc226:cmRplyChg>`
		}).join('')
		return `<pc226:cmChg xmlns:pc226="${PC226_NS}" chg="${changeBits(chg.chg)}"><pc2:cmMkLst xmlns:pc2="${PC2_NS}"><pc2:cmMk id="${commentId}"/></pc2:cmMkLst>${replyChgs}</pc226:cmChg>`
	})
	return `<p:ext uri="${COMMENT_CHANGE_EXT_URI}">${records.join('')}</p:ext>`
}

function extLst (parts: string[]): string {
	const present = parts.filter(Boolean)
	return present.length > 0 ? `<p188:extLst>${present.join('')}</p188:extLst>` : ''
}

function replyXml (reply: CommentReplyProps, authors: CommentAuthorProps[], fallbackDate: string): { xml: string, id: string } {
	const id = reply.id ?? newGuid()
	const created = reply.created ?? fallbackDate
	const status = reply.status && reply.status !== 'active' ? ` status="${reply.status}"` : ''
	const xml =
		`<p188:reply id="${id}" authorId="${authorId(reply.author, authors)}" created="${encodeXmlEntities(created)}"${status}>` +
		txBody(reply.text) +
		extLst([reactionsXml(reply.reactions, authors, created)]) +
		'</p188:reply>'
	return { xml, id }
}

/** Generates `ppt/authors.xml` (`authorLst`). */
export function makeXmlCommentAuthors (authors: CommentAuthorProps[]): string {
	let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<p188:authorLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p188="${P188_NS}">`
	authors.forEach(a => {
		xml += `<p188:author id="${a.id}" name="${encodeXmlEntities(a.name)}"${a.initials ? ` initials="${encodeXmlEntities(a.initials)}"` : ''} userId="${a.userId}" providerId="${a.providerId}"/>`
	})
	return xml + '</p188:authorLst>'
}

/** Generates `ppt/comments/commentSlide<N>.xml` (`cmLst`) for one slide. */
export function makeXmlSlideComments (slide: PresSlide, authors: CommentAuthorProps[]): string {
	const comments = slide.comments ?? []
	const sldId = slide._slideId
	const now = new Date().toISOString()

	let xml =
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' +
		`<p188:cmLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:p188="${P188_NS}" xmlns:pc="${PC_NS}">`

	comments.forEach(cm => {
		const id = cm.id ?? newGuid()
		const created = cm.created ?? cm.startDate ?? now
		const pos = cm.x !== undefined || cm.y !== undefined ? `<p188:pos x="${Math.round((cm.x ?? 0) * 914400)}" y="${Math.round((cm.y ?? 0) * 914400)}"/>` : ''
		const status = cm.status && cm.status !== 'active' ? ` status="${cm.status}"` : ''
		const startDate = cm.startDate ? ` startDate="${encodeXmlEntities(cm.startDate)}"` : ''
		const dueDate = cm.dueDate ? ` dueDate="${encodeXmlEntities(cm.dueDate)}"` : ''
		const complete = percentValue(cm.complete)
		const completeAttr = complete ? ` complete="${encodeXmlEntities(complete)}"` : ''
		const title = cm.title ? ` title="${encodeXmlEntities(cm.title)}"` : ''

		const replyIds: string[] = []
		let replies = ''
		if (cm.replies && cm.replies.length > 0) {
			replies = '<p188:replyLst>'
			cm.replies.forEach(r => {
				const rendered = replyXml(r, authors, created)
				replyIds.push(rendered.id)
				replies += rendered.xml
			})
			replies += '</p188:replyLst>'
		}

		xml +=
			`<p188:cm id="${id}" authorId="${authorId(cm.author, authors)}" created="${encodeXmlEntities(created)}"${status}${startDate}${dueDate}${assignedToAttr(cm.assignedTo, authors)}${completeAttr}${title}>` +
			// EG_CommentAnchor: slide moniker chain = document moniker + slide moniker (§2.12.3.20/21).
			`<pc:sldMkLst><pc:docMkLst><pc:docMk/></pc:docMkLst><pc:sldMk sldId="${sldId}"/></pc:sldMkLst>` +
			pos +
			replies +
			txBody(cm.text) +
			extLst([
				reactionsXml(cm.reactions, authors, created),
				taskDetailsXml(cm.task, id, authors, created),
				commentChangesXml(cm.changes, id, replyIds),
			]) +
			'</p188:cm>'
	})

	return xml + '</p188:cmLst>'
}
