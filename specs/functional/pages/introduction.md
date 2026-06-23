# Page spec — Introduction

Sidebar label: Introduction

---

## Purpose

Give developers a one-paragraph orientation to the ProAbono API Live before they dive into the Quick Start or Authentication pages. Set the security expectation (server-to-server only) upfront.

---

## Page structure

### 1. Intro paragraphs

Two sentences describing what the platform is and what the API lets a developer do:

- ProAbono is a subscription-billing platform; API Live is designed to craft end-user experiences in a few calls.
- The API lets you manage subscriptions programmatically — create customers, start or update subscriptions, check feature access, and calculate billing costs before committing to a change.

### 2. Account sign-up prompt

A sentence before the warning:

> Before getting started, you need a ProAbono account. [Sign up here](https://via.proabono.com/Auth/Welcome) to create one.

### 3. Security warning

A mandatory `warning` admonition that:

1. Names the concrete risk: calling the API from a browser exposes the API key in network requests, browser DevTools, and JavaScript bundles — visible to any user.
2. Shows the correct proxy architecture in a plain-text diagram:

```
Browser → Your backend → ProAbono API Live
```

3. Closes with one sentence: "Your backend holds the API key; the browser never sees it."

---

## Implementation notes

- Keep the page short — it is an entry point, not a tutorial.
- The security warning is mandatory and must use the `warning` admonition type.
