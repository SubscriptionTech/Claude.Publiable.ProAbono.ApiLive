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

Ten resources, in display order:

| Tag | Display label | Description |
|-----|---------------|-------------|
| `customer` | Customers | End-customers — create, retrieve, list, suspend, anonymize |
| `offer` | Offers | Pricing plans — retrieve and list (read-only) |
| `feature` | Features | Offer components — retrieve and list (read-only) |
| `subscription` | Subscriptions | Customer/offer links — create, start, suspend, upgrade, terminate |
| `invoice` | Invoices | Billing documents — retrieve and list (read-only) |
| `balance-line` | Balance Lines | Credit/debit entries — create and list |
| `customer-address-billing` | Customer Address Billing | Customer billing address — retrieve and update |
| `customer-payment-settings` | Customer Payment Settings | Customer payment configuration — retrieve and update |
| `usage` | Usage | Feature access and consumption state — retrieve and update |
| `quoting` | Quoting | Price simulation — compute the exact cost of an operation before executing it |

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
