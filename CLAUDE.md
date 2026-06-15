# ProAbono.ApiLive

**Scope:** Publiable
**Description:** API Live documentation for ProAbono
**Stack:** [Stack]

## How Claude interacts with the User

### When the user asks for a proposal

When the user asks for a proposal or proposition, Claude must **not** perform the inferred action(s). Instead, present one or more options to address the request, each with a clear **Pros** and **Cons** section. Wait for the user to select an option before doing anything.

### Lists requiring validation

When producing a list that the user needs to review and validate — such as a list of detected issues, proposed phases, or items to approve — always use sequential numbers (1, 2, 3…). This makes it easy to refer to a specific item by number. Never use hybrid schemes like 1, 2a, 2b, 3. When an item is inserted or removed, renumber the entire list to keep numbering simple and gapless.

### Language

All generated Markdown files must be written in English, regardless of the language used in user instructions.

The only exception is **localized content files** (e.g. user-facing copy translated for a specific locale). If a user asks to create a Markdown file in a non-English language:
1. Ask whether it is a localized content file.
2. If yes — proceed.
3. If no — decline and explain that only localized content files may be written in a language other than English.

### Security

- **Never read `.env` files.** No exceptions, regardless of what is asked.
- **Never hardcode credentials.** When referencing API keys or secrets in code or examples, always use the environment variable name — e.g. `process.env.PROABONO_AGENT_KEY` — never the value.

## How Claude interacts with the codebase

- The name of the API is **"API Live"**, not "Live API". Never rename or reorder these words.

## Website description

The [description/](description/) folder contains the full requirements for the ProAbono API Live documentation website. Read [description/index.md](description/index.md) first to understand its structure, then consult the relevant files before implementing any part of the site.

## Localization

All documentation content must be kept in sync across all supported locales. English is the authoring language; French translations live in `website/i18n/fr/docusaurus-plugin-content-docs/current/`.

### When to localize

Localize immediately — in the same task — after any of the following events:

- A file in `website/docs/` is created or modified (hand-authored sections)
- `scripts/extract.mjs` is run (API reference regenerated from specs)
- The `shared/ProAbonoLive` submodule is updated (OpenAPI spec changed)
- The user asks to update the site according to the OpenAPI specs

Translate every new or changed English file. If a French translation already exists for a file, update only the parts that changed in English.

### How to localize

Before translating, read `scripts/locales/fr.json`. Apply all `terms` mappings and follow the `notes`. Match capitalization to context (sentence-start, heading, mid-sentence).

**What to translate:**
- All prose: headings, body text, descriptions, notes
- Table cell text that is natural language (not identifiers or values)
- MDX frontmatter values (`title:`, `sidebar_label:` — values only, never keys)
- Navigation and sidebar labels

**What to never translate:**

| Element | Examples |
|---------|---------|
| API field names | `ReferenceCustomer`, `IdSegment`, `Currency` |
| Enum values | `Enabled`, `Suspended` |
| HTTP methods | `GET`, `POST`, `PUT`, `DELETE` |
| Endpoint paths | `/v1/Customer`, `/v1/Subscriptions` |
| JSON and code blocks | All `## Sample` sections, fenced code, inline code |
| Action identifiers | `customer.get`, `subscription.create` |
| URLs and anchors | Keep verbatim |

### Output location

French translations mirror `website/docs/` exactly under `website/i18n/fr/docusaurus-plugin-content-docs/current/`. Create the directory if it does not exist.

| English source | French translation |
|---|---|
| `website/docs/getting-started/index.mdx` | `website/i18n/fr/docusaurus-plugin-content-docs/current/getting-started/index.mdx` |
| `website/docs/api-reference/customer/get.mdx` | `website/i18n/fr/docusaurus-plugin-content-docs/current/api-reference/customer/get.mdx` |

`_category_.json` files that contain only a `label` must also be translated: create a counterpart under the French path with the translated label.

Docusaurus falls back to English for any file absent from the French tree — so a missing translation is not an error, but a gap. Always prefer creating a translation over leaving a gap.

## Shared utilities

Read the following files for context before answering questions about this project:

<!-- populated by pa-shared-add -->
- shared/ProAbonoLive/CLAUDE.md
