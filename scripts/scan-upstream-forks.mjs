/**
 * Scan gitbrent/PptxGenJS forks for work ahead of upstream in the last ~12 months.
 * Usage: node scripts/scan-upstream-forks.mjs
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const UPSTREAM_OWNER = 'gitbrent'
const UPSTREAM_REPO = 'PptxGenJS'
const UPSTREAM_REF = 'master'
const PLUS_OWNER = 'lofcz'
const PLUS_REPO = 'pptxgenjs-plus'
const SINCE = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
const SKIP_OWNERS = new Set(['gitbrent', 'lofcz', 'NeomaVerwaltung', 'neo-ma'])

function ghJson(args) {
	const out = execFileSync('gh', args, {
		encoding: 'utf8',
		maxBuffer: 32 * 1024 * 1024,
		stdio: ['ignore', 'pipe', 'pipe'],
	})
	return JSON.parse(out)
}

function graphql(query, variables = {}) {
	const args = ['api', 'graphql', '-f', `query=${query}`]
	for (const [k, v] of Object.entries(variables)) {
		if (v == null) continue
		if (typeof v === 'number' || typeof v === 'boolean') args.push('-F', `${k}=${v}`)
		else args.push('-f', `${k}=${v}`)
	}
	return ghJson(args)
}

const FORKS_QUERY = `
query($cursor: String) {
  repository(owner: "${UPSTREAM_OWNER}", name: "${UPSTREAM_REPO}") {
    forkCount
    forks(first: 50, after: $cursor, orderBy: {field: PUSHED_AT, direction: DESC}) {
      pageInfo { hasNextPage endCursor }
      nodes {
        nameWithOwner
        url
        isArchived
        isEmpty
        pushedAt
        stargazerCount
        defaultBranchRef { name }
        refs(refPrefix: "refs/heads/", first: 30, orderBy: {field: TAG_COMMIT_DATE, direction: DESC}) {
          totalCount
          nodes {
            name
            target {
              ... on Commit {
                oid
                committedDate
              }
            }
          }
        }
      }
    }
  }
}
`

const COMPARE_QUERY = `
query($head: String!) {
  repository(owner: "${UPSTREAM_OWNER}", name: "${UPSTREAM_REPO}") {
    ref(qualifiedName: "refs/heads/${UPSTREAM_REF}") {
      compare(headRef: $head) {
        aheadBy
        behindBy
        status
        commits(first: 80) {
          totalCount
          nodes {
            oid
            messageHeadline
            committedDate
            commitUrl
            additions
            deletions
            changedFilesIfAvailable
            authors(first: 5) { nodes { name user { login } } }
          }
        }
      }
    }
  }
}
`

function normSubject(s) {
	return String(s || '')
		.replace(/^(chore|fix|feat|docs|refactor|test|style|perf|build|ci)(\(.+?\))?:\s*/i, '')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase()
}

function loadPlusSubjects() {
	const out = execFileSync('git', ['log', 'origin/next', '--pretty=%s'], {
		encoding: 'utf8',
		cwd: ROOT,
		maxBuffer: 16 * 1024 * 1024,
	})
	const subjects = new Set()
	for (const line of out.split(/\r?\n/)) {
		const n = normSubject(line)
		if (n) subjects.add(n)
		subjects.add(line.trim().toLowerCase())
	}
	return subjects
}

function isNoiseCommit(headline) {
	const h = headline.toLowerCase()
	return (
		/^(merge (branch|pull request|remote-tracking)|merge origin\/|merged in )/i.test(headline) ||
		h.includes('merge upstream') ||
		h.includes('sync with upstream') ||
		h.includes('sync from upstream') ||
		h.startsWith('merge gitbrent') ||
		/^bump(ed)? (version|deps|dependencies)/i.test(headline) ||
		/^update(d)? (readme\.md|changelog|version)/i.test(headline) ||
		h === 'update readme.md' ||
		h === 'updated readme' ||
		h === 'initial commit'
	)
}

function mapCommit(c) {
	return {
		sha: c.oid,
		short: c.oid.slice(0, 7),
		date: c.committedDate.slice(0, 10),
		subject: c.messageHeadline,
		url: c.commitUrl || c.url,
		additions: c.additions,
		deletions: c.deletions,
		files: c.changedFilesIfAvailable,
		authors: (c.authors?.nodes || []).map((a) => a.user?.login || a.name).filter(Boolean),
	}
}

function uniqueRecentCommits(nodes, plusSubjects) {
	const seen = new Set()
	const out = []
	for (const c of nodes || []) {
		if (!c?.oid || seen.has(c.oid)) continue
		seen.add(c.oid)
		if (!c.committedDate || c.committedDate < SINCE) continue
		if (isNoiseCommit(c.messageHeadline)) continue
		const n = normSubject(c.messageHeadline)
		if (plusSubjects.has(n) || plusSubjects.has(String(c.messageHeadline).trim().toLowerCase())) continue
		out.push(c)
	}
	return out
}

function compareHead(head) {
	const data = graphql(COMPARE_QUERY, { head })
	return data.data.repository?.ref?.compare || null
}

async function main() {
	console.error(`since=${SINCE}`)
	const plusSubjects = loadPlusSubjects()
	const recentForks = []
	let cursor = null
	let page = 0
	let forkCount = 0

	while (true) {
		page++
		const data = graphql(FORKS_QUERY, cursor ? { cursor } : {})
		const repo = data.data.repository
		forkCount = repo.forkCount
		const conn = repo.forks
		let hitOld = false
		for (const node of conn.nodes) {
			if (!node.pushedAt || node.pushedAt < SINCE) {
				hitOld = true
				break
			}
			recentForks.push(node)
		}
		console.error(`page ${page}: got ${conn.nodes.length}, recent ${recentForks.length}`)
		if (hitOld || !conn.pageInfo.hasNextPage) break
		cursor = conn.pageInfo.endCursor
	}

	const candidates = []
	for (const fork of recentForks) {
		const [owner] = fork.nameWithOwner.split('/')
		if (SKIP_OWNERS.has(owner)) continue
		if (fork.isEmpty) continue

		const branches = []
		const seenBranch = new Set()
		for (const ref of fork.refs?.nodes || []) {
			if (!ref?.name || seenBranch.has(ref.name)) continue
			seenBranch.add(ref.name)
			const tipDate = ref.target?.committedDate
			if (tipDate && tipDate < SINCE) continue
			branches.push(ref.name)
		}
		if (fork.defaultBranchRef?.name && !seenBranch.has(fork.defaultBranchRef.name)) {
			branches.unshift(fork.defaultBranchRef.name)
		}
		if (!branches.length) continue

		const bySha = new Map()
		const branchSummaries = []
		for (const branch of branches) {
			const head = `${owner}:${branch}`
			let cmp
			try {
				cmp = compareHead(head)
			} catch (err) {
				console.error(`compare failed ${head}: ${String(err.message || err).split('\n')[0]}`)
				continue
			}
			if (!cmp?.aheadBy) continue
			const unique = uniqueRecentCommits(cmp.commits?.nodes, plusSubjects)
			if (!unique.length) continue
			for (const c of unique) {
				if (!bySha.has(c.oid)) bySha.set(c.oid, { ...c, branches: [branch] })
				else bySha.get(c.oid).branches.push(branch)
			}
			branchSummaries.push({
				branch,
				aheadBy: cmp.aheadBy,
				behindBy: cmp.behindBy,
				status: cmp.status,
				compareUrl: `https://github.com/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/compare/${UPSTREAM_REF}...${owner}:${encodeURIComponent(branch)}`,
				uniqueRecent: unique.length,
			})
		}

		if (!bySha.size) continue
		const commits = [...bySha.values()].sort((a, b) => b.committedDate.localeCompare(a.committedDate))
		candidates.push({
			repo: fork.nameWithOwner,
			url: fork.url,
			defaultBranch: fork.defaultBranchRef?.name || null,
			pushedAt: fork.pushedAt,
			stars: fork.stargazerCount,
			archived: fork.isArchived,
			branchCountListed: fork.refs?.totalCount || 0,
			branches: branchSummaries,
			recentNonMergeAhead: commits.length,
			commits: commits.map(mapCommit).map((c, i) => ({ ...c, branches: commits[i].branches })),
		})
		console.error(`ahead ${fork.nameWithOwner} unique12m=${commits.length} branches=${branchSummaries.map((b) => b.branch).join(',')}`)
	}

	let extraRepos = []
	try {
		extraRepos = ghJson([
			'search',
			'repos',
			'PptxGenJS in:name',
			'--fork',
			'--limit',
			'50',
			'--sort',
			'updated',
			'--json',
			'fullName,url,pushedAt,updatedAt,description',
		])
	} catch (err) {
		console.error(`repo search failed: ${err.message.split('\n')[0]}`)
	}

	let recentUpstreamPrs = []
	try {
		recentUpstreamPrs = ghJson([
			'pr',
			'list',
			'--repo',
			`${UPSTREAM_OWNER}/${UPSTREAM_REPO}`,
			'--state',
			'all',
			'--limit',
			'50',
			'--json',
			'number,title,url,state,updatedAt,headRepository,headRefName,author,isDraft',
		]).filter((pr) => pr.updatedAt >= SINCE)
	} catch (err) {
		console.error(`pr list failed: ${err.message.split('\n')[0]}`)
	}

	candidates.sort((a, b) => b.recentNonMergeAhead - a.recentNonMergeAhead || b.stars - a.stars)

	const known = new Set(candidates.map((c) => c.repo.toLowerCase()))
	known.add(`${UPSTREAM_OWNER}/${UPSTREAM_REPO}`.toLowerCase())
	known.add(`${PLUS_OWNER}/${PLUS_REPO}`.toLowerCase())
	for (const owner of SKIP_OWNERS) known.add(`${owner}/${UPSTREAM_REPO}`.toLowerCase())

	const nestedMaybe = (extraRepos || []).filter((r) => {
		if (!r.fullName || known.has(r.fullName.toLowerCase())) return false
		const pushed = r.pushedAt || r.updatedAt
		return pushed && pushed >= SINCE
	})

	const outDir = join(ROOT, 'standards')
	const jsonPath = join(outDir, 'fork-backport-candidates.json')
	const mdPath = join(outDir, 'fork-backport-candidates.md')

	writeFileSync(
		jsonPath,
		JSON.stringify(
			{
				generatedAt: new Date().toISOString(),
				since: SINCE,
				upstream: `${UPSTREAM_OWNER}/${UPSTREAM_REPO}@${UPSTREAM_REF}`,
				target: `${PLUS_OWNER}/${PLUS_REPO}`,
				directForkCount: forkCount,
				recentDirectForks: recentForks.length,
				candidateCount: candidates.length,
				note: 'Direct forks only via GraphQL repository.forks. Nested forks may appear under searchHits. Subjects already present on origin/next were dropped as already-picked guesses. Merge/sync/readme/version-bump commits were filtered.',
				candidates,
				searchHitsNotInDirectForkList: nestedMaybe,
				upstreamPullsInWindow: recentUpstreamPrs,
			},
			null,
			2,
		),
	)

	const lines = [
		'# Fork backport candidates',
		'',
		`Generated ${new Date().toISOString().slice(0, 10)} from GitHub GraphQL + REST.`,
		'',
		`- Upstream: \`${UPSTREAM_OWNER}/${UPSTREAM_REPO}@${UPSTREAM_REF}\``,
		`- Target: \`${PLUS_OWNER}/${PLUS_REPO}\` (\`next\`)`,
		`- Window: after ${SINCE.slice(0, 10)}`,
		`- Direct forks pushed in window: ${recentForks.length} of ${forkCount}`,
		`- Candidates still ahead with unique recent commits: **${candidates.length}**`,
		'',
		'Limits: GitHub lists **direct** forks only (not forks-of-forks). Compare returns at most 80 commits per branch. Subject match against `origin/next` is a guess for already-picked work.',
		'',
		'## Agent assignment',
		'',
		'Each `##` section is one backport unit. Port selectively into `lofcz/pptxgenjs-plus` on a feature branch off `next`. Do not impersonate the fork owner. Skip merge/sync/version noise. Reuse existing APIs/tests in this fork; add regression coverage rather than wholesale-importing generators.',
		'',
	]

	for (const [i, c] of candidates.entries()) {
		lines.push(`## ${i + 1}. ${c.repo}`)
		lines.push('')
		lines.push(`- Repo: ${c.url}`)
		lines.push(
			`- Default branch: \`${c.defaultBranch || '?'}\` (pushed ${c.pushedAt.slice(0, 10)}, ☆ ${c.stars}${c.archived ? ', archived' : ''})`,
		)
		for (const b of c.branches) {
			lines.push(`- \`${b.branch}\`: **${b.aheadBy} ahead** / ${b.behindBy} behind ([compare](${b.compareUrl}))`)
		}
		lines.push(`- Unique recent commits after already-picked filter: **${c.recentNonMergeAhead}**`)
		lines.push('')
		lines.push('### Ask')
		lines.push('')
		lines.push(
			`Review the commits below from \`${c.repo}\` against current \`next\`. Cherry-pick or re-implement any still-missing, non-duplicate behavior. Prefer semantic ports + tests over raw cherry-picks when the tree has drifted.`,
		)
		lines.push('')
		lines.push('| sha | date | branch | subject | +/- |')
		lines.push('|---|---|---|---|---|')
		for (const commit of c.commits) {
			const pm = commit.additions != null ? `+${commit.additions}/-${commit.deletions ?? '?'}` : ''
			const br = (commit.branches || []).join(', ')
			lines.push(
				`| [\`${commit.short}\`](${commit.url}) | ${commit.date} | \`${br}\` | ${commit.subject.replace(/\|/g, '\\|')} | ${pm} |`,
			)
		}
		lines.push('')
	}

	if (nestedMaybe.length) {
		lines.push('## Search hits not in the direct-fork list')
		lines.push('')
		lines.push('These may be nested forks, mirrors, or unrelated same-name repos. Inspect before assigning.')
		lines.push('')
		for (const r of nestedMaybe) {
			lines.push(`- [${r.fullName}](${r.url}) pushed ${String(r.pushedAt || r.updatedAt).slice(0, 10)}${r.description ? ` — ${r.description}` : ''}`)
		}
		lines.push('')
	}

	if (recentUpstreamPrs.length) {
		lines.push('## Upstream PRs updated in the window')
		lines.push('')
		for (const pr of recentUpstreamPrs) {
			const repo = pr.headRepository?.nameWithOwner || pr.headRepository?.name || '?'
			lines.push(`- [#${pr.number}](${pr.url}) ${pr.state} \`${repo}:${pr.headRefName}\` — ${pr.title}`)
		}
		lines.push('')
	}

	writeFileSync(mdPath, lines.join('\n'))
	console.log(
		JSON.stringify(
			{
				jsonPath,
				mdPath,
				candidateCount: candidates.length,
				recentDirectForks: recentForks.length,
				forkCount,
				searchHits: nestedMaybe.length,
				upstreamPrs: recentUpstreamPrs.length,
			},
			null,
			2,
		),
	)
}

await main()
