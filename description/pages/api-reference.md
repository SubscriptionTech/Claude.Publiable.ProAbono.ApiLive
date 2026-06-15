# Page spec — API Reference

The API Reference section is auto-generated from the OpenAPI spec by `docusaurus-plugin-openapi-docs`. Read [content-pipeline.md](../content-pipeline.md) for the generation command and plugin configuration.

---

## Layout

Each API reference page uses the 3-pane layout provided by `docusaurus-theme-openapi-docs`:

| Pane | Content |
|------|---------|
| Left | Collapsible sidebar listing all operations, grouped by resource tag |
| Center | Operation description, path parameters, query parameters, request body schema |
| Right | Code samples (request), response examples (JSON) |

JSON is displayed exclusively in the right pane. The center pane contains only prose and parameter tables — no raw JSON.

---

## Sidebar

The plugin generates `website/docs/api-reference/sidebar.js`. Import it in `website/sidebars.js` and position it as the last item in the main sidebar (after Guides):

```js
// sidebars.js
const apiSidebar = require('./docs/api-reference/sidebar');

module.exports = {
  mainSidebar: [
    'getting-started/index',
    'authentication/index',
    { type: 'category', label: 'Concepts', items: [...] },
    { type: 'category', label: 'Guides', items: [...] },
    ...apiSidebar,
  ],
};
```

---

## Resources

The plugin groups operations by the `tags` field in the OpenAPI spec. The tag list and order must match the resource inventory below.

Eleven resources, in the order defined by `shared/ProAbonoLive/specs/resources-index.md`:

| Tag | Display label | Description |
|-----|---------------|-------------|
| `customer` | Customers | End-customers — create, retrieve, list, suspend, anonymize |
| `offer` | Offers | Pricing plans — retrieve and list (read-only) |
| `feature` | Features | Offer components — retrieve and list (read-only) |
| `subscription` | Subscriptions | Customer/offer links — create, start, suspend, upgrade, terminate |
| `invoice` | Invoices | Billing documents — retrieve and list (read-only) |
| `balance-line` | Balance Lines | Credit/debit entries — create and list |
| `customer-address-billing` | Customer Address Billing | Customer billing address — retrieve and update |
| `customer-address-shipping` | Customer Address Shipping | Customer shipping address — retrieve and update |
| `customer-payment-settings` | Customer Payment Settings | Customer payment configuration — retrieve and update |
| `usage` | Usage | Feature access and consumption state — retrieve and update |
| `quoting` | Quoting | Price simulation — compute the exact cost of an operation before executing it |

---

## Per-operation page structure

Each operation page is rendered by the theme and contains:

**Center pane**
- Operation title and description (from the spec's `summary` and `description`)
- Authorization note (if the operation requires authentication)
- Path parameters table (if any)
- Query parameters table (if any)
- Request body schema (if any) — field names, types, required flag, descriptions

**Right pane**
- Request code sample (curl by default; the theme supports additional languages)
- Response schema and example (JSON)

---

## Do not edit generated files

Files under `website/docs/api-reference/` are regenerated on every run of `docusaurus gen-api-docs`. Manual edits will be overwritten. To change API reference content, update `shared/ProAbonoLive/shared-specs/pa-live-openapi-3.0.3.yaml` (and keep the markdown resource docs in sync per the submodule's CLAUDE.md), then re-run `npm run gen-api-docs`.
