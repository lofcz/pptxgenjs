# PptxGenJS agent guidance

## Repository targeting

This checkout is the NEOMA-maintained fork: open pull requests against `NeomaVerwaltung/PptxGenJS` (`origin`), not the original `gitbrent/PptxGenJS` (`upstream`). Verify the remotes before GitHub issue or PR work.

After creating a pull request, run `gh pr view <number> --repo NeomaVerwaltung/PptxGenJS --json url,state,baseRefName,headRefName,title` and verify the target is `master` and the head is the intended branch before reporting it.

## OOXML specification

For OOXML generation or package changes, work from the official [ECMA-376 Office Open XML specification](https://ecma-international.org/publications-and-standards/standards/ecma-376/). It provides the current downloadable parts:

- Part 1: Fundamentals and Markup Language Reference (DrawingML and PresentationML)
- Part 2: Open Packaging Conventions
- Part 3: Markup Compatibility and Extensibility
- Part 4: Transitional Migration Features

For PowerPoint compatibility, also consult Microsoft's [MS-OI29500 Office implementation notes](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oi29500/1fd4a662-8623-49c0-82f0-18fa91b413b8), which documents Office behavior that varies from or extends the standard. Use the relevant source when a generated package or element is in question; keep package-contract tests semantic rather than snapshotting generated XML.
