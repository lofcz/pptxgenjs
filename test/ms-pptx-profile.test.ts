/**
 * Conformance-profile registry checks for MS-PPTX 25.0 (#86).
 * Does not emit extensions; asserts the tracker catalog is complete and well-formed.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
	MS_PPTX_CHILD_ISSUES,
	MS_PPTX_DATE,
	MS_PPTX_EXTENSIONS,
	MS_PPTX_SCHEMAS,
	MS_PPTX_VERSION,
	extensionsByStatus,
	extensionsForIssue,
	getExtension,
	type MarkupCompatibilityWrapper,
} from '../src/ms-pptx-profile'

const WRAPPERS = new Set<MarkupCompatibilityWrapper>(['mc:Ignorable', 'mc:AlternateContent', 'extLst'])

test('#86: profile version is MS-PPTX 25.0 / 2024-08-20', () => {
	assert.equal(MS_PPTX_VERSION, '25.0')
	assert.equal(MS_PPTX_DATE, '2024-08-20')
	assert.equal(MS_PPTX_EXTENSIONS.length, 42)
	assert.equal(MS_PPTX_SCHEMAS.length, 20)
})

test('#86: every catalog row has required fields and a unique id', () => {
	const ids = new Set<string>()
	for (const ext of MS_PPTX_EXTENSIONS) {
		assert.ok(ext.id, 'missing id')
		assert.ok(!ids.has(ext.id), `duplicate id: ${ext.id}`)
		ids.add(ext.id)
		assert.ok(ext.title && ext.spec && ext.namespace && ext.host && ext.part, `${ext.id}: incomplete identity`)
		assert.ok(WRAPPERS.has(ext.wrapper), `${ext.id}: wrapper must be mc:Ignorable | mc:AlternateContent | extLst`)
		assert.ok(ext.api && ext.packageContract && ext.officeFixture && ext.schema, `${ext.id}: missing API/contract/fixture/schema`)
		if (ext.wrapper === 'mc:AlternateContent') {
			assert.ok(ext.fallback, `${ext.id}: AlternateContent requires a Fallback`)
			assert.ok(ext.choiceRequires, `${ext.id}: AlternateContent requires Choice/@Requires`)
		}
	}
})

test('#86: child issues #87–#93 each have at least one catalog row', () => {
	assert.deepEqual([...MS_PPTX_CHILD_ISSUES], [87, 88, 89, 90, 91, 92, 93])
	for (const issue of MS_PPTX_CHILD_ISSUES) {
		const rows = extensionsForIssue(issue)
		assert.ok(rows.length > 0, `issue #${issue} has no catalog rows`)
	}
})

test('#86: mandated AlternateContent fallbacks match the spec', () => {
	assert.equal(getExtension('content-part')?.fallback, 'p:sp')
	assert.equal(getExtension('ink')?.fallback, 'p:pic')
	assert.equal(getExtension('office-app')?.fallback, 'p:pic')
	assert.equal(getExtension('zoom-slide')?.fallback, 'p:pic')
	assert.equal(getExtension('zoom-section')?.fallback, 'p:pic')
	assert.equal(getExtension('zoom-summary')?.fallback, 'p:grpSp')
})

test('#86: chart-tracking and classification stay opt-in planned rows', () => {
	const chart = getExtension('chart-tracking')
	assert.equal(chart?.issue, 93)
	assert.equal(chart?.status, 'planned')
	assert.equal(chart?.extUri, '{FD5EFAAD-0ECE-453E-9831-46B23BE46B34}')
	assert.match(chart?.packageContract ?? '', /unset MUST NOT change chart XML/i)

	const classification = getExtension('classification')
	assert.equal(classification?.issue, 92)
	assert.equal(classification?.status, 'planned')
	assert.match(classification?.packageContract ?? '', /MUST NOT be default-on/)
})

test('#86: modern comment parts use the §2.1.5–2.1.6 content types and Internal target', () => {
	const authors = getExtension('comments-author-part')
	const comments = getExtension('comments-comment-part')
	assert.equal(authors?.contentType, 'application/vnd.ms-powerpoint.authors+xml')
	assert.equal(authors?.relationship, 'http://schemas.microsoft.com/office/2018/10/relationships/authors')
	assert.equal(authors?.targetMode, 'Internal')
	assert.equal(comments?.contentType, 'application/vnd.ms-powerpoint.comments+xml')
	assert.equal(comments?.relationship, 'http://schemas.microsoft.com/office/2018/10/relationships/comments')
	assert.equal(comments?.targetMode, 'Internal')
})

test('#86: revision and changes parts are zero-or-one Internal with no outbound rels', () => {
	for (const id of ['revision-info-part', 'changes-info-part'] as const) {
		const row = getExtension(id)
		assert.equal(row?.issue, 90)
		assert.equal(row?.targetMode, 'Internal')
		assert.match(row?.packageContract ?? '', /0\.\.1|Zero-or-one/)
		assert.match(row?.packageContract ?? '', /MUST NOT have further rels/)
	}
})

test('#86: status totals add up and Appendix A has 20 schemas', () => {
	const supported = extensionsByStatus('supported').length
	const partial = extensionsByStatus('partial').length
	const planned = extensionsByStatus('planned').length
	assert.equal(supported + partial + planned, MS_PPTX_EXTENSIONS.length)
	assert.equal(supported, 14)
	assert.equal(partial, 3)
	assert.equal(planned, 25)
	assert.equal(new Set(MS_PPTX_SCHEMAS.map(s => s.namespace)).size, 20)
})
