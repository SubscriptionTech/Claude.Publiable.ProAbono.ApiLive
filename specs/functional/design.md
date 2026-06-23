# Design

Visual identity and UI component specification for the ProAbono API Live documentation website.

## Inspiration

The design takes GitBook Docs (https://gitbook.com/docs/) as its primary reference: dark left sidebar, white content area, clean sans-serif typography, and syntax-highlighted code blocks on dark backgrounds. ProAbono brand colors replace GitBook's accent palette.

---

## Brand colors

Extracted from the ProAbono logo SVG (`brand.ab41491b.svg`):

| Name | Hex | Usage |
|------|-----|-------|
| Brand Blue | `#0074D4` | Primary accent — links, active states, primary buttons |
| Brand Blue Light | `#008CFF` | Hover states, interactive highlights |
| Brand Cyan | `#00C8FF` | Gradient endpoint, decorative only |
| Brand Yellow | `#F0D250` | Secondary accent — tips, call-to-action, logo gem |
| Brand Yellow Light | `#FFEA55` | Hover variant of yellow |
| Brand Yellow Pale | `#FFF096` | Background tint for yellow-highlighted areas |

---

## Color palette

Design tokens use the `--pad-` prefix (ProAbono Documentation). All color references throughout this specification use these tokens — never raw hex values. The mapping to the CSS framework implementation is in the [technical specifications](../technical/index.md).

### Surfaces

| Token | Light mode | Dark mode | Role |
|-------|------------|-----------|------|
| `--pad-background` | `#FFFFFF` | `#0F1117` | Page background |
| `--pad-background-sidebar` | `#1A1D23` | `#13161D` | Sidebar, navbar, and code blocks — unified dark surface |
| `--pad-background-code-inline` | `#F3F4F6` | `#1F2937` | Inline code background |
| `--pad-background-table-header` | `#F9FAFB` | `#1F2937` | Table header row |
| `--pad-background-table-row-hover` | `#F9FAFB` | `rgba(255,255,255,0.03)` | Table row hover |

### Text

| Token | Light mode | Dark mode | Role |
|-------|------------|-----------|------|
| `--pad-text-base` | `#111827` | `#E5E7EB` | Main content text |
| `--pad-text-muted` | `#6B7280` | `#9CA3AF` | Muted / secondary text |
| `--pad-text-on-dark` | `#E5E7EB` | `#E5E7EB` | Text on dark surfaces (sidebar, navbar) — always light |

### Accent

| Token | Light mode | Dark mode | Role |
|-------|------------|-----------|------|
| `--pad-primary` | `#0074D4` | `#0074D4` | Primary accent — links, active states, buttons |
| `--pad-primary-dark` | `#0063B5` | `#0063B5` | Primary hover |
| `--pad-primary-tint` | `#D6EAFF` | `#D6EAFF` | Primary lightest tint |

### Borders

| Token | Light mode | Dark mode | Role |
|-------|------------|-----------|------|
| `--pad-border` | `#E5E7EB` | `#2D3748` | Standard border |
| `--pad-border-subtle` | `#F3F4F6` | `#2D3748` | Subtle row separator |
| `--pad-code-title-bg` | `#2D3748` | `#2D3748` | Code block language badge background |

### Sidebar interactions

| Token | Value | Role |
|-------|-------|------|
| `--pad-sidebar-active-bg` | `rgba(0,116,212,0.15)` | Active item background |
| `--pad-sidebar-active-text` | `#008CFF` | Active item text |
| `--pad-sidebar-hover-bg` | `rgba(255,255,255,0.06)` | Item hover overlay |

### Code

| Token | Light mode | Dark mode | Role |
|-------|------------|-----------|------|
| `--pad-code-inline-text` | `#0063B5` | `#60A5FA` | Inline code text |
| `--pad-code-highlight-bg` | `rgba(0,116,212,0.15)` | `rgba(0,116,212,0.15)` | Code block highlighted line |

### Search

The search UI is always rendered in dark mode regardless of the page theme.

| Token | Value | Role |
|-------|-------|------|
| `--pad-search-input-bg` | `rgba(255,255,255,0.07)` | Input background |
| `--pad-search-input-border` | `rgba(255,255,255,0.1)` | Input border |
| `--pad-search-placeholder` | `rgba(255,255,255,0.3)` | Placeholder text |
| `--pad-search-input-focus-bg` | `rgba(255,255,255,0.1)` | Input focus background |
| `--pad-search-item-hover-bg` | `rgba(255,255,255,0.04)` | Result item hover |
| `--pad-search-item-separator` | `rgba(255,255,255,0.06)` | Result item separator |
| `--pad-search-result-title` | `#60A5FA` | Result title |
| `--pad-search-result-title-hover` | `#93C5FD` | Result title hover |
| `--pad-search-excerpt` | `rgba(255,255,255,0.45)` | Result excerpt |
| `--pad-search-highlight-bg` | `rgba(0,116,212,0.25)` | Match highlight background |
| `--pad-search-highlight-text` | `#93C5FD` | Match highlight text |

### Admonitions

| Token | Light mode | Dark mode | Role |
|-------|------------|-----------|------|
| `--pad-admonition-note-border` | `#0074D4` | `#0074D4` | Note left border |
| `--pad-admonition-note-bg` | `#EFF6FF` | darkened proportionally | Note background |
| `--pad-admonition-tip-border` | `#F0D250` | `#F0D250` | Tip left border |
| `--pad-admonition-tip-bg` | `#FFFDE7` | `#2D2A12` | Tip background |
| `--pad-admonition-warning-border` | `#F59E0B` | `#F59E0B` | Warning left border |
| `--pad-admonition-warning-bg` | `#FFFBEB` | darkened proportionally | Warning background |
| `--pad-admonition-danger-border` | `#EF4444` | `#EF4444` | Danger left border |
| `--pad-admonition-danger-bg` | `#FFF5F5` | darkened proportionally | Danger background |

---

## Typography

| Role | Font family | Weight | Size |
|------|-------------|--------|------|
| UI / body | Inter, system-ui, sans-serif | 400 | 16px |
| Body bold / emphasis | Inter | 600 | — |
| H1 (page title) | Inter | 700 | 2rem (32px) |
| H2 | Inter | 600 | 1.5rem (24px) |
| H3 | Inter | 600 | 1.25rem (20px) |
| H4 | Inter | 600 | 1rem (16px) |
| Code (inline + block) | JetBrains Mono, Fira Code, monospace | 400 | 0.875rem (14px) |
| Sidebar nav label | Inter | 500 | 0.875rem (14px) |
| Breadcrumb | Inter | 400 | 0.8125rem (13px) |

Line height: `1.65` for body text, `1.4` for headings.

Load Inter and JetBrains Mono from Google Fonts. See the [technical specifications](../technical/index.md) for the implementation.

---

## Layout

```
┌───────────────────────────────────────────────────────────────┐
│  NAVBAR (full width, 60px, dark: --pad-background-sidebar)    │
├──────────────┬────────────────────────────┬───────────────────┤
│              │                            │                   │
│  SIDEBAR     │  CONTENT AREA              │  IN-PAGE TOC      │
│  260px fixed │  max-width 780px           │  220px fixed      │
│  dark bg     │  centered, padded          │  (desktop only,   │
│              │  left/right: 2rem          │  ≥1280px)         │
│              │                            │                   │
└──────────────┴────────────────────────────┴───────────────────┘
```

| Breakpoint | Behavior |
|------------|----------|
| ≥ 1280px | Sidebar + content + in-page TOC visible |
| 997px – 1279px | Sidebar + content; in-page TOC hidden |
| < 997px | Sidebar collapses to hamburger menu |

---

## Navbar

- **Background:** `--pad-background-sidebar`
- **Height:** 60px
- **Logo:** ProAbono SVG (`brand.ab41491b.svg`), 32px tall, placed on the left
- **Site name:** "API Live | Reference" in Inter 600, `--pad-text-on-dark`, placed immediately after the logo
- **Page title:** centered in the navbar
- **Items (right):** Search box (see [Search](#search) section below), then GitHub link icon
- **Border-bottom:** none; the visual separation comes from the page background being white

---

## Search

The search box lives in the navbar, right-aligned before the GitHub icon. It accepts free-text queries and shows matching pages in a dropdown below the input.

### Search input

| Property | Value |
|----------|-------|
| Height | 36px |
| Width | 200px |
| Background | `--pad-search-input-bg` |
| Border | `1px solid --pad-search-input-border` |
| Border-radius | 6px |
| Text color | `--pad-text-on-dark` |
| Font size | 0.8125rem (13px) |
| Placeholder | "Search", `--pad-search-placeholder` |
| Focus background | `--pad-search-input-focus-bg` |
| Focus border-color | `--pad-primary` |
| Submit / clear buttons | hidden |

### Results dropdown

The dropdown opens below the input with a 6px gap. It is always dark, regardless of the page theme.

| Property | Value |
|----------|-------|
| Width | 400px |
| Max height | 60vh, scrollable |
| Background | `--pad-background-sidebar` |
| Border | `1px solid --pad-search-input-border` |
| Border-radius | 8px |
| Box shadow | `0 8px 32px rgba(0,0,0,0.5)` |
| Stacking | above all page content |

### Result items

| Property | Value |
|----------|-------|
| Item padding | `0.6rem 1rem` |
| Item separator | `1px solid --pad-search-item-separator` |
| Thumbnail | hidden |
| Item hover background | `--pad-search-item-hover-bg` |
| Result title | `--pad-search-result-title`, Inter 500, 0.875rem; hover: `--pad-search-result-title-hover` with underline |
| Excerpt | `--pad-search-excerpt`, 0.8125rem, line-height 1.5 |

### Match highlighting

| Property | Value |
|----------|-------|
| Background | `--pad-search-highlight-bg` |
| Text color | `--pad-search-highlight-text` |
| Border-radius | 2px |
| Padding | `0 1px` |

---

## Sidebar

- **Background:** `--pad-background-sidebar`
- **Width:** 260px, fixed on desktop
- **Nav tree:** collapsible category groups; active page item has blue left border (`--pad-primary`, 2px) and light blue text (`--pad-sidebar-active-text`)
- **Category label:** uppercase, Inter 500, 11px, letter-spacing 0.08em, `--pad-text-muted` (dark mode value)
- **Hover item:** subtle white overlay (`--pad-sidebar-hover-bg`)
- **Scrollbar:** hidden by default, visible on hover (thin, dark track)

---

## Code blocks

| Property | Value |
|----------|-------|
| Background | `--pad-background-sidebar` |
| Border-radius | `8px` |
| Padding | `1rem 1.25rem` |
| Font | JetBrains Mono, 14px |
| Line height | 1.6 |
| Title bar (language badge) | `--pad-code-title-bg`, Inter 500, 11px, uppercase |
| Copy button | top-right, appears on hover, icon only |
| Highlighted line | `--pad-code-highlight-bg` background |

See the [technical specifications](../technical/index.md) for the syntax highlighter configuration.

---

## Inline code

| Property | Value |
|----------|-------|
| Background | `--pad-background-code-inline` |
| Color | `--pad-code-inline-text` |
| Border-radius | `4px` |
| Padding | `0.1em 0.35em` |
| Font size | `0.875em` |
| Font family | JetBrains Mono, monospace |

---

## Admonitions

Admonition types, styled with brand accents:

| Type | Left border | Background (light) | Icon |
|------|-------------|-------------------|------|
| `note` | `--pad-admonition-note-border` | `--pad-admonition-note-bg` | ℹ |
| `tip` | `--pad-admonition-tip-border` | `--pad-admonition-tip-bg` | ✦ |
| `warning` | `--pad-admonition-warning-border` | `--pad-admonition-warning-bg` | ⚠ |
| `danger` | `--pad-admonition-danger-border` | `--pad-admonition-danger-bg` | ✕ |

Border-left width: `4px`. Background darkened proportionally in dark mode.

---

## Tables

| Property | Value |
|----------|-------|
| Width | 100% |
| Font size | 0.9rem |
| Header background | `--pad-background-table-header` |
| Header font weight | 600 |
| Header border-bottom | `2px solid --pad-border` |
| Cell padding | `0.5rem 0.75rem` |
| Row border-bottom | `1px solid --pad-border-subtle` |
| Row hover background | `--pad-background-table-row-hover` |
| Vertical align | top |

---

## Breadcrumbs

- Rendered above the page H1, inside the content area
- Font: Inter 400, 13px, `--pad-text-muted`
- Separator: `/` with extra horizontal spacing
- Last item: same muted color, not bold (the H1 below is the page title)
- No background, no border — text only

---

## In-page TOC (right sidebar)

- Visible only at ≥ 1280px
- Title: "On this page", Inter 500, 12px, uppercase, `--pad-text-muted`
- Items: H2 and H3 anchors, 13px
- Active item: `--pad-primary`, left border `2px solid --pad-primary`
- Inactive: `--pad-text-muted`, no border

---

## API operation pages

API operation pages are documentation-only: the interactive request form and response container are hidden. The page shows only the endpoint description, parameters, and code examples.

| Element | Behavior |
|---------|----------|
| "Try it" request form | hidden |
| "Try it" response container | hidden |
| Security details panel | hidden |
| MIME type selector | hidden |
| Method + endpoint path | `--pad-text-on-dark` |
| Code block max height | 400px with vertical scroll |

### Code language selector

A dropdown placed above the code snippet lets the user pick the example language.

| Property | Value |
|----------|-------|
| Width | 100% |
| Padding | `0.4rem 0.6rem` |
| Margin below | `0.75rem` |
| Font family | Inter (UI font) |
| Font size | 0.875rem (14px) |
| Text color | `--pad-text-base` |
| Background | `--pad-background` |
| Border | `1px solid --pad-border` |
| Border-radius | 4px |
