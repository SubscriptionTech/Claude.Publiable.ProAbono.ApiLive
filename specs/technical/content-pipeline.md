# Content Pipeline — Technical

API Live–specific plugin configuration. For the generic shape, script pattern, and `sidebar.ts` import, see [`shared/DocApi/technical/content-pipeline.md`](../../shared/DocApi/technical/content-pipeline.md). For the stack-agnostic overview, see the [pipeline specifications](../pipeline/index.md).

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
          specPath: '../shared/ProAbonoLive/open-api/<file of the OpenAPI spec>',
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

## OpenAPI spec version in `specPath`

- `specPath` of `docusaurus-plugin-openapi-docs`, in `website/docusaurus.config.js`, points to the current version of the OpenAPI spec. The config is the only place that holds the actual file path.
- That version is the file version declared in [`shared/ProAbonoLive/open-api/CLAUDE.md`](../../shared/ProAbonoLive/open-api/CLAUDE.md), which also describes how the file name is built from it.
- A new version is a new file and the previous files stay, so `specPath` does not follow on its own.
- Before regenerating the API reference, compare the version in `specPath` with the current file version. When they differ, ask the user before pointing `specPath` at the new file.
