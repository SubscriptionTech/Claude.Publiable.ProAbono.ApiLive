# Functional Specification

This folder describes the ProAbono API Live documentation website from the **user's perspective**: what pages exist, what they contain, what the navigation looks like, and what the visual design is.

Everything here is stack-agnostic. An implementer reading only this folder should understand *what* to build, not *how*.

## Shared DocApi files (read first)

See [`shared/DocApi/functional/index.md`](../../shared/DocApi/functional/index.md) for the full list of shared functional specifications (design, navigation, API reference layout).

## API Live overrides (read after DocApi)

| File | What it overrides or adds |
|------|--------------------------|
| [design.md](design.md) | Full design spec — identical to DocApi except site name is `"API Live \| Reference"` |
| [navigation.md](navigation.md) | Per-section page counts and sub-page labels (extends DocApi section order) |
| [pages/index.md](pages/index.md) — page-by-page specifications | |
| [pages/api-reference.md](pages/api-reference.md) | Resource inventory table — the ten resources this API exposes (extends DocApi layout) |

## Related

- [../pipeline/](../pipeline/) — How content from the OpenAPI spec flows into the site
- [../technical/](../technical/) — Framework, plugin configuration, build commands, and deployment
