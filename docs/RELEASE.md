# Releasing `@lofcz/pptxgenjs`

PptxGenJS publishes through npm trusted publishing, matching the release model used by `@lofcz/pptist`.

## One-Time npm Setup

In npm, configure trusted publishing for `@lofcz/pptxgenjs`:

- Package: `@lofcz/pptxgenjs`
- Repository owner/name: `lofcz/PptxGenJS`
- Workflow filename: `release.yml`
- Environment: leave empty unless the repository later adds a protected environment

No `NPM_TOKEN` secret is needed. The GitHub Actions workflow uses OIDC with `id-token: write` and publishes with provenance.

### First release (manual)

Before trusted publishing is configured, publish once from your machine:

```bash
npm login
npm run check
npm run dist
npm publish
```

Then configure trusted publishing in npm for future releases.

## Release Flow

1. Ensure the working branch is merged to the release branch.
2. Open GitHub Actions.
3. Run **Release and Publish to npm** manually.
4. Choose `patch`, `minor`, or `major`.

The workflow:

1. Installs with `npm ci`.
2. Bumps `package.json`, `package-lock.json`, and `src/pptxgen.ts`.
3. Runs `npm run lint`.
4. Runs `npm run typecheck` and `npm run typecheck:strict`.
5. Runs `npm test`.
6. Runs `npm run dist`.
7. Verifies package contents with `npm pack --dry-run`.
8. Publishes with `npm publish --provenance`.
9. Pushes the release commit/tag and creates a GitHub release.

## Consumer Install

```bash
npm install @lofcz/pptxgenjs
```

Use:

```ts
import pptxgen from "@lofcz/pptxgenjs";
```
