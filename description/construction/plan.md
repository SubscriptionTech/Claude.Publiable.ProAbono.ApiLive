# ProAbono API Live — Documentation Website Plan

## Context

This plan describes the phases for building the ProAbono API Live documentation website.
The website documents the ProAbono API Live for a developer audience.

### Key constraints

- The `shared/ProAbonoLive/` submodule will **not** be deployed. All content must be extracted from it and stored as intermediate files in this repo.
- Hosting: Azure Static Web Apps, deployed on every push to the main branch via GitHub.
- v1 supports **multiple languages**.
- Audience: **developers** integrating the API.
- Interactive API explorer: deferred to a later version (see backlog).

---

## Description files to produce

The `description/` folder will contain the following specification files (to be read by Claude Code when implementing the site):

```
description/
  index.md                  ← exists (update reading order at the end)
  backlog.md                ← deferred features
  stack.md                  ← framework and tooling
  architecture.md           ← project structure, build process
  content-pipeline.md       ← spec extraction, intermediate format, filesystem layout
  i18n.md                   ← multilingual approach
  design.md                 ← visual design system
  navigation.md             ← site sections and page hierarchy
  deployment.md             ← Azure Static Web Apps, CI/CD
  pages/
    getting-started.md
    authentication.md
    concepts.md
    guides.md
    api-reference.md
```

---

## Choices to validate

Before starting each phase, Claude identifies the key decisions that phase requires and presents them as numbered options. The user reviews and validates those choices before Claude proceeds with the phase.

> When a phase proposes choices, list them here under the phase name. Strike through each choice once validated.

### ~~Phase 3 choices~~
~~1. Docusaurus project location — B: `website/` subfolder~~
~~2. Intermediate file format — B: MDX/Markdown~~
~~3. Intermediate files location — B: inside the Docusaurus project (`website/docs/api-reference/`)~~
~~4. Extraction trigger — A: committed intermediate files, local-only extraction~~

### ~~Phase 4 choices~~
~~1. Supported locales — A: English + French (`en`, `fr`)~~
~~2. Default locale URL — B: all locales prefixed (`/en/`, `/fr/`)~~
~~3. What is translated — A: all prose except identifiers (field names, endpoints, code blocks)~~
~~4. Translation storage — A: full document copies per locale~~

### ~~Phase 7 choices~~
~~1. Branch strategy — A: main → production only~~
~~2. PR preview environments — B: disabled~~
~~3. Node.js version pinning — A: hardcoded in workflow (`node-version: '22.x'`)~~

---

## Phases

> When a phase is complete, strike through its heading and content.

### ~~Phase 1 — Backlog~~
~~No research needed. Write `backlog.md` from what is already known:~~
~~- Interactive API explorer~~
~~- Changelog~~

### ~~Phase 2 — Stack research~~
~~Deep research to validate Next.js vs. alternatives (Astro, VitePress, Docusaurus, plain static…) for this use case:~~
~~- Multi-language support~~
~~- Azure Static Web Apps hosting~~
~~- Content consumed from intermediate files~~
~~- Developer documentation audience~~

~~Produces: `stack.md`~~

### ~~Phase 3 — Architecture & content pipeline~~
~~Define:~~
~~- Project folder structure~~
~~- Where intermediate files live in the repo~~
~~- How the extraction script works (reads `shared/ProAbonoLive/`, writes intermediate files)~~
~~- When the site reads them (build time vs. runtime)~~

~~Produces: `architecture.md`, `content-pipeline.md`~~

### ~~Phase 4 — Internationalization~~
~~Define:~~
~~- Routing strategy (`/en/`, `/fr/`, etc.)~~
~~- Translation files format and location~~
~~- Which content is translated vs. always English (e.g. API field names, code samples)~~

~~Produces: `i18n.md`~~

### ~~Phase 5 — Design~~
~~Define visual identity: color palette, typography, layout grid, key UI components (sidebar, code block, breadcrumb, navigation).~~
~~Branding reference to be discussed when starting this phase.~~

~~Notes for the user:~~
~~- https://gitbook.com/docs/~~
~~- https://www.proabono.com/_next/static/media/brand.ab41491b.svg~~

~~Produces: `design.md`~~

### ~~Phase 6 — Site structure & pages~~
~~Define the navigation hierarchy and spec each page section:~~
~~- Getting Started / Quick start~~
~~- Authentication & credentials~~
~~- Concepts / Glossary~~
~~- Guides / Recipes~~
~~- API Reference (all 11 resources: Customers, Offers, Features, Subscriptions, Invoices, Balance Lines, Customer Address Billing, Customer Address Shipping, Customer Payment Settings, Usage, Quoting)~~

~~Produces: `navigation.md`, `pages/getting-started.md`, `pages/authentication.md`, `pages/concepts.md`, `pages/guides.md`, `pages/api-reference.md`~~

### ~~Phase 7 — Deployment~~
~~Define:~~
~~- Azure Static Web Apps configuration~~
~~- GitHub Actions workflow~~
~~- Branch strategy (e.g. `main` → production)~~

~~Produces: `deployment.md`~~

### Final step — Update `index.md`
Add the reading order for all new description files so an implementer knows where to start.
