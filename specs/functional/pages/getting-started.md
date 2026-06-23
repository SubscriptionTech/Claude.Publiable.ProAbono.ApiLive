# Page spec — Getting Started

Sidebar label: Quick Start

---

## Purpose

Get a developer from zero to a successful API call in under 5 minutes. Assumes they have a ProAbono backoffice account and an active Business.

---

## Page structure

### 1. Intro paragraph

One sentence: what the ProAbono API Live lets a developer do (create customers, start or update subscriptions, check feature access, calculate billing costs). Keep it practical — no marketing language.

### 2. Prerequisites

Short bulleted list:

- A ProAbono account with an active Business
- Your **Agent Key** and **API Key** — find them in the backoffice under **Integration**
- Your **Business ID** (`IdBusiness`) — also in the Integration section

### 3. Step 1 — Identify your base URL

Introduce the per-Business base URL pattern:

```
https://api-<IdBusiness>.proabono.com/
```

Link to [Authentication](../authentication/) for authentication details.

### 4. Step 2 — Create a customer

Display a code generator showing an example POST request to create a customer (`ReferenceCustomer: "user-1"`, `Email: "alice@example.com"`, `Name: "Alice"`). The generator should support multiple languages; curl must be available.

### 5. Step 3 — Inspect the response

Show the expected `201 Created` response with a trimmed Customer object:

```json
{
  "Id": 42,
  "ReferenceCustomer": "user-1",
  "Email": "alice@example.com",
  "Name": "Alice",
  "Status": "Enabled",
  "Links": [{ "rel": "self", "href": "/v1/Customer/42" }]
}
```

One sentence pointing to the [Customers](../api-reference/customer/) reference for the full object schema.

### 6. Next steps

Three items as a bulleted list:

- **[Authentication](../authentication/)** — full auth details and all environment URLs
- **[Concepts](../concepts/)** — understand the data model before integrating further
- **[API Reference](../api-reference/)** — all resources and their endpoints

---

## Implementation notes

- Use placeholder values throughout — never hardcode real credentials or real IDs.
