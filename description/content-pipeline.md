# Content Pipeline

How API reference content is generated from the OpenAPI spec and made ready for the Docusaurus build.

## Overview

```
shared/ProAbonoLive/shared-specs/pa-live-openapi-3.0.3.yaml
          ↓
   docusaurus gen-api-docs all      (run locally, output committed)
          ↓
website/docs/api-reference/
  (plugin-generated MDX files — do not edit manually)
```

The tool is `docusaurus-plugin-openapi-docs`. It reads the OpenAPI spec and writes one MDX file per endpoint group, formatted for the `docusaurus-theme-openapi-docs` 3-pane layout.

## Running the generation

```bash
cd website
npm run gen-api-docs
```

Add a `gen-api-docs` script to `website/package.json`:

```json
"scripts": {
  "gen-api-docs": "docusaurus gen-api-docs all",
  "clean-api-docs": "docusaurus clean-api-docs all"
}
```

Run from the `website/` folder. Re-run whenever `shared/ProAbonoLive` is updated. Commit the output before pushing.

## Source

The single source is the OpenAPI spec:

```
shared/ProAbonoLive/shared-specs/pa-live-openapi-3.0.3.yaml
```

This spec is kept in sync with the markdown resource docs in `shared/ProAbonoLive/resources/` (see the submodule's CLAUDE.md). It already excludes `Documented: no` actions — no additional filtering step is needed.

## Plugin configuration

In `website/docusaurus.config.js`:

```js
plugins: [
  [
    'docusaurus-plugin-openapi-docs',
    {
      id: 'api',
      docsPluginId: 'classic',
      config: {
        proabono: {
          specPath: '../shared/ProAbonoLive/shared-specs/pa-live-openapi-3.0.3.yaml',
          outputDir: 'docs/api-reference',
          sidebarOptions: {
            groupPathsBy: 'tag',
            categoryLinkSource: 'tag',
          },
        },
      },
    },
  ],
],
themes: ['docusaurus-theme-openapi-docs'],
```

The theme must be listed in `themes` (not `plugins`) for the 3-pane rendering to work.

## Output

The plugin writes MDX files into `website/docs/api-reference/`. These files use internal components from `docusaurus-theme-openapi-docs` and must not be edited manually — they will be overwritten on the next `gen-api-docs` run.

The plugin also generates a sidebar slice (`website/docs/api-reference/sidebar.ts`). Import it into `website/sidebars.js` and position it under the API Reference category.

## CI constraint

The `shared/ProAbonoLive` submodule is **not** checked out in CI. The generated MDX files in `website/docs/api-reference/` must be committed to the repo before pushing. CI runs `npm run build` on the committed files — the plugin's CLI commands (`gen-api-docs`) are never executed in CI.

## What is not generated

| Path | Reason |
|------|--------|
| `shared/ProAbonoLive/resources/` | Source markdown — used for authoring and kept in sync with the spec; not consumed by this pipeline |
| `shared/ProAbonoLive/specs/` | Authoring conventions — internal use only |
| `shared/ProAbonoLive/specs/enum.md` | Referenced when authoring Concepts pages — not auto-generated |
| `shared/ProAbonoLive/specs/convention.md` | Referenced when authoring Authentication pages — not auto-generated |
| `shared/ProAbonoLive/specs/actions.md` | Cross-resource flows — referenced when authoring Guides — not auto-generated |
