# Technical Specification

This folder describes the technical choices and implementation details for the ProAbono API Live documentation website.

It contains everything that would change if the stack were replaced: framework selection, package configuration, build commands, deployment platform, and CI/CD pipeline. Stack-agnostic concerns belong in [../functional/](../functional/) and [../pipeline/](../pipeline/).

## Files

1. [stack.md](stack.md) — Docusaurus choice, OpenAPI plugins, Node.js, npm, build tool
2. [architecture.md](architecture.md) — Repo layout and build commands
3. [content-pipeline.md](content-pipeline.md) — `gen-api-docs` command, `package.json` scripts, plugin configuration, `sidebar.ts`
4. [navigation.md](navigation.md) — `_category_.json` format, `sidebars.js` configuration
5. [design.md](design.md) — CSS variable overrides, Prism configuration, logo configuration
6. [deployment.md](deployment.md) — Azure Static Web Apps settings, GitHub Actions workflow, secrets

## Related

- [../functional/](../functional/) — What the site shows to the user
- [../pipeline/](../pipeline/) — How content from the OpenAPI spec flows into the site
