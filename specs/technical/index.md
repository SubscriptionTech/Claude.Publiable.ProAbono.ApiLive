# Technical Specification

This folder describes the technical choices and implementation details for the ProAbono API Live documentation website.

It contains everything that would change if the stack were replaced: framework selection, package configuration, build commands, deployment platform, and CI/CD pipeline. Stack-agnostic concerns belong in [../functional/](../functional/) and [../pipeline/](../pipeline/).

## Shared DocApi files (read first)

See [`shared/DocApi/technical/index.md`](../../shared/DocApi/technical/index.md) for the full list of shared technical specifications (stack, architecture, content pipeline, navigation, design, deployment).

## API Live overrides (read after DocApi)

| File | What it overrides or adds |
|------|--------------------------|
| [architecture.md](architecture.md) | Specific paths: `shared/ProAbonoLive/` submodule, `pa-live-openapi-3.0.3.yaml` spec filename |
| [content-pipeline.md](content-pipeline.md) | Specific values: plugin `id: 'api'`, `specPath`, `outputDir` |
| [navigation.md](navigation.md) | Specific `dirName` values for each section |
| [deployment.md](deployment.md) | Root redirect URL `/docs/introduction/` |

Files not listed (stack, design) have no API Live overrides — DocApi is the full specification for those.

## Related

- [../functional/](../functional/) — What the site shows to the user
- [../pipeline/](../pipeline/) — How content from the OpenAPI spec flows into the site
