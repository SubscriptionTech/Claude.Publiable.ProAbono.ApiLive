# Navigation

Sidebar structure and page hierarchy for the ProAbono API Live documentation website.

For the standard section order and navbar items, see `shared/DocApi/functional/navigation.md`.

---

## Section page maps

### Introduction

One page — the section landing page. No sub-pages.

Page label: **Introduction**

### Getting Started

One page — the section landing page. No sub-pages.

Page label: **Quick Start**

### Authentication

One page — the section landing page. No sub-pages.

Page label: **Authentication**

### Concepts

Two pages:

1. **Core Concepts** — entity glossary and entity relationships
2. **Conventions** — field naming, pagination, dates, amounts, and error shapes

### API Reference

One page per API operation, organized into groups by resource. How these pages are produced is described in the [pipeline specifications](../pipeline/index.md).

The auto-generated Introduction page (produced from the OpenAPI `info` block) is excluded and does not appear in the sidebar.

### Guides

One page per documented cross-resource action. Currently empty — no actions are marked for documentation yet. See the [backlog](../backlog/add-guides.md).
