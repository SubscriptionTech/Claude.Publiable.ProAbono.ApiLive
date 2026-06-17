# Backlog: Try It Panel (request from site)

Allow developers to make live API calls directly from the documentation page, using the built-in Try It panel provided by `docusaurus-theme-openapi-docs`.

The Request and Response tiles are hidden because the API does not allow cross-domain calls (CORS). Before re-enabling them, CORS support must be added on the API side. The right panel itself (code snippets, security schemes) remains visible.

## How it is hidden

Two complementary layers are in place:

### Layer 1 — Swizzled component (primary)

[website/src/theme/ApiExplorer/index.tsx](../../website/src/theme/ApiExplorer/index.tsx) is an ejected copy of the theme's `ApiExplorer` component with `<Request>` and `<Response>` removed. Docusaurus picks up any file under `src/theme/` over the plugin default, so this file takes precedence at build time.

The original theme component is at `node_modules/docusaurus-theme-openapi-docs/src/theme/ApiExplorer/index.tsx` for reference.

### Layer 2 — CSS fallback (belt-and-suspenders)

In [website/src/css/custom.css](../../website/src/css/custom.css), the following block hides the tiles at runtime in case the swizzle ever stops taking effect (e.g. after a plugin upgrade that resets the component resolution):

```css
/* ─── Hide Try It (Request/Response tiles) ───────────────────────────────── */

.openapi-explorer__request-form,
.openapi-explorer__response-container {
  display: none;
}
```

## How to re-enable

1. **Remove the swizzled file**: delete `website/src/theme/ApiExplorer/index.tsx`. Docusaurus will fall back to the plugin's built-in component, which includes `<Request>` and `<Response>`.

2. **Remove the CSS fallback**: delete the `Hide Try It` block from `website/src/css/custom.css`.

## Prerequisites

- The API must expose CORS headers allowing requests from the documentation domain.
- Review authentication UX: the panel will need an agent key / API key input for live calls.
