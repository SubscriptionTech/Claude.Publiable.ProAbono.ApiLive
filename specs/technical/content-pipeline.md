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
          specPath: '../shared/ProAbonoLive/open-api/pa-live-openapi-3.0.3.yaml',
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
