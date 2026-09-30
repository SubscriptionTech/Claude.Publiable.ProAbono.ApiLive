# specs/ — Website Specification

This folder contains the requirements and specifications for the **ProAbono API Live documentation website**.

Its purpose is to give a language model (such as Claude Code) everything it needs to implement the website from scratch, without any prior context.

Never modify files in this folder unless the user explicitly asks to update the website specification.

## How to use this folder

Read this file first, then follow the links below in order before implementing any part of the site. The specification has two layers:

1. **Shared base (DocApi)** — applies to all ProAbono API documentation websites
2. **API Live overrides** — the files of this folder; they hold only what is specific to this website and take precedence over DocApi

## Shared base specifications (DocApi)

All ProAbono API documentation websites share a common foundation. Read the DocApi specifications first — they define the base design, stack, pipeline architecture, and implementation patterns.

Shared spec root: [`shared/DocApi/`](../shared/DocApi/)

The scope of each category and the cross-referencing rule are defined in DocApi: see [`shared/DocApi/CLAUDE.md`](../shared/DocApi/CLAUDE.md) and the **This folder must NOT contain** section of each category's `CLAUDE.md`.

## 1. Functional — what to build

[functional/](functional/) describes the website from the user's perspective: what pages exist, what they contain, what the navigation looks like, and what the visual design is. Stack-agnostic.

See [functional/CLAUDE.md](functional/CLAUDE.md) for the full file list.

## 2. Pipeline — how content flows in

[pipeline/](pipeline/) describes the processes that feed the site with content from the OpenAPI spec and the ProAbonoLive resource docs.

See [pipeline/CLAUDE.md](pipeline/CLAUDE.md) for the full file list.

## 3. Technical — how it is implemented

[technical/](technical/) describes the technical choices: Docusaurus, plugin configuration, build commands, deployment. Contains everything that would change if the stack were replaced.

See [technical/CLAUDE.md](technical/CLAUDE.md) for the full file list.

## Relationship to the API specs

The website documents the ProAbono API Live. The API specs live in [shared/ProAbonoLive/](../shared/ProAbonoLive/). The website implementation must treat those specs as the source of truth for all API-related content.

**This website is public documentation.** When working on any part of the API Reference — content, navigation, grouping, or ordering — read [`shared/ProAbonoLive/specs/authoring.md`](../shared/ProAbonoLive/specs/authoring.md) first. It is the mandatory source of truth for how resources are presented in public-facing targets.
