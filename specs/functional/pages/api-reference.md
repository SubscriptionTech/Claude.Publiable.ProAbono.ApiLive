# Page spec — API Reference

The API Reference section contains one page per API operation. How these pages are produced is described in the [pipeline specifications](../../pipeline/index.md); how they are rendered is described in the [technical specifications](../../technical/index.md).

For the layout definition and per-operation page structure, see `shared/DocApi/functional/api-reference-layout.md`.

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
| Balance | Balance | Credit/debit entries — create and list |
| Customer Address Billing | Customer Address Billing | Customer billing address — retrieve and update |
| Customer Payment Settings | Customer Payment Settings | Customer payment configuration — retrieve and update |

