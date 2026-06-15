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

### Security

- **Never read `.env` files.** No exceptions, regardless of what is asked.
- **Never hardcode credentials.** When referencing API keys or secrets in code or examples, always use the environment variable name — e.g. `process.env.PROABONO_AGENT_KEY` — never the value.

## How Claude interacts with the codebase

- The name of the API is **"API Live"**, not "Live API". Never rename or reorder these words.

## Website description

The [description/](description/) folder contains the full requirements for the ProAbono API Live documentation website. Read [description/index.md](description/index.md) first to understand its structure, then consult the relevant files before implementing any part of the site.

## Shared utilities

Read the following files for context before answering questions about this project:

<!-- populated by pa-shared-add -->
- shared/ProAbonoLive/CLAUDE.md
