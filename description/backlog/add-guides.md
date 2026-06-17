<!-- ============================================================
FOR THE READER — Claude should skip this section entirely.

The Guides section is designed for cross-resource workflows (e.g. "onboard a
customer"). It is currently empty because no action has been promoted to
documentation yet. The trigger is simple: when you mark an action as
`Documented: yes` in `shared/ProAbonoLive/specs/actions.md`, ask Claude to
implement the corresponding guide page.

Each guide walks a developer through a multi-step API flow — one step per
section — with code examples and links to the relevant API reference pages.
============================================================ -->

# Implementation instructions — Add Guides

## Functional

The website has a **Guides** section in the sidebar. It contains one page per
cross-resource action marked `Documented: yes` in
`shared/ProAbonoLive/specs/actions.md`. Actions marked `Documented: no` must
not be exposed in the public documentation.

Each guide page has the following sections, in order:

1. **Purpose** — One sentence describing the business outcome this flow
   achieves and when a developer would use it.
2. **Prerequisites** — What the developer needs before starting (e.g. an
   existing customer record, an offer reference).
3. **Steps** — One numbered section per step, matching the step table in
   `specs/actions.md`. Each step section contains:
   - A short explanation of what this API call does and why it comes at this
     point in the flow.
   - A code example with `curl` as the primary tab and Node.js `fetch` as the
     secondary tab.
   - The expected response for that step.
4. **Full flow at a glance** — An optional summary code block or table showing
   all steps together, for developers who want a quick copy-paste reference.
5. **Next steps** — Links to the API Reference pages for each resource touched
   by this flow.

Update `description/functional/navigation.md` to list each new guide page
under the Guides section.

## Pipeline

The source of truth for which guides to implement is:

```
shared/ProAbonoLive/specs/actions.md
```

Each action in that file has a `Documented` field. When an action is changed
from `Documented: no` to `Documented: yes`, create the corresponding guide
page. When an action is changed back to `Documented: no`, remove the page.

If the action's step table is updated (steps added, removed, or reordered),
re-generate the guide to match.

Update `description/pipeline/authoring.md` to list each new guide source file
under the cross-resource actions section.

## Technical

For each action marked `Documented: yes`:

1. Create `website/docs/guides/<action-identifier>.mdx`
   (e.g. `customer-onboard.mdx` for action identifier `customer.onboard`).
2. Add `sidebar_position` frontmatter to control ordering within the Guides
   section.
3. Use the Docusaurus `<Tabs>` / `<TabItem>` component for the code example
   tabs (curl / Node.js).
4. Update `description/technical/navigation.md` if a new `_category_.json`
   entry or `sidebars.js` change is needed for the Guides section.

### Example — `customer.onboard`

Action defined in `specs/actions.md`:

| Step | Resource | Action |
|------|----------|--------|
| 1 | Customers | `customer.create` |
| 2 | Subscriptions | `subscription.create` |

File to create: `website/docs/guides/customer-onboard.mdx`

Link to [Customers](../api-reference/customer/) and
[Subscriptions](../api-reference/subscription/) in the Next steps section.
