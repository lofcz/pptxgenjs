/**
 * Modern threaded comments (MS-PPTX §2.16).
 *
 * Two part families:
 *  - `ppt/authors.xml`  (`authorLst` / `CT_AuthorList`) — implicit rel from presentation (§2.1.6).
 *  - `ppt/comments/commentSlide<N>.xml` (`cmLst` / `CT_CommentList`) — explicit rel from each slide (§2.1.5).
 *
 * Each `cm` anchors to its slide via `pc:sldMkLst` (a document + slide moniker chain, §2.12) and
 * carries the comment text in a DrawingML `a:txBody`. Replies nest under `replyLst` (§2.16.3.7).
 */
import { encodeXmlEntities, getUuid } from './gen-utils'
import type { CommentAuthorProps, PresSlide } from './core-interfaces'

const P188_NS = 'http://schemas.microsoft.com/office/powerpoint/2018/8/main'
const PC_NS = 'http://schemas.microsoft.com/office/powerpoint/2013/main/command'

/** Resolve a slide's comments' author references into a deduped author table (index-addressable). */
export function collectCommentAuthors (slides: PresSlide[], declared: CommentAuthorProps[] | undefined): CommentAuthorProps[] {
	const authors: CommentAuthorProps[] = (declared ?? []).map(a => ({ ...a, id: a.id ?? getUuid('{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}'), userId: a.userId ?? a.id ?? '', providerId: a.providerId ?? 'None' }))
	const byName = new Map<string, number>()
	authors.forEach((a, i) => byName.set(a.name.toLowerCase(), i))

	slides.forEach(slide => {
		;(slide.comments ?? []).forEach(cm => {
			;[cm, ...(cm.replies ?? [])].forEach(c => {
				if (typeof c.author === 'string' && !byName.has(c.author.toLowerCase())) {
					const id = getUuid('{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}')
					byName.set(c.author.toLowerCase(), authors.length)
					authors.push({ name: c.author, id, userId: id, providerId: 'None' })
				}
			})
		})
	})
	return authors
}

/** Resolve an author ref (index or name) to a GUID authorId. */
function authorId (ref: number | string | undefined, authors: CommentAuthorProps[]): string {
	if (typeof ref === 'number') return authors[ref]?.id ?? authors[0]?.id ?? ''
	if (typeof ref === 'string') {
		const a = authors.find(x => x.name.toLowerCase() === ref.toLowerCase())
		return a?.id ?? authors[0]?.id ?? ''
	}
	return authors[0]?.id ?? ''
}

function txBody (text: string): string {
	return `<p188:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" dirty="0"/><a:t>${encodeXmlEntities(text)}</a:t></a:r></a:p></p188:txBody>`
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

	let xml =
		'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' +
		`<p188:cmLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:p188="${P188_NS}" xmlns:pc="${PC_NS}">`

	comments.forEach(cm => {
		const id = getUuid('{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}')
		const date = cm.startDate ?? new Date().toISOString()
		const pos = cm.x !== undefined || cm.y !== undefined ? `<p188:pos x="${Math.round((cm.x ?? 0) * 914400)}" y="${Math.round((cm.y ?? 0) * 914400)}"/>` : ''

		let replies = ''
		if (cm.replies && cm.replies.length > 0) {
			replies = '<p188:replyLst>'
			cm.replies.forEach(r => {
				replies += `<p188:reply id="${getUuid('{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}')}" authorId="${authorId(r.author, authors)}" created="${date}">${txBody(r.text)}</p188:reply>`
			})
			replies += '</p188:replyLst>'
		}

		xml +=
			`<p188:cm id="${id}" authorId="${authorId(cm.author, authors)}" startDate="${date}">` +
			// EG_CommentAnchor: slide moniker chain = document moniker + slide moniker (§2.12.3.20/21).
			`<pc:sldMkLst><pc:docMkLst><pc:docMk/></pc:docMkLst><pc:sldMk sldId="${sldId}"/></pc:sldMkLst>` +
			pos +
			replies +
			txBody(cm.text) +
			'</p188:cm>'
	})

	return xml + '</p188:cmLst>'
}
