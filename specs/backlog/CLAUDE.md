# Backlog

Rules for everything located in `specs/backlog/`. Read this file before creating, reading, updating, or implementing a backlog.

## What a backlog is

A backlog is a feature or an improvement that has **deliberately been postponed** to a later version.

A backlog is never a bug. Something that does not behave as its spec states is a defect and is fixed, not deferred. When the user asks to backlog something that is a defect, say so and wait for their confirmation before writing the file.

## Layout

- One file per deferred feature or improvement, at `specs/backlog/<short-description>.md`.
- `<short-description>` is a short description of the content of the file — 1 to 5 words, kebab-case.
- `specs/backlog/index.md` is the detailed list of the backlogs. It is the only index; there is no other list anywhere.
- `specs/backlog/CLAUDE.md` — this file — is not a backlog and never appears in the index.

## Adding a backlog

Two writes, always performed together: the backlog file, and its entry in `specs/backlog/index.md`. A backlog file without an index entry, or an index entry without a file, is a defect.

### 1. The backlog file

It opens with a front matter holding exactly these three keys:

```yaml
---
title: The full title of the feature or improvement
stake: What this feature brings — the value it delivers, not the work it takes
description: A detailed description, written for the user, of what the feature is
---
```

The rest of the file is addressed to Claude: it tells Claude how to implement the feature, in two sections.

- **Context** — what is assumed to hold at the time the backlog is implemented: the state of the product, the concepts the feature builds on, the decisions already settled, and the ones left open.
- **Instructions** — the general instructions for the implementation: the behaviour to obtain, the constraints to respect, the cases to cover, and what is explicitly out of scope.

### 2. The index entry

`specs/backlog/index.md` lists every backlog, one entry per backlog, each with a link to its file, its `title`, and its `stake`. When no backlog exists, the index states that no backlog exists and holds no entry.

## How a backlog is written

- **It is a specification, not an implementation diff.** Never paste a patch, a diff, or the final code into a backlog. A short snippet is allowed only when it defines something prose cannot state exactly — a data shape, a message format — never as code to apply as-is.
- **It describes *what* and *why*, precisely enough to be implemented months later by someone with no memory of the conversation that created it.** Every term, entity, spec section, and finding it relies on is named in the file itself. A reference to "the previous point", "the rule discussed above", or "what you asked" is a defect: the file is context-less by construction.
- **It does not reference a specific file, and it does not give narrow instructions on how to implement the feature.** By the time the backlog is processed, the rest of the specs may have changed: a file may have been renamed, split, or removed. Describe the behaviour and the constraints, and let the implementer locate the code. Naming a concept defined in the specs is fine; naming the file that currently holds it is not.
- **It is written in English**, like every other Markdown file of this project.

## Referencing a backlog

`index.md` is the only file that may link to a backlog.

## Implementing a backlog

Implement a backlog only when the user asks for it, and only the ones they name. The presence of a backlog is never, on its own, a reason to act on it.

Once implemented, the specs are updated to describe the feature as a normal part of the product, then the backlog file is deleted and its entry removed from the index — both in the same operation.
