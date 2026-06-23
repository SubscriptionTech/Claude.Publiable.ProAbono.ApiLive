# Backlog

## Context7 — Sync on changes

Add a GitHub Action that triggers a Context7 documentation refresh on every push to `main`, so Context7 always serves the latest version of the docs.

**Notes:**
- The repository will be manually registered in Context7 by the owner (one-time step, done outside this repo)
- The Action to use: `rennf93/upsert-context7@v1` with `operation: refresh`
- No API key or Context7 account required (public repo)
- No `context7.json` needed unless we later want to control folder inclusion or declare explicit versions
