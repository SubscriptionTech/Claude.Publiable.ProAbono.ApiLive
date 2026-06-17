# Authoring Pipeline

How non-API-reference content is sourced from the shared/ProAbonoLive specs.

## Authored sections

The following sections are hand-written directly in this repo:

| Section | Source |
|---------|--------|
| Introduction | Authored in this repo |
| Getting started | Authored in this repo |
| Authentication | Authored in this repo |
| Concepts | Authored in this repo |
| Guides | Authored in this repo |

## Source files

The following files in `shared/ProAbonoLive` are referenced when authoring but are not consumed by the generation tool:

| File | Used for |
|------|----------|
| `shared/ProAbonoLive/resources/` | Source markdown — used for authoring and kept in sync with the spec |
| `shared/ProAbonoLive/specs/` | Authoring conventions — internal use only |
| `shared/ProAbonoLive/specs/enum.md` | Authoring Concepts pages |
| `shared/ProAbonoLive/specs/convention.md` | Authoring Authentication pages |
| `shared/ProAbonoLive/specs/actions.md` | Cross-resource flows — authoring Guides |
