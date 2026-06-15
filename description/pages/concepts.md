# Page spec — Concepts

Two pages live under this section.

---

## Page 1 — Core Concepts

File: `website/docs/concepts/index.mdx`
Sidebar label: Core Concepts
Position: `sidebar_position: 1`

### Purpose

Introduce the ProAbono data model. Help developers understand the entities and their relationships before they start making API calls.

### Page structure

#### 1. Intro paragraph

Two sentences: ProAbono is a subscription billing platform. The following entities are the building blocks of every integration.

#### 2. Entity hierarchy

A brief prose description of the relationship chain:

> A **Business** sells a product. It is partitioned into one or more **Segments** (by region, customer type, currency, etc.). Each **Segment** has a catalog of **Offers**. A **Customer** subscribes to an **Offer**, creating a **Subscription**. Subscriptions generate **Invoices** and **Balance Lines** during billing. **Features** define what a subscription grants access to; **Usage** reflects the current state of that access for a customer. Before making a billing change, a developer can request a **Quote** to see the exact cost.

#### 3. Entity glossary

Table: Entity, Description, API resource.

| Entity | Description | Resource |
|--------|-------------|----------|
| Business | A tenant — represents one subscription-based product sold through ProAbono. Data is fully partitioned per Business. | (not a public API resource) |
| Segment | A sub-division of a Business with its own currency, billing rules, and offers catalog. | (not a public API resource) |
| Customer | An end-customer — the recipient and/or buyer of a subscription. | [Customers](../api-reference/customer/) |
| Offer | A pricing plan. Subscribing a Customer to an Offer creates a Subscription. "Plan" and "Offer" are synonyms. | [Offers](../api-reference/offer/) |
| Feature | A component of an Offer: **on/off** (binary access), **limitation** (non-resetting quota), or **consumption** (quota reset at each renewal). | [Features](../api-reference/feature/) |
| Subscription | Links an Offer to up to two Customers: a **recipient** (who consumes the service) and a **buyer** (who is billed). | [Subscriptions](../api-reference/subscription/) |
| Invoice | A billing document. Only the buyer of a subscription has related invoices. | [Invoices](../api-reference/invoice/) |
| Balance Line | A credit or debit entry in the customer's billing history. | [Balance Lines](../api-reference/balance-line/) |
| Usage | A snapshot of which Features a Customer can access and at what quantity. | [Usage](../api-reference/usage/) |
| Quoting | A cost estimate for a billing operation (subscribe, upgrade, etc.) computed before it is executed. | [Quoting](../api-reference/quoting/) |

#### 4. Shared identifiers

Introduce the `Reference*` pattern: developers can assign their own identifiers to link ProAbono resources to counterparts in their own system (e.g. `ReferenceCustomer=user-42`). If none is provided, ProAbono generates one automatically.

Resources with a shared identifier:

| Resource | Field | Typical use |
|----------|-------|-------------|
| Customer | `ReferenceCustomer` | Mapped to the user or account in the integrating application |
| Feature | `ReferenceFeature` | Mapped to a protected feature or capability in the application |
| Offer | `ReferenceOffer` | Used to start a welcome/trial subscription at signup, or for analytics |
| Segment | `ReferenceSegment` | Used to partition customers by type, region, etc. |

Add a `tip` admonition: once set, a shared reference can be used in place of the internal `Id` in any API call targeting that resource.

#### 5. Next steps

Two links:
- [Conventions](./conventions) — field naming, pagination, dates, amounts, and error shapes
- [API Reference](../api-reference/) — per-resource endpoint documentation

---

## Page 2 — Conventions

File: `website/docs/concepts/conventions.mdx`
Sidebar label: Conventions
Position: `sidebar_position: 2`

### Purpose

Reference page for cross-cutting technical conventions: field naming, special types, pagination, localization, HTTP status codes, and error response shapes.

### Page structure

#### 1. Field naming

- All fields use **PascalCase** (e.g. `ReferenceCustomer`, `DateCreated`).
- Shared identifier fields are prefixed with `Reference` (e.g. `ReferenceCustomer`).
- Internal identifier fields: `Id` (the resource's own ID) or `Id<Resource>` (a foreign key, e.g. `IdSubscription`).

#### 2. Special field types

Table:

| Value type | JSON type | Format / example |
|------------|-----------|-----------------|
| Date | string | ISO 8601 — `"2025-01-31T00:00:00Z"` |
| Amount | integer | Smallest currency unit (cents) — `1999` = €19.99 |
| Currency | string | ISO 4217 — `"EUR"`, `"USD"` |
| Country | string | ISO 3166-1 alpha-2 — `"FR"`, `"US"` |
| Region | string | ISO 3166-2 — only for US, Canada (`CA`), Spain (`ES`) |
| Language | string | ISO 639 code or locale — `"fr"`, `"fr-FR"` |

#### 3. Common object fields

Every resource object includes these fields:

| Field | Type | Description |
|-------|------|-------------|
| `Id` | integer | Internal numeric identifier |
| `Links` | array | HATEOAS links to related resources |

`Links` format:
```json
"Links": [
  { "rel": "self", "href": "/v1/Customer/42" }
]
```

#### 4. Pagination

All list endpoints accept:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `Page` | `1` | 1-based page index |
| `SizePage` | `10` | Items per page (max: 1000). Pass `0` to get only the total count without fetching items. |

Paginated response shape:
```json
{
  "Count": 10,
  "Page": 1,
  "SizePage": 10,
  "TotalItems": 42,
  "DateGenerated": "2025-01-31T00:00:00Z",
  "Items": [ ... ]
}
```

| Field | Description |
|-------|-------------|
| `Count` | Items returned in this page |
| `TotalItems` | Total matching items across all pages |
| `DateGenerated` | When this list was generated |

#### 5. Localization

Some fields (`TitleLocalized`, `DescriptionLocalized`) are resolved through a four-level fallback chain:

| Priority | Source | Condition |
|----------|--------|-----------|
| 1 | `?lang=` query parameter | Always takes precedence when provided |
| 2 | Customer language | When the request targets a specific customer |
| 3 | Segment language | When the request targets a specific segment |
| 4 | Business language | Catch-all default |

The `lang` value follows the language format above (`"fr"`, `"fr-FR"`, etc.).

#### 6. HTTP status codes

| Code | Meaning |
|------|---------|
| `200` | OK — success, body contains the resource |
| `201` | Created — resource created, body contains the new resource |
| `204` | No content — success, no body |
| `400` | Bad request — general client error |
| `401` | Unauthorized — credentials missing or invalid |
| `403` | Forbidden — credentials valid but action not permitted |
| `404` | Not found — resource does not exist |
| `409` | Conflict — duplicate reference or state conflict |
| `422` | Unprocessable entity — validation errors (see error shape below) |
| `500` | Internal server error |

#### 7. Error response shapes

All non-422 errors return a single object:
```json
{
  "Code": "string",
  "Message": "Human-readable description",
  "Exception": "string",
  "Target": "string"
}
```
`Exception` is only present on some `500` errors. `Target` is rarely returned; it identifies the field or resource at fault.

`422` responses return an **array** of error objects:
```json
[
  { "Code": "string", "Message": "string", "Target": "string" }
]
```
