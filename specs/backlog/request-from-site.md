<!-- ============================================================
FOR THE READER — Claude should skip this section entirely.

The Try It panel lets developers make live API calls directly from the
documentation. It was hidden because the ProAbono API does not allow
cross-domain requests (CORS). Once the API team adds CORS support for the
documentation domain, ask Claude to re-enable the panel using these
instructions.
============================================================ -->

# Implementation instructions — Try It panel (request from site)

## Functional

Each API reference page includes a **Try It** panel that lets developers make
live API calls without leaving the documentation. The panel contains:

- A request form with fields for path parameters, query parameters, headers,
  and request body.
- An agent key / API key input field for authentication.
- A response display showing the HTTP status, headers, and body returned by
  the API.

The right-hand panel (code snippets and security scheme display) is already
visible and is not affected by this change.

## Pipeline

No pipeline changes required.

## Technical

The Try It panel is currently suppressed by two complementary layers. Remove
both.

### Step 1 — Remove the swizzled component

Delete `website/src/theme/ApiExplorer/index.tsx`.

This file is an ejected copy of the plugin's `ApiExplorer` component with
`<Request>` and `<Response>` removed. Deleting it causes Docusaurus to fall
back to the plugin's built-in component, which includes both tiles.

The original theme component is at
`node_modules/docusaurus-theme-openapi-docs/src/theme/ApiExplorer/index.tsx`
for reference.

### Step 2 — Remove the CSS fallback

In `website/src/css/custom.css`, delete the following block:

```css
/* ─── Hide Try It (Request/Response tiles) ───────────────────────────────── */

.openapi-explorer__request-form,
.openapi-explorer__response-container {
  display: none;
}
```

### Prerequisites

Before making these changes, confirm with the user that:

- The API exposes CORS headers allowing requests from the documentation domain.
- The authentication UX for the panel has been decided (agent key format, where
  the user enters it).
