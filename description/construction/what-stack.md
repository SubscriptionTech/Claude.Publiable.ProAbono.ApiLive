# Stack

Framework and tooling choices for the ProAbono API Live documentation website.

## Recommendation: Docusaurus

**Use Docusaurus** as the static site framework. It is the best fit for the combination of multi-language support, Azure Static Web Apps hosting, build-time content from local files, and a developer documentation audience.

Astro with Starlight is a strong alternative and is documented below as a fallback if Docusaurus proves limiting.

---

## Framework comparison

### Docusaurus ✓ Selected

| Dimension | Assessment |
|---|---|
| i18n | First-class. Whole-document translation granularity (not sentence-split), declarative locale config in `docusaurus.config.js`, predictable filesystem layout at `website/i18n/[locale]/[pluginName]/`. |
| Static output | Emits a `build/` directory. `output_location: build` in the Azure SWA pipeline config is all that is needed. Multiple tutorials and the official Azure SWA blog confirm this path. |
| Content from files | Plugins expose `loadContent()` (reads any local file at build time) and `createData()` (serializes data to static JSON for page props). No server runtime required. |
| Docs features | Sidebar navigation, breadcrumbs, syntax-highlighted code blocks, and a locale dropdown are available. **Note:** several of these require explicit plugin or theme configuration — they are not all active by default on a blank install. |
| Ecosystem | Maintained by Meta, powers a large share of open-source project docs. Active release cadence. |
| Learning curve | React + MDX. Moderate if the team has no React background, but the Docusaurus abstraction layer means React knowledge is rarely needed for content or configuration work. |

**Key caveat:** Sidebar navigation, search, and versioning are configurable features, not automatic defaults. Budget setup time for plugin configuration in Phase 3.

---

### Astro + Starlight (alternative)

| Dimension | Assessment |
|---|---|
| i18n | Built-in since Astro v3.5. Only two mandatory config fields (`locales`, `defaultLocale`). No third-party plugin needed (prior plugins are abandoned). Domain-based locale routing is server-only and unavailable for static export — not relevant here. |
| Static output | Fully static output compatible with Azure Static Web Apps. |
| Content from files | Content Collections with the `glob()` loader. Supports Markdown, MDX, Markdoc, JSON, YAML, and TOML at build time. Zod schema validation causes build-time errors on invalid entries. `getCollection()` and `getEntry()` integrate with `getStaticPaths()` for static route generation. |
| Docs features | Starlight ships Pagefind full-text search, sidebars, and light/dark mode **preconfigured with no manual activation**. This is a notable advantage over Docusaurus for time-to-usable-site. |
| Ecosystem | Growing; Starlight is actively developed by the Astro team. Component-agnostic (no framework lock-in). |
| Learning curve | Lower than Docusaurus for teams without a React background. Astro's component syntax is approachable. |

**Use this instead of Docusaurus if:** the team wants more out-of-the-box docs UI, prefers Astro's component model, or finds Docusaurus plugin configuration overhead too high.

---

### VitePress (not recommended)

Built-in i18n via a directory-based structure and a `locales` config object — no plugin needed. Build-time data loaders (`.data.js` / `.data.ts` files with an exported `load()` method) are clean and well-documented.

**Disqualifying issue:** VitePress does not automatically redirect `/` to `/en/` or another locale path. Server-side redirect configuration is required. On Azure Static Web Apps this can be worked around via `staticwebapp.config.json` routes, but this adds complexity. Avoid unless the team is Vue-native and willing to manage this gap.

---

### Next.js static export (not recommended)

Technically viable, but requires an explicit `IS_STATIC_EXPORT=true` environment variable in the Azure SWA CI pipeline — otherwise the deployment platform treats the app as hybrid-rendered. Adds full React framework complexity (routing, layouts, data fetching conventions) that is disproportionate for a documentation site. No documentation-specific features out of the box.

---

### Plain static HTML (not viable)

Lacks the content pipeline, templating, and i18n infrastructure needed to manage a multi-language, multi-page documentation site from structured intermediate files. Not viable at this scale.

---

## Runtime and build tools

| Tool | Choice |
|---|---|
| Package manager | npm (default for Docusaurus) |
| Node.js | LTS (current: 22.x) |
| Build command | `npm run build` |
| Output directory | `build/` |

---

## Sources

Findings are based on adversarial verification (102 agents, 25 claims verified, 17 confirmed) against primary documentation sources:

- [Docusaurus i18n docs](https://docusaurus.io/docs/i18n/introduction)
- [Docusaurus plugin lifecycle API](https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis)
- [Docusaurus deployment docs](https://docusaurus.io/docs/deployment)
- [Azure Static Web Apps — Next.js static export](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs-static-export)
- [Astro i18n guide](https://docs.astro.build/en/guides/internationalization/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [VitePress i18n guide](https://vitepress.dev/guide/i18n)
- [VitePress data loading](https://vitepress.dev/guide/data-loading)
- [Starlight site search](https://starlight.astro.build/guides/site-search/)
