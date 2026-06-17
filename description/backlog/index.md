# Backlog

Features deferred to future versions of the ProAbono API Live documentation website.

## Add guides

See [add-guides.md](add-guides.md).

The Guides section exists in the sidebar but currently has no pages. Each guide maps to one cross-resource action marked `Documented: yes` in `shared/ProAbonoLive/specs/actions.md`. No actions are marked for documentation yet.

## Try It panel (request from site)

See [request-from-site.md](request-from-site.md).

The built-in Try It panel (request + response tile on API reference pages) was hidden because the API does not allow cross-domain calls. Re-enabling it requires CORS support on the API side.

## Interactive API explorer

Allow developers to make live API calls directly from the documentation, without leaving the browser.

- Input fields for request parameters and body
- Authentication via agent key / API key entered in the browser
- Live response display with syntax highlighting
- Environment selector (Production, Dev)

## Localization (i18n)

Add French (`fr`) as a second locale alongside English (`en`).

To re-enable once localization is implemented:

- In `docusaurus.config.js`, add the `i18n` block with `defaultLocale: 'en'` and `locales: ['en', 'fr']`.
- In [navigation.md](../navigation.md), add a **Locale switcher** as the first right-aligned navbar item:
  ```js
  // In the navbar items array in docusaurus.config.js:
  { type: 'localeDropdown', position: 'right' }
  ```
- Provide translated content under `i18n/fr/docusaurus-plugin-content-docs/current/` following the Docusaurus i18n file structure.

## Changelog

A page listing changes to the API over time: new resources, new actions, breaking changes, deprecations.
