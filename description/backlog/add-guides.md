# Backlog — Add Guides

The Guides section (`website/docs/guides/`) is currently empty. It should contain one page per cross-resource action that is marked `Documented: yes` in `shared/ProAbonoLive/specs/actions.md`.

## Source of truth

All cross-resource actions live in:

```
shared/ProAbonoLive/specs/actions.md
```

Each action has a `Documented` field. Only actions with `Documented: yes` should appear in the Guides section. Actions with `Documented: no` must not be exposed in the public documentation.

## Current state

As of today, all cross-resource actions in `specs/actions.md` are marked `Documented: no`, so no guide pages exist yet.

## How to add a guide

When a cross-resource action is marked `Documented: yes` in `specs/actions.md`:

1. Create `website/docs/guides/<action-identifier>.mdx` (e.g. `customer-onboard.mdx`).
2. Add `sidebar_position` frontmatter to control ordering within the section.
3. Follow the page structure below.
4. Update `description/navigation.md` to list the new page under the Guides section map.

## Guide page structure

### 1. Purpose paragraph

One sentence: what business outcome this flow achieves and when a developer would use it.

### 2. Prerequisites

What the developer needs before running these steps (e.g. an existing customer record, an offer reference).

### 3. Steps

One numbered section per step, matching the step table in `specs/actions.md`. Each step section contains:

- A short explanation of what this call does and why it comes at this point in the flow.
- A `curl` code block as the primary example, with a Node.js `fetch` tab as the secondary option (using the Docusaurus `<Tabs>` / `<TabItem>` component).
- The expected response for that step.

### 4. Full flow at a glance

An optional summary code block or table showing all steps together, for developers who want a quick copy-paste reference.

### 5. Next steps

Links to the relevant API Reference pages for each resource touched by this flow.

## Example: `customer.onboard`

Action defined in `specs/actions.md`:

| Step | Resource | Action |
|------|----------|--------|
| 1 | Customers | `customer.create` |
| 2 | Subscriptions | `subscription.create` |

Once marked `Documented: yes`, create `website/docs/guides/customer-onboard.mdx` following the structure above, linking to [Customers](../api-reference/customer/) and [Subscriptions](../api-reference/subscription/) for reference.
