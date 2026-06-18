# specs/backlog/ — Structure

This folder contains features deferred to future versions of the website. Each feature has its own file and an entry in [index.md](index.md).

## index.md entry

Each feature entry in `index.md` follows this format:

```markdown
## Feature Name

See [filename.md](filename.md).

One to three sentences describing the feature in plain language — what it adds,
why it was deferred, and what condition would trigger its implementation.
```

When adding a new backlog item, append its entry to `index.md` and keep the heading concise (title-case, no punctuation).

## Backlog file structure

Each backlog file has two parts, in order:

### 1. User section (HTML comment)

An HTML comment block at the very top, visible in the source but hidden in rendered Markdown. This is written for the human reader — it gives context about why the feature was deferred and when to act on it. Claude must skip this section entirely when implementing.

```markdown
<!-- ============================================================
FOR THE READER — Claude should skip this section entirely.

<Plain-language description of the feature: what it is, why it was
deferred, and what would trigger implementation. Written as if speaking
to the product owner, not to a developer.>
============================================================ -->
```

### 2. Implementation instructions (for Claude)

The rest of the file contains the instructions Claude needs to implement the feature. The top-level heading names the feature:

```markdown
# Implementation instructions — Feature Name
```

Instructions are split into the same three sections used throughout `specs/`:

- **`## Functional`** — what to build from the user's perspective. No stack details.
- **`## Pipeline`** — how content flows in or is triggered. No stack-specific config.
- **`## Technical`** — stack-specific details: file paths, config changes, commands.

Each section must also list which `specs/` spec files need updating as a result of the change (e.g. "Update `specs/functional/navigation.md` to…").
