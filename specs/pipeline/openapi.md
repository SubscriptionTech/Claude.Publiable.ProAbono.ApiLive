# OpenAPI Pipeline

How the OpenAPI spec flows into the API Reference section of the website.

## Overview

```
shared/ProAbonoLive/open-api/pa-live-openapi-3.0.3.yaml
          ↓
   content generation tool      (run locally, output committed)
          ↓
API Reference pages  (generated — do not edit manually)
```

The generation tool reads the OpenAPI spec and produces one page per operation. See the [technical specifications](../technical/index.md) for the command, tool configuration, and sidebar details.

## Source

The single source for the API reference is the OpenAPI spec:

```
shared/ProAbonoLive/open-api/pa-live-openapi-3.0.3.yaml
```

This spec is kept in sync with the markdown resource docs in `shared/ProAbonoLive/resources/` (see the submodule's CLAUDE.md). It already excludes `Documented: no` actions — no additional filtering step is needed.

## Output

The pipeline writes generated pages into the API Reference section of the site. These pages must not be edited manually — they will be overwritten on the next generation run. See the [technical specifications](../technical/index.md) for the exact output location and file format.

## CI constraint

The `shared/ProAbonoLive` submodule is **not** checked out in CI. The generated pages must be committed to the repo before pushing. CI builds the site from the committed files — the generation command is never executed in CI.
