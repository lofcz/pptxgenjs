# Releasing `pptxgenjs-plus`

pptxgenjs-plus publishes through npm trusted publishing.

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
npm trust github pptxgenjs-plus --file=release.yml --repository=lofcz/pptxgenjs-plus --allow-publish -y
```

Confirm:

```bash
npm trust list pptxgenjs-plus
```

### First publish of `pptxgenjs-plus-jsx`

The JSX package is new on npm and must exist before trusted publishing can be attached. Publish **once** from your machine at the **same version** as `pptxgenjs-plus` (currently `4.1.17`). The workspace `file:../..` dependency is rewritten only for the tarball.

Both names are unscoped npm packages (`pptxgenjs-plus`, `pptxgenjs-plus-jsx`), not an `@org/` scope. Publish from an npm user that already maintains `pptxgenjs-plus` (`npm whoami`). Requires **npm 11.15.0 or later**.

```bash
bun ci
bun run check
bun run dist
bun run build:jsx
bun scripts/sync-jsx-version.mjs --publish
bun publish --access public --cwd packages/pptxgenjs-jsx
bun scripts/sync-jsx-version.mjs
```

Skip `bun publish` at the repo root if `pptxgenjs-plus@4.1.17` is already on the registry.

Do **not** commit the rewritten `packages/pptxgenjs-jsx/package.json` (`pptxgenjs-plus` must stay `file:../..` in git). `sync-jsx-version.mjs` without `--publish` restores that.

### Add trust for `pptxgenjs-plus-jsx`

Same workflow file; a second trust entry on the new package name:

```bash
npm trust github pptxgenjs-plus-jsx --file=release.yml --repository=lofcz/pptxgenjs-plus --allow-publish -y
npm trust list pptxgenjs-plus-jsx
```

No `NPM_TOKEN` secret is needed after that. The GitHub Actions workflow uses OIDC with `id-token: write` and publishes with provenance.

- Packages: `pptxgenjs-plus`, `pptxgenjs-plus-jsx` (lockstep version)
- Repository owner/name: `lofcz/pptxgenjs-plus`
- Workflow filename: `release.yml`
- Environment: leave empty unless the repository later adds a protected environment

## Release Flow

1. Ensure the working branch is merged to the release branch.
2. Open GitHub Actions.
3. Run **Release and Publish to npm** manually.
4. Choose `patch`, `minor`, or `major`.

The workflow:

1. Installs with `bun ci` (Bun canary).
2. Bumps the root `package.json` via `bun pm version`, then copies that version onto `packages/pptxgenjs-jsx`.
3. Runs `bun run lint`.
4. Runs `bun run typecheck`.
5. Runs `bun run test` and `bun run test:jsx`.
6. Runs `bun run dist` (Rslib) and `bun run build:jsx`.
7. Verifies package contents with `bun pm pack --dry-run`.
8. Publishes `pptxgenjs-plus`, then rewrites the JSX `file:` dependency to the shared version and publishes `pptxgenjs-plus-jsx`.
9. Restores the workspace `file:` dependency, pushes the release commit/tag, and creates a GitHub release.

## Consumer Install

```bash
npm install pptxgenjs-plus
npm install pptxgenjs-plus-jsx   # optional JSX runtime; same version
```

Use:

```ts
import pptxgen from "pptxgenjs-plus";
```
