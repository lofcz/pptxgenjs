/**
 * Opens the committed repair fixtures with the hidden-desktop PowerPoint sidecar.
 * Regenerates the files first so the mutations stay in sync with the generator.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isPowerPointSidecarAvailable } from './powerpoint-verify'
import { isPowerPointResult, verifyPptxFiles } from './pptx-verify'
import { buildRepairFixtures, fixturePath, REPAIR_FIXTURES } from './repair-fixtures'

const available = isPowerPointSidecarAvailable()
const run = available ? test : test.skip

run('powerpoint: repair fixtures match expected Office verdicts', async () => {
	await buildRepairFixtures()
	const paths = REPAIR_FIXTURES.map(fixture => fixturePath(fixture.id))
	const reports = await verifyPptxFiles(paths, { powerpoint: true, timeoutMs: 30_000 })
	assert.equal(reports.length, REPAIR_FIXTURES.length)

	const mismatches: string[] = []
	for (const [index, fixture] of REPAIR_FIXTURES.entries()) {
		const report = reports[index]
		assert.ok(isPowerPointResult(report.powerpoint), `${fixture.id}: missing PowerPoint result`)
		const verdict = report.powerpoint.verdict
		if (verdict !== fixture.expect) {
			mismatches.push(
				`${fixture.id}: expected ${fixture.expect}, got ${verdict}`
				+ (report.powerpoint.repairSummary ? ` (${report.powerpoint.repairSummary})` : '')
				+ (report.powerpoint.error ? ` error=${report.powerpoint.error}` : ''),
			)
		}
		if (fixture.expect === 'ok') {
			assert.equal(report.ok, true, `${fixture.id} should be a clean package: ${JSON.stringify(report.issues)}`)
		}
	}
	assert.equal(mismatches.length, 0, mismatches.join('\n'))
})
