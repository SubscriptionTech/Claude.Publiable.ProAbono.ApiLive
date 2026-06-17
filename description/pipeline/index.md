# Pipeline Specification

This folder describes the processes that feed the website with content from the ProAbono API specs.

It covers: what triggers content generation, what the inputs are, what the outputs are, where they land in the repo, and what CI constraints apply. It is free of stack-specific configuration details — those belong in [../technical/](../technical/).

## Files

1. [openapi.md](openapi.md) — OpenAPI spec as source, generation tool, output, CI constraint
2. [authoring.md](authoring.md) — Hand-written sections and shared/ProAbonoLive source files used for authoring

## Related

- [../functional/](../functional/) — What the site shows to the user
- [../technical/](../technical/) — The generation command, tool configuration, and sidebar details
