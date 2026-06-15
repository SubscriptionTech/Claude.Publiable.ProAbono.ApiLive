# Page spec — Getting Started

File: `website/docs/getting-started/index.mdx`
Sidebar label: Quick Start
Position: `sidebar_position: 1`

---

## Purpose

Get a developer from zero to a successful API call in under 5 minutes. Assumes they have a ProAbono backoffice account and an active Business.

---

## Page structure

### 1. Intro paragraph

Two to three sentences: what the ProAbono API Live is and what a developer can do with it (create customers, manage subscriptions, check usage, simulate costs). Keep it practical — no marketing language.

### 2. Prerequisites

Short bulleted list:

- A ProAbono backoffice account with an active Business
- Your **Agent Key** and **API Key** — find them in the backoffice under **Integration**
- Your **Business ID** (`IdBusiness`) — also in the Integration section

### 3. Step 1 — Identify your base URL

Introduce the per-Business base URL pattern:

```
https://api-<IdBusiness>.proabono.com/
```

Mention the pre-production variant (`pp-api-`) for testing. Link to [Authentication](../authentication/) for the full environment table.

### 4. Step 2 — Create a customer

Show a `curl` example as the primary code block. Include a Node.js `fetch` tab as the secondary option using a Docusaurus `<Tabs>` / `<TabItem>` component.

**curl:**
```bash
curl -X POST "https://api-<IdBusiness>.proabono.com/v1/Customer" \
  -u "<AgentKey>:<ApiKey>" \
  -H "Content-Type: application/json" \
  -d '{
    "ReferenceCustomer": "user-1",
    "Email": "alice@example.com",
    "Name": "Alice"
  }'
```

**Node.js:**
```js
const credentials = btoa(`${process.env.PROABONO_AGENT_KEY}:${process.env.PROABONO_API_KEY}`);

const response = await fetch('https://api-<IdBusiness>.proabono.com/v1/Customer', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ReferenceCustomer: 'user-1',
    Email: 'alice@example.com',
    Name: 'Alice',
  }),
});
const customer = await response.json();
```

Add a `tip` admonition: `curl -u` handles Base64 encoding automatically. For any other HTTP client, encode `AgentKey:ApiKey` in Base64 and set `Authorization: Basic <encoded>`.

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

Three items as a card grid or bulleted list:

- **[Authentication](../authentication/)** — full auth details and all environment URLs
- **[Concepts](../concepts/)** — understand the data model before integrating further
- **[API Reference](../api-reference/)** — all resources and their endpoints

---

## Implementation notes

- Use placeholder values throughout — never hardcode real credentials or real IDs.
- The Node.js example must reference `process.env.PROABONO_AGENT_KEY` and `process.env.PROABONO_API_KEY`.
- Tabs for curl / Node.js use the standard Docusaurus `<Tabs>` component (imported from `@theme/Tabs`).
