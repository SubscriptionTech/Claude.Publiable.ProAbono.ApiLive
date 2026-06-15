# Deployment

Azure Static Web Apps configuration, CI/CD pipeline, and branch strategy.

---

## Branch strategy

| Branch | Environment |
|--------|-------------|
| `main` | Production  |

Only `main` is deployed. No staging environment. No PR preview environments.

---

## Azure Static Web Apps resource settings

These values configure the Azure SWA resource and are mirrored in the workflow file.

| Setting         | Value     |
|-----------------|-----------|
| App location    | `website` |
| Output location | `build`   |
| API location    | *(empty)* |

---

## staticwebapp.config.json

Place this file at `website/static/staticwebapp.config.json`. Docusaurus copies every file in `website/static/` verbatim into `website/build/`, so it will be present at the root of the deployed output.

```json
{
  "routes": [
    {
      "route": "/",
      "redirect": "/en/",
      "statusCode": 302
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/en/404.html",
      "statusCode": 404
    }
  }
}
```

**Root redirect** — visitors arriving at `/` are sent to `/en/`. All locales are URL-prefixed (see `i18n.md`), so the bare root is always empty.

**404 override** — unmatched paths are rewritten to Docusaurus's generated 404 page instead of Azure SWA's default. The status code is preserved at 404.

No SPA navigation fallback is needed: Docusaurus generates a full `.html` file for every page at build time.

---

## GitHub Actions workflow

Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Deploy to Azure Static Web Apps

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22.x'

      - name: Install dependencies
        working-directory: website
        run: npm ci

      - name: Build
        working-directory: website
        run: npm run build

      - name: Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: website
          output_location: build
          skip_app_build: true
```

`skip_app_build: true` tells the Azure SWA action to skip its own Oryx build and upload the already-built `website/build/` directory directly.

The workflow does **not** include a `pull_request` trigger, so no PR preview environments are created.

---

## Secrets

| Secret name                          | Where to get it |
|--------------------------------------|-----------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN`    | Azure portal → Static Web Apps resource → **Manage deployment token** |

Add this secret to the GitHub repository under **Settings → Secrets and variables → Actions**.

---

## Submodule in CI

The submodule (`shared/ProAbonoLive/`) is **not** checked out in CI. The `actions/checkout@v4` step uses a default shallow clone with no `submodules: true` flag.

API reference files are committed to `website/docs/api-reference/` by the local extraction script (see `content-pipeline.md`) and must be committed before pushing to `main`.
