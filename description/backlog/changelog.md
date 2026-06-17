<!-- ============================================================
FOR THE READER — Claude should skip this section entirely.

A changelog page documents API changes over time so developers know what has
changed between versions. Implement this when there are meaningful API changes
to record (new resources, breaking changes, deprecations).

The page is hand-authored — there is no automated generation from the OpenAPI
spec. You or your team add entries manually whenever the API changes.
============================================================ -->

# Implementation instructions — Changelog

## Functional

The website includes a **Changelog** page listing API changes over time. It
is a single scrollable page, organized in reverse chronological order (newest
first).

Each entry has:

- A date or version identifier as a heading.
- A categorized list of changes using the following labels: **New**,
  **Changed**, **Deprecated**, **Removed**, **Fixed**.
- A short description for each change: what changed and what it affects.

The page is linked from the sidebar as a top-level item. It is not nested
under any section.

Update `description/functional/navigation.md` to add the Changelog entry to
the sidebar and to the top-level page list.

## Pipeline

The changelog is **hand-authored** — it is not generated from the OpenAPI spec
or any other automated source.

Authors add new entries at the top of the file whenever the API changes. Each
entry must be written in English.

## Technical

1. Create `website/docs/changelog.md` with a `sidebar_position` frontmatter
   value that places it after the last top-level section (e.g. API Reference).
2. No plugin configuration changes are required.
3. Update `description/technical/navigation.md` if a `sidebars.js` or
   `_category_.json` change is needed to surface the page in the sidebar.
