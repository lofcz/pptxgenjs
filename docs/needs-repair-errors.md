---
title: PowerPoint "Needs Repair" Errors
sidebar_label: Needs Repair Errors
---

This guide covers troubleshooting when PowerPoint shows a "needs repair" error dialog on opening a generated presentation.

## Why these errors are difficult to debug

PowerPoint files are ZIP archives containing many XML files. When PowerPoint reports a "needs repair" error, one or more of these internal XML files do not conform to the Office Open XML (OOXML) specification.

PowerPoint's error messages are generic and do not identify the line, element, or file within the XML that causes the problem. The fault must therefore be located by systematic elimination.

## How to diagnose your specific issue

Since `pptxgenjs` generates the OOXML based on your API calls, the most effective method for identifying the root cause of a particular error is a process of elimination:

### Isolate the problematic slide

1. Generate the presentation with **only a few slides**, or even just one.
2. If that file opens correctly, **add slides back one by one**. Generate and open the `.pptx` file after each addition.
3. When the presentation becomes unreadable, the most recently added slide contains the problematic content.

### Pinpoint the problematic feature

After isolating the problematic slide, remove content from that specific slide.

- Remove elements such as:
  - Textboxes
  - Images
  - Tables
  - Charts
  - Shapes
- Remove these features **one by one**, generating and testing the file after each removal. This narrows down which specific feature or combination of features is causing the XML validation error.

Alternatively, try different options on auto-paged tables, charts, and similar features. Invalid or incorrect options are a frequent cause of these errors.

## What to do once you've found the cause

### Review your API usage/options

Verify the options and data passed for the identified problematic feature against the `pptxgenjs` documentation. Minor typos, incorrect data types, or out-of-bounds values can produce invalid XML.

Working code examples exist for every available option. Start with code that works, then modify from there.

### Search for existing issues

Check the `pptxgenjs` GitHub issues (both open and closed) for the specific feature you have identified. The problem may already have been reported.

### Open a new, detailed issue

If you have confirmed a bug in `pptxgenjs`, open a **new GitHub issue**. Include the following in the report:

- The `pptxgenjs` version you are using.
- A **minimal reproducible code example** that demonstrates the issue (only the problematic slide/feature).
- Any relevant error messages from your browser console or Node.js environment.

A detailed report enables NEOMA to identify and fix bugs in the library efficiently.
