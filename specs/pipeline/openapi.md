# OpenAPI Pipeline

How the OpenAPI spec flows into the API Reference section of the website.

For the general pipeline architecture pattern and CI constraint, see `shared/DocApi/pipeline/openapi.md`.

## Source

The single source for the API reference is the OpenAPI spec:

```
shared/ProAbonoLive/open-api/pa-live-openapi-3.0.3.yaml
```

This spec is kept in sync with the markdown resource docs in `shared/ProAbonoLive/resources/` (see the submodule's CLAUDE.md). It already excludes `Documented: no` actions — no additional filtering step is needed.


