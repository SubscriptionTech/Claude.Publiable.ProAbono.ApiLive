# Technical Specification

This folder describes the technical choices and implementation details for the ProAbono API Live documentation website.

It contains everything that would change if the stack were replaced: framework selection, package configuration, build commands, deployment platform, and CI/CD pipeline.

## Shared DocApi files (read first)

See [`shared/DocApi/technical/CLAUDE.md`](../../shared/DocApi/technical/CLAUDE.md) for the full list of shared technical specifications.

## Project overrides

### OpenAPI plugin configuration

The configuration key of `docusaurus-plugin-openapi-docs`, under its `config` option, is `proabono` (the DocApi template uses `api`). The plugin `id` and the `outputDir` keep their DocApi values.

### OpenAPI spec version in `specPath`

The `specPath` of the `docusaurus-plugin-openapi-docs` plugin, in `website/docusaurus.config.js`, points to the current version of the OpenAPI spec. The config is the only place that holds the actual file path. That version is the current file version of the OpenAPI spec, from which its file name is built.

A new version of the OpenAPI spec is a new file, and the previous files stay in the submodule, so `specPath` does not move to a new version on its own. Before regenerating the API reference, compare the version in `specPath` with the current file version. When they differ, ask the user before pointing `specPath` at the new file.

### Deployment

| Item | Value |
|------|-------|
| Workflow file | `.github/workflows/azure-static-web-apps-nice-ground-08a335503.yml` |
| Deployment token secret | `AZURE_STATIC_WEB_APPS_API_TOKEN_NICE_GROUND_08A335503` |

## Related

- [../functional/](../functional/) — What the site shows to the user
- [../pipeline/](../pipeline/) — How content from the OpenAPI spec flows into the site
