# Navigation

Sidebar structure and page hierarchy for the ProAbono API Live documentation website.

## Sidebar sections

The site has five authored sections and the API Reference resource groups, listed in the order they appear in the sidebar.

| Position | Label |
|----------|-------|
| 1 | Introduction |
| 2 | Getting Started |
| 3 | Authentication |
| 4 | Concepts |
| 5+ | API resource groups (one per resource) |
| Last | Guides |

The API Reference resource groups are **not** wrapped in a collapsible "API Reference" category — they appear directly in the sidebar at the same level as the authored sections.

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

### Guides

One page per documented cross-resource action. Currently empty — no actions are marked for documentation yet. See the [backlog](../backlog/add-guides.md).

### API Reference

One page per API operation, organized into groups by resource. How these pages are produced is described in the [pipeline specifications](../pipeline/index.md).

The auto-generated Introduction page (produced from the OpenAPI `info` block) is excluded and does not appear in the sidebar.

---

## Navbar items

Right-aligned navbar items:

1. GitHub icon link (repository URL to be provided at implementation time)
