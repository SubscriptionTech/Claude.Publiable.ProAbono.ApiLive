# Functional Specification

This folder describes the ProAbono API Live documentation website from the **user's perspective**: what pages exist, what they contain, what the navigation looks like, and what the visual design is.

Everything here is stack-agnostic. An implementer reading only this folder should understand *what* to build, not *how*.

## Shared DocApi files (read first)

See [`shared/DocApi/functional/CLAUDE.md`](../../shared/DocApi/functional/CLAUDE.md) for the full list of shared functional specifications.

## Project overrides

- [navigation.md](navigation.md) — per-section page maps and page labels (extends the DocApi section order)
- [pages/CLAUDE.md](pages/CLAUDE.md) — page-by-page specifications

## Related

- [../pipeline/](../pipeline/) — How content from the OpenAPI spec flows into the site
- [../technical/](../technical/) — Framework, plugin configuration, build commands, and deployment
