<!-- ============================================================
FOR THE READER — Claude should skip this section entirely.

The code snippet generator in the right pane of API reference pages currently
always shows the first example from the OpenAPI spec when a requestBody has
multiple named examples (e.g. "create a subscription" has five: basic,
override-custom-trial, override-custom-upfront, override-custom-period-amount,
override-custom-discounts). Developers looking at the other variants have to
manually edit the generated snippet.

This feature would add a small dropdown or tab strip above (or inside) the code
snippet block so the user can pick which named example to display. It complements
the existing ApiExamples panel below the snippet, which already shows all named
examples.

Implement when the number of multi-example endpoints grows or user feedback
signals it as a pain point.
============================================================ -->

# Implementation instructions — Code Snippet Example Picker

## Functional

On API reference pages whose `requestBody` defines multiple named examples
(using the OpenAPI `examples` map rather than a single `example`), show a
picker above the generated code snippet. Selecting an entry updates the snippet
body to that example's value. The first example is selected by default.

Pages with a single `example` (or no body at all) are unaffected.

## Pipeline

No content pipeline changes. The named examples are already present in
`item.requestBody.content[contentType].examples` at render time. No
regeneration of API docs is needed.

## Technical

The fix involves two swizzled files under `website/src/theme/ApiExplorer/`.

### 1. `ApiExplorer/index.tsx`

The current implementation (`website/src/theme/ApiExplorer/index.tsx`) already
injects the first example into the Postman request. Extend it to:

- Detect whether the requestBody has multiple named examples
  (`Object.keys(media.examples).length > 1`).
- Expose the full examples map and a selected-example state (via `useState`)
  down to `CodeSnippets`.

### 2. `ApiExplorer/CodeSnippets/index.tsx` (new swizzle)

Swizzle `CodeSnippets` from `docusaurus-theme-openapi-docs`. Add:

- A new prop `examples?: Record<string, { summary?: string; value: any }>` and
  `onExampleChange?: (key: string) => void`.
- When `examples` has more than one entry, render a `<select>` (or small tab
  strip) above the `<CodeTabs>` block.
- On selection change, call `onExampleChange` and re-inject the chosen example
  value as a raw body into the Postman request (same logic as the current
  injection in `ApiExplorer/index.tsx`).

### 3. `ApiExplorer/buildPostmanRequest.ts` (already swizzled)

No further changes needed. The existing `!("type" in body)` guard already
preserves whichever body the parent injects.

### Spec files to update

- Update `description/technical/api-reference.md` to document the example
  picker behaviour and its conditions (only shown when `examples` map has ≥ 2
  entries).
