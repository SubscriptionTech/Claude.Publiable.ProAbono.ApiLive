<!-- ============================================================
FOR THE READER — Claude should skip this section entirely.

A search box in the top navigation bar lets developers quickly find any page
in the documentation — API reference pages, concept pages, guides — without
having to navigate manually through sections.

Deferred because the documentation set is currently small enough that
navigation alone is sufficient. Implement when the number of pages grows
to a point where finding content becomes a friction point for users.
============================================================ -->

# Implementation instructions — Search Engine

## Functional

Add a search box to the top navigation bar. The search box accepts free-text
input and returns matching pages from across the documentation (API reference,
concepts, getting started, guides). Results appear as a dropdown list as the
user types. Selecting a result navigates to the corresponding page.

Update `specs/functional/navigation.md` to document the search box as a
top-bar element, including its placeholder text and expected result behaviour.

## Pipeline

No content pipeline changes are required. The search index is built from the
existing page content at build time.

## Technical

Integrate [Pagefind](https://pagefind.app/) as the search backend:

1. Add a Pagefind post-build step that indexes the output of the static site
   build (the `out/` or equivalent build directory).
2. Mount the Pagefind UI in the top navigation bar component. Style the search
   input to match the existing navbar design.
3. Configure Pagefind to exclude non-content pages (e.g. 404) from the index.

Update `specs/technical/stack.md` to list Pagefind as a dev dependency and
describe the post-build indexing step.
