# Pipeline Specification

This folder describes the processes that feed the website with content from the ProAbono API specs.

It covers: what triggers content generation, what the inputs are, what the outputs are, where they land in the repo, and what CI constraints apply. It is free of stack-specific configuration details — those belong in [../technical/](../technical/).

## Shared DocApi files (read first)

See [`shared/DocApi/pipeline/index.md`](../../shared/DocApi/pipeline/index.md) for the full list of shared pipeline specifications (generic OpenAPI pipeline pattern, CI constraint).

## API Live overrides (read after DocApi)

| File | What it overrides or adds |
|------|--------------------------|
| [openapi.md](openapi.md) | Specific source spec path (`shared/ProAbonoLive/open-api/pa-live-openapi-3.0.3.yaml`) and output directory |
| [authoring.md](authoring.md) | Hand-written sections and `shared/ProAbonoLive` source files used for authoring |

## Related

- [../functional/](../functional/) — What the site shows to the user
- [../technical/](../technical/) — The generation command, tool configuration, and sidebar details
