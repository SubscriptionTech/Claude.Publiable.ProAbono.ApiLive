# Backlog

Features deferred to future versions of the ProAbono API Live documentation website.

See [CLAUDE.md](CLAUDE.md) for the expected structure of this folder and its files.

## Add guides

See [add-guides.md](add-guides.md).

A Guides section for cross-resource workflows. Each guide page is enabled by
marking an action as `Documented: yes` in the actions spec. Currently no
actions are marked for documentation.

## Try It panel (request from site)

See [request-from-site.md](request-from-site.md).

Re-enable the built-in Try It panel on API reference pages so developers can
make live API calls from the documentation. Blocked until the API supports CORS
for the documentation domain.

## Localization (i18n)

See [i18n.md](i18n.md).

Add French (`fr`) as a second locale alongside English (`en`), with a language
switcher in the navbar and full prose translation of all documentation sections.

## Changelog

See [changelog.md](changelog.md).

A hand-authored page listing API changes over time: new resources, new actions,
breaking changes, and deprecations.

## Code Snippet Example Picker

See [code-snippet-example-picker.md](code-snippet-example-picker.md).

Add a dropdown above the generated code snippet on pages whose `requestBody`
defines multiple named examples, so developers can browse all variants directly
in the snippet. Currently the first example is always shown. Implement when
multi-example endpoints become numerous or user feedback flags it as a pain point.

## Search Engine

See [search-engine.md](search-engine.md).

Add a search box to the top navigation bar so developers can find any
documentation page by typing free text. Results appear as a dropdown as the
user types. Implement when the documentation grows large enough that manual
navigation becomes a friction point.
