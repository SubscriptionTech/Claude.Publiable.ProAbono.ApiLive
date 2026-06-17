# Stack

Framework and tooling choices for the ProAbono API Live documentation website.

## Choice: Docusaurus

**Use Docusaurus** as the static site framework. It is the best fit for the combination of Azure Static Web Apps hosting, build-time content from local files, and a developer documentation audience.

### Docusaurus

| Dimension | Assessment |
|---|---|
| Static output | Emits a `build/` directory. `output_location: build` in the Azure SWA pipeline config is all that is needed. Multiple tutorials and the official Azure SWA blog confirm this path. |
| Content from files | Plugins expose `loadContent()` (reads any local file at build time) and `createData()` (serializes data to static JSON for page props). No server runtime required. |
| Docs features | Sidebar navigation, breadcrumbs, and syntax-highlighted code blocks are available. **Note:** several of these require explicit plugin or theme configuration — they are not all active by default on a blank install. |
| Ecosystem | Maintained by Meta, powers a large share of open-source project docs. Active release cadence. |
| Learning curve | React + MDX. Moderate if the team has no React background, but the Docusaurus abstraction layer means React knowledge is rarely needed for content or configuration work. |

**Key caveat:** Sidebar navigation, search, and versioning are configurable features, not automatic defaults. Budget setup time for plugin configuration in Phase 3.

---

## API reference plugin

The API Reference section uses the following two packages:

| Package | Role |
|---|---|
| `docusaurus-plugin-openapi-docs` | CLI + plugin — reads the OpenAPI spec and generates MDX files via `docusaurus gen-api-docs` |
| `docusaurus-theme-openapi-docs` | Theme — renders the generated MDX with a 3-pane layout (sidebar / description / code samples) |

The plugin is configured in `docusaurus.config.js` to point at the OpenAPI spec and write output to `docs/api-reference/`. See [content-pipeline.md](content-pipeline.md) for the full configuration.

---

## Runtime and build tools

| Tool | Choice |
|---|---|
| Package manager | npm (default for Docusaurus) |
| Node.js | LTS (≥ 20) |
| Build command | `npm run build` |
| Output directory | `build/` |

---

## Sources

- [Docusaurus plugin lifecycle API](https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis)
- [Docusaurus deployment docs](https://docusaurus.io/docs/deployment)
- [Azure Static Web Apps — Next.js static export](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-static-export)
