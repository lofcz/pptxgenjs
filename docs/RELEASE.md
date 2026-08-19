# Releasing `pptxgenjs-plus`

pptxgenjs-plus publishes through npm trusted publishing (OIDC). GitHub Actions must **not** use repository secrets: no `NPM_TOKEN`, no `NODE_AUTH_TOKEN`. The workflow matches [edix](https://github.com/lofcz/edix): `id-token: write`, `setup-node` with `registry-url: https://registry.npmjs.org`, and `npm publish --provenance --access public`.

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
npm publish --access public
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

Both names are unscoped npm packages (`pptxgenjs-plus`, `pptxgenjs-plus-jsx`), not an `@org/` scope. Publish from an npm user that already maintains `pptxgenjs-plus` (`npm whoami`).

```bash
bun ci
bun run check
bun run dist
bun run build:jsx
bun scripts/sync-jsx-version.mjs --publish
npm publish --access public --prefix packages/pptxgenjs-jsx
bun scripts/sync-jsx-version.mjs
```

Skip the root publish if `pptxgenjs-plus@4.1.17` is already on the registry.

Do **not** commit the rewritten `packages/pptxgenjs-jsx/package.json` (`pptxgenjs-plus` must stay `file:../..` in git). `sync-jsx-version.mjs` without `--publish` restores that.

### Add trust for `pptxgenjs-plus-jsx`

Same workflow file; a second trust entry on the new package name:

```bash
npm trust github pptxgenjs-plus-jsx --file=release.yml --repository=lofcz/pptxgenjs-plus --allow-publish -y
npm trust list pptxgenjs-plus-jsx
```

Trusted publisher settings:

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

1. Sets up Node with the npm registry URL (OIDC; no secrets).
2. Installs with `bun ci` (Bun canary).
3. Runs `bun run typecheck`, `bun run test`, `bun run test:jsx`.
4. Runs `bun run dist` (Rslib) and `bun run build:jsx`.
5. Bumps the root `package.json` via `bun pm version`, then copies that version onto `packages/pptxgenjs-jsx`.
6. Commits and tags the release (not pushed yet).
7. Publishes `pptxgenjs-plus` with `npm publish --provenance --access public`.
8. Rewrites the JSX `file:` dependency, publishes `pptxgenjs-plus-jsx` the same way, then restores `file:../..`.
9. Pushes the release commit/tag and creates a GitHub release.

GitHub Actions must use `npm publish`, not `bun publish`. Bun has no OIDC trusted-publisher support.

## Consumer Install

```bash
npm install pptxgenjs-plus
npm install pptxgenjs-plus-jsx   # optional JSX runtime; same version
```

Use:

```ts
import pptxgen from "pptxgenjs-plus";
```
