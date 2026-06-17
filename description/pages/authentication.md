# Page spec — Authentication

File: `website/docs/authentication/index.mdx`
Sidebar label: Authentication
Position: `sidebar_position: 1`

---

## Purpose

Explain how to authenticate against the ProAbono API Live: which scheme is used, where credentials come from, how to construct requests, and what errors to expect.

---

## Page structure

### 1. Intro paragraph

One sentence: the API uses **HTTP Basic Auth** — an Agent Key and an API Key encoded together in the `Authorization` header.

### 2. Getting your credentials

Tell the developer where to find the keys:

1. Log into the ProAbono backoffice.
2. Go to the **Integration** section.
3. Copy the **Agent Key** and the **API Key**.

Immediately follow with a `warning` admonition:

> Treat these keys like passwords. Store them in environment variables or a secrets manager — never commit them to source code.

### 3. Base URL

One sentence: the base URL is specific to your Business.

Table of environments (source: `convention.md`):

| Environment | Base URL |
|-------------|----------|
| Production | `https://api-<IdBusiness>.proabono.com/` |

`IdBusiness` is the internal numeric identifier of your Business, visible in the backoffice Integration section.

### 4. The Authorization header

Explain the encoding:

```
Authorization: Basic <base64(AgentKey:ApiKey)>
```

Then show tabbed code examples using a Docusaurus `<Tabs>` / `<TabItem>` component:

**curl** — the `-u` flag encodes automatically:
```bash
curl -u "<AgentKey>:<ApiKey>" \
  "https://api-<IdBusiness>.proabono.com/v1/Customer/1"
```

**JavaScript (browser or Node.js):**
```js
const credentials = btoa(`${process.env.PROABONO_AGENT_KEY}:${process.env.PROABONO_API_KEY}`);

const response = await fetch('https://api-<IdBusiness>.proabono.com/v1/Customer/1', {
  headers: { Authorization: `Basic ${credentials}` },
});
```

Add a `note` admonition: all requests and responses use `Content-Type: application/json`.

### 5. Auth-related error codes

Short table:

| Status | Meaning |
|--------|---------|
| `401 Unauthorized` | Credentials are missing or invalid |
| `403 Forbidden` | Credentials are valid but the action is not permitted |

Link to [Conventions](../concepts/conventions#http-status-codes) for the full list of HTTP status codes.

---

## Implementation notes

- All code samples must use placeholder values (`<AgentKey>`, `<ApiKey>`, `<IdBusiness>`) or environment variables — never real values.
- The `warning` admonition about key secrecy is mandatory.
- `btoa` is available in the browser and Node.js ≥ 16. For older Node.js, use `Buffer.from(...).toString('base64')` — add this as a `note` admonition alongside the JS example.
