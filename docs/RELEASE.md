# Releasing `pptxgenjs-plus`

PptxGenJS Plus publishes through npm trusted publishing.

Requires **npm 11.15.0 or later** (`npm install -g npm@^11.15.0`).

## One-Time npm Setup

### Revoke trust on the old package

```bash
npm trust list @lofcz/pptxgenjs
npm trust revoke @lofcz/pptxgenjs --id=<trust-id>
```

Repeat `revoke` for every ID from `list`.

### First publish of the new name

Trusted publishing can only be attached after the package exists. Publish once from your machine:

```bash
bun run check
bun run dist
bun publish --access public
```

### Add trust for `pptxgenjs-plus`

```bash
npm trust github pptxgenjs-plus --file=release.yml --repository=lofcz/PptxGenJS --allow-publish -y
```

Confirm:

```bash
npm trust list pptxgenjs-plus
```

No `NPM_TOKEN` secret is needed after that. The GitHub Actions workflow uses OIDC with `id-token: write` and publishes with provenance.

- Package: `pptxgenjs-plus`
- Repository owner/name: `lofcz/PptxGenJS`
- Workflow filename: `release.yml`
- Environment: leave empty unless the repository later adds a protected environment

## Release Flow

1. Ensure the working branch is merged to the release branch.
2. Open GitHub Actions.
3. Run **Release and Publish to npm** manually.
4. Choose `patch`, `minor`, or `major`.

The workflow:

1. Installs with `bun ci` (Bun canary).
2. Bumps `package.json` via `bun pm version`.
3. Runs `bun run lint`.
4. Runs `bun run typecheck`.
5. Runs `bun run test`.
6. Runs `bun run dist` (Rslib).
7. Verifies package contents with `bun pm pack --dry-run`.
8. Publishes with `bun publish --access public`.
9. Pushes the release commit/tag and creates a GitHub release.

## Consumer Install

```bash
npm install pptxgenjs-plus
```

Use:

```ts
import pptxgen from "pptxgenjs-plus";
```
