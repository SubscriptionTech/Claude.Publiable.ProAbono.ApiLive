# Page spec — Guides

Three pages: a section index and one page per cross-resource flow documented in `shared/ProAbonoLive/specs/actions.md`.

---

## Index page

File: `website/docs/guides/index.mdx`
Sidebar label: Guides
Position: `sidebar_position: 1`

One or two sentences: Guides walk through common multi-step workflows that span more than one API resource. Then a card grid or bulleted list linking to each guide.

---

## Guide 1 — Onboard a customer

File: `website/docs/guides/onboard-a-customer.mdx`
Sidebar label: Onboard a customer
Position: `sidebar_position: 2`
Source: `customer.onboard` in `shared/ProAbonoLive/specs/actions.md`

### Purpose

Show how to register a new customer and immediately subscribe them to an offer — the most common integration entry point.

### Page structure

#### 1. Overview

One paragraph: when a user signs up in the integrating application, two API calls to ProAbono are enough to create the customer record and start their subscription.

#### 2. Prerequisites

- An active Offer in the backoffice (you need its `ReferenceOffer`)
- API credentials (see [Authentication](../authentication/))

#### 3. Step 1 — Create the customer

`POST /v1/Customer`

Request body:
```json
{
  "ReferenceCustomer": "user-42",
  "Email": "bob@example.com",
  "Name": "Bob"
}
```

Show the `201 Created` response. Add a `note` admonition: the `Id` returned here is ProAbono's internal identifier — you can always use `ReferenceCustomer` in subsequent calls instead.

**curl example:**
```bash
curl -X POST "https://api-<IdBusiness>.proabono.com/v1/Customer" \
  -u "<AgentKey>:<ApiKey>" \
  -H "Content-Type: application/json" \
  -d '{
    "ReferenceCustomer": "user-42",
    "Email": "bob@example.com",
    "Name": "Bob"
  }'
```

Link to [Customers](../api-reference/customer/) for the full object schema and all available fields.

#### 4. Step 2 — Subscribe the customer

`POST /v1/Subscription`

Request body:
```json
{
  "ReferenceCustomer": "user-42",
  "ReferenceOffer": "plan-starter"
}
```

Show the `201 Created` response.

**curl example:**
```bash
curl -X POST "https://api-<IdBusiness>.proabono.com/v1/Subscription" \
  -u "<AgentKey>:<ApiKey>" \
  -H "Content-Type: application/json" \
  -d '{
    "ReferenceCustomer": "user-42",
    "ReferenceOffer": "plan-starter"
  }'
```

Link to [Subscriptions](../api-reference/subscription/) for all subscription fields and start options.

#### 5. What's next

- [Check usage](../api-reference/usage/) — verify which features the customer can now access
- [Get a quote first](../api-reference/quoting/) — simulate the subscription cost before creating it

---

## Guide 2 — Terminate & anonymize

File: `website/docs/guides/terminate-and-anonymize.mdx`
Sidebar label: Terminate & anonymize
Position: `sidebar_position: 3`
Source: `customer.terminate-and-anonymize` in `shared/ProAbonoLive/specs/actions.md`

### Purpose

Show how to end a customer's active subscription and erase their personal data — the GDPR right-to-erasure flow.

### Page structure

#### 1. Overview

Two sentences: GDPR requires being able to erase a customer's personal data on request. ProAbono supports this through a two-step flow: terminate the subscription first, then anonymize the customer.

#### 2. Step 1 — Terminate the subscription

The subscription can be identified by `ReferenceCustomer` (recommended) or by subscription `Id`.

Show the endpoint and a curl example. Add a `warning` admonition: termination is immediate by default — the subscription ends now, not at the next billing period. Check the Subscriptions reference for deferred termination options.

**curl example:**
```bash
curl -X DELETE \
  "https://api-<IdBusiness>.proabono.com/v1/Subscription?ReferenceCustomer=user-42" \
  -u "<AgentKey>:<ApiKey>"
```

Link to [Subscriptions](../api-reference/subscription/) for the full action reference.

#### 3. Step 2 — Anonymize the customer

Show the endpoint and a curl example. Add a `note` admonition: anonymization erases the customer's `Name` and `Email`. The `Id` and `ReferenceCustomer` are preserved for billing history integrity — invoices and balance lines remain accessible.

**curl example:**
```bash
curl -X POST \
  "https://api-<IdBusiness>.proabono.com/v1/Customer/Anonymize?ReferenceCustomer=user-42" \
  -u "<AgentKey>:<ApiKey>"
```

Link to [Customers](../api-reference/customer/) for the full action reference.

#### 4. What's next

- [Customers](../api-reference/customer/) — full customer resource reference
- [Subscriptions](../api-reference/subscription/) — all subscription lifecycle actions
