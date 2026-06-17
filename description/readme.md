# Description — README

This folder contains the full requirements for the ProAbono API Live documentation website.

Read [index.md](index.md) first to understand its structure, then consult the relevant files before implementing any part of the site.

---

## Site Maintenance

### Regenerate API reference from OpenAPI spec

Use this prompt to regenerate the API reference pages after updating the `shared/ProAbonoLive` submodule.

**When to use:** after pulling a new version of the submodule, to update the API reference pages from the latest OpenAPI spec.

**Prompt:**

```
Regenerate the API reference from the OpenAPI spec.

Run the generation command from the website folder: `npm run gen-api-docs`

Do not edit the generated files manually — they will be overwritten on the next run.
```

---

### Sync audit — description vs. website

Use this prompt to find and resolve discrepancies between this description folder and the actual website source.

**When to use:** after making changes to either the description or the website, to keep both in sync.

**Prompt:**

```
Audit the description folder against the actual website, then walk me through each discrepancy.

Steps:
1. Read description/index.md to understand the description structure, then read all relevant description files.
2. Read the website source (website/src/, website/static/, and any config files) to understand what is actually built.
3. Produce a complete numbered list of discrepancies — things where the description says X but the website does Y (or vice versa).
4. Present discrepancy #1 only: describe what the description says, what the website actually does, and propose two options — fix the description to match the website, or fix the website to match the description. Ask me which to apply.
5. Wait for my decision, apply it if needed, then move to #2, and so on until the list is exhausted.

Do not batch or pre-apply fixes. One discrepancy at a time, wait for my go-ahead each time.
```
