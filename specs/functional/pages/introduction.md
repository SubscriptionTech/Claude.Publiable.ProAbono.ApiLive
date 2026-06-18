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

### 2. Security warning

A mandatory `warning` admonition:

> This API is designed to be used from a server to a server, and **NOT** from a client to server in JavaScript. This is very important for security purposes.

---

## Implementation notes

- Keep the page short — it is an entry point, not a tutorial.
- The security warning is mandatory and must use the `warning` admonition type.
