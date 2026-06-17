# Content Pipeline — Technical

How to run the API reference generation and how it is configured in Docusaurus.

For the stack-agnostic overview (inputs, outputs, CI constraint), see the [pipeline specifications](../pipeline/index.md).

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

## sidebar.ts

The plugin generates `website/docs/api-reference/sidebar.ts` alongside the MDX files. Import it into `website/sidebars.js` and position it under the API Reference category. See [navigation.md](navigation.md) for the full `sidebars.js` configuration.
