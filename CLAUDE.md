# ProAbono.ApiLive

**Scope:** Publiable
**Description:** API Live documentation for ProAbono
**Stack:** React + Docusaurus

## How Claude interacts with the User

### When the user asks for a proposal

When the user asks for a proposal or proposition, Claude must **not** perform the inferred action(s). Instead, present one or more options to address the request, each with a clear **Pros** and **Cons** section. Wait for the user to select an option before doing anything.

### Lists requiring validation

When producing a list that the user needs to review and validate — such as a list of detected issues, proposed phases, or items to approve — always use sequential numbers (1, 2, 3…). This makes it easy to refer to a specific item by number. Never use hybrid schemes like 1, 2a, 2b, 3. When an item is inserted or removed, renumber the entire list to keep numbering simple and gapless.

### Working with specs

- **Local specs** are the specs located in the root `specs/` folder of this project.
- **Shared specs** are specs located inside a `shared/` folder. When multiple shared utilities have been added, the name of the shared utility is used for disambiguation (e.g. "the DocApi specs").

When the user asks to do anything with the specs, default to the local specs unless they explicitly reference a shared utility by name or are currently working on a file inside a shared folder. If there is any doubt, ask the user which specs to update.

### Language

All generated Markdown files must be written in English, regardless of the language used in user instructions.

The only exception is **localized content files** (e.g. user-facing copy translated for a specific locale). If a user asks to create a Markdown file in a non-English language:
1. Ask whether it is a localized content file.
2. If yes — proceed.
3. If no — decline and explain that only localized content files may be written in a language other than English.

### Security

- **Never read `.env` files.** No exceptions, regardless of what is asked.
- **Never hardcode credentials.** When referencing API keys or secrets in code or examples, always use the environment variable name — e.g. `process.env.PROABONO_AGENT_KEY` — never the value.

## Commands

### `/update-the-website`

When the user says **"update the website"** (or any close paraphrase), invoke the `/update-the-website` skill immediately — do not paraphrase or summarize what it does first.

## How Claude interacts with the codebase

- The name of the API is **"API Live"**, not "Live API". Never rename or reorder these words.

### Website and specs sync

The website and the `specs/` folder must stay in sync:

- **When updating the website**, update the specs accordingly. Determine which specs file(s) need updating based on the nature of the change — respecting the split between `functional/`, `pipeline/`, and `technical/` subfolders. If the right location is not obvious, ask the user with proposals before acting.
- **When updating the specs**, update the website accordingly. If information is missing to implement the website change, ask the user before proceeding.

When implementing or auditing the website, local specs in `specs/` always take precedence over shared DocApi specs for the same topic. Where a local functional page spec exists (e.g. `specs/functional/pages/introduction.md`), it is the sole authoritative source for that page's content — the shared DocApi spec for that topic is superseded.

## Website specs

The [specs/](specs/) folder contains the full requirements for the ProAbono API Live documentation website. Read [specs/index.md](specs/index.md) first to understand its structure, then consult the relevant files before implementing any part of the site.

## Shared utilities

Read the following files for context before answering questions about this project:

<!-- populated by pa-shared-add -->
- shared/DocApi/CLAUDE.md
- shared/ProAbonoLive/CLAUDE.md
- shared/ProAbonoBO/CLAUDE.md
