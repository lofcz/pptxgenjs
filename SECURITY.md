# Security Policy

## Supported Versions

Security fixes are applied to the latest `4.x` release line. Older major
versions are not maintained.

| Version | Supported |
| ------- | --------- |
| 4.x     | Yes       |
| < 4.0   | No        |

## Reporting a Vulnerability

Do not open a public issue for security problems.

Report vulnerabilities privately via GitHub's [security advisory form](https://github.com/NeomaVerwaltung/PptxGenJS/security/advisories/new).
Include a description, the affected version, and a reproduction if possible.

NEOMA aims to acknowledge reports within 5 business days and treats fixes or
mitigations for confirmed high-severity issues as a priority.

## Scope

This library generates `.pptx` files from untrusted input (text, images,
data). Treat generated output as you would any user-supplied file. Report
any case where crafted input can:

- read or write files outside the intended output path,
- cause the process to hang or exhaust memory, or
- inject unexpected content into the generated document.

Build-time (`devDependencies`) advisories that do not affect the published
`dist/` output are tracked but are lower priority than runtime issues.
