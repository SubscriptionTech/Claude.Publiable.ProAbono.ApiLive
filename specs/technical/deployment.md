# Deployment — API Live Override

Base: [`shared/DocApi/technical/deployment.md`](../../shared/DocApi/technical/deployment.md)

## Overrides

**Workflow file:** `.github/workflows/azure-static-web-apps-nice-ground-08a335503.yml`

**Deployment token secret:** `AZURE_STATIC_WEB_APPS_API_TOKEN_NICE_GROUND_08A335503`

**Root redirect:** none. Docs are served at the site root and Introduction carries `slug: /`, so `/` is the Introduction page itself. `staticwebapp.config.json` holds only the 404 override.
