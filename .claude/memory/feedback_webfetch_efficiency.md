---
name: feedback-webfetch-efficiency
description: "Don't make multiple WebFetch calls to the same URL — fetch once with a comprehensive prompt"
metadata:
  type: feedback
---

When a task requires extracting multiple sections from a single page, fetch it **once** with a prompt that covers everything needed. Making repeated calls to the same URL wastes context and time.

**Why:** Repeated fetches of the same page — especially on a single-page docs site — add no information and consume context that later steps need.

**How to apply:** Before fetching, identify all the information needed from the URL, then write one prompt that asks for all of it in one call.
