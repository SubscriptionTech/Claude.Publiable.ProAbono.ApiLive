# Website Description

This folder contains the requirements and specifications for the **ProAbono API Live documentation website**.

Its purpose is to give a language model (such as Claude Code) everything it needs to implement the website from scratch, without any prior context.

## How to use this folder

Read the files in this folder before writing any code. Each file describes a specific aspect of the website. Together they form the complete specification an implementer needs to build the site.

Start with this file to get the overall picture, then read the other files in the order they are listed in each section above.

## Description files

Read these files before implementing the site:

1. [stack.md](stack.md) — framework and tooling choices (Docusaurus)
2. [architecture.md](architecture.md) — repo layout, content origins, build process
3. [content-pipeline.md](content-pipeline.md) — extraction script, filtering rules, MDX output format
4. [i18n.md](i18n.md) — supported locales (en, fr), URL structure, what is translated, translation workflow
5. [design.md](design.md) — color palette, typography, layout, UI components
6. [navigation.md](navigation.md) — sidebar sections, page hierarchy, sidebar configuration
7. [pages/getting-started.md](pages/getting-started.md) — Quick Start page spec
8. [pages/authentication.md](pages/authentication.md) — Authentication page spec
9. [pages/concepts.md](pages/concepts.md) — Core Concepts and Conventions pages spec
10. [pages/guides.md](pages/guides.md) — Guides section spec (onboard, terminate & anonymize)
11. [pages/api-reference.md](pages/api-reference.md) — API Reference section structure (auto-generated)
12. [deployment.md](deployment.md) — Azure Static Web Apps config, GitHub Actions workflow, branch strategy

## Relationship to the API specs

The website documents the ProAbono API Live. The API specs live in [shared/ProAbonoLive/](../shared/ProAbonoLive/). The website implementation must treat those specs as the source of truth for all API-related content.
