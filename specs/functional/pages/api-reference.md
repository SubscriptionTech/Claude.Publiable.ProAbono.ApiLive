# Page spec — API Reference

The API Reference section contains one page per API operation. How these pages are produced is described in the [pipeline specifications](../../pipeline/index.md); how they are rendered is described in the [technical specifications](../../technical/index.md).

---

## Layout

Each API reference page uses a 3-pane layout:

| Pane | Content |
|------|---------|
| Left | Collapsible sidebar listing all operations, grouped by resource |
| Center | Operation description, path parameters, query parameters, request body schema |
| Right | Code samples (request), response examples (JSON) |

JSON is displayed exclusively in the right pane. The center pane contains only prose and parameter tables — no raw JSON.

---

## Sidebar

The API reference sidebar lists all operations, grouped by resource. How the sidebar is generated and integrated into the site navigation is described in the [technical specifications](../../technical/index.md).

---

## Resources

Operations are grouped by resource tag. The tag list and display order must match the resource inventory below.

Ten resources. Display order and grouping rules are defined in [shared/ProAbonoLive/specs/authoring.md](../../../../shared/ProAbonoLive/specs/authoring.md), which is the source of truth for how resources are ordered and presented in any documentation target.

| Resource | Display label | Description |
|----------|---------------|-------------|
| Customer | Customers | End-customers — create, retrieve, list, suspend, anonymize |
| Usage | Usage | Feature access and consumption state — retrieve and update |
| Offer | Offers | Pricing plans — retrieve and list (read-only) |
| Feature | Features | Offer components — retrieve and list (read-only) |
| Subscription | Subscriptions | Customer/offer links — create, start, suspend, upgrade, terminate |
| Invoice | Invoices | Billing documents — retrieve and list (read-only) |
| Quoting | Quoting | Price simulation — compute the exact cost of an operation before executing it |
| Balance | Balance Lines | Credit/debit entries — create and list |
| Customer Address Billing | Customer Address Billing | Customer billing address — retrieve and update |
| Customer Payment Settings | Customer Payment Settings | Customer payment configuration — retrieve and update |

---

## Per-operation page structure

Each operation page contains:

**Center pane**
- Operation title and description
- Authorization note (if the operation requires authentication)
- Path parameters table (if any)
- Query parameters table (if any)
- Request body schema (if any) — field names, types, required flag, descriptions

**Right pane**
- Request code sample (curl by default; additional languages may be added)
- Response schema and example (JSON)
