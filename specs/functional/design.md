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

### Light mode

| Role | Token | Value |
|------|-------|-------|
| Page background | `--ifm-background-color` | `#FFFFFF` |
| Sidebar background | `--ifm-navbar-background-color` / sidebar | `#1A1D23` |
| Sidebar text | — | `#E5E7EB` |
| Sidebar active item bg | — | `rgba(0, 116, 212, 0.15)` |
| Sidebar active item text | — | `#008CFF` |
| Sidebar hover bg | — | `rgba(255,255,255,0.06)` |
| Content text | `--ifm-font-color-base` | `#111827` |
| Muted text | `--ifm-color-secondary-darkest` | `#6B7280` |
| Border | `--ifm-toc-border-color` | `#E5E7EB` |
| Primary accent | `--ifm-color-primary` | `#0074D4` |
| Primary hover | `--ifm-color-primary-dark` | `#0063B5` |
| Primary lightest (tint) | `--ifm-color-primary-lightest` | `#D6EAFF` |
| Code block background | `--ifm-code-background` | `#1A1D23` |
| Inline code background | — | `#F3F4F6` |
| Inline code text | — | `#0063B5` |
| Admonition tip border | — | `#F0D250` |
| Admonition tip background | — | `#FFFDE7` |

### Dark mode

| Role | Value |
|------|-------|
| Page background | `#0F1117` |
| Sidebar background | `#13161D` |
| Content text | `#E5E7EB` |
| Muted text | `#9CA3AF` |
| Border | `#2D3748` |
| Code block background | `#1A1D23` |
| Inline code background | `#1F2937` |
| Inline code text | `#60A5FA` |
| Admonition tip background | `#2D2A12` |

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
│  NAVBAR (full width, 60px, dark: #1A1D23)                     │
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

- **Background:** `#1A1D23` (same as sidebar — creates one unified dark left/top band on desktop)
- **Height:** 60px
- **Logo:** ProAbono SVG (`brand.ab41491b.svg`), 32px tall, placed on the left
- **Site name:** "API Live | Reference" in Inter 600, white, placed immediately after the logo
- **Page title:** centered in the navbar
- **Items (right):** GitHub link icon
- **Border-bottom:** none; the visual separation comes from the page background being white

---

## Sidebar

- **Background:** `#1A1D23`
- **Width:** 260px, fixed on desktop
- **Top:** search input (full width, rounded, `#2D3748` background)
- **Nav tree:** collapsible category groups; active page item has blue left border (`#0074D4`, 2px) and light blue text (`#008CFF`)
- **Category label:** uppercase, Inter 500, 11px, letter-spacing 0.08em, muted (`#9CA3AF`)
- **Hover item:** subtle white overlay (`rgba(255,255,255,0.06)`)
- **Scrollbar:** hidden by default, visible on hover (thin, dark track)

---

## Code blocks

| Property | Value |
|----------|-------|
| Background | `#1E1E2E` |
| Border-radius | `8px` |
| Padding | `1rem 1.25rem` |
| Font | JetBrains Mono, 14px |
| Line height | 1.6 |
| Title bar (language badge) | `#2D3748`, Inter 500, 11px, uppercase |
| Copy button | top-right, appears on hover, icon only |
| Highlighted line | `rgba(0,116,212,0.15)` background |

See the [technical specifications](../technical/index.md) for the syntax highlighter configuration.

---

## Inline code

| Property | Value |
|----------|-------|
| Background | `#F3F4F6` (dark mode: `#1F2937`) |
| Color | `#0063B5` (dark mode: `#60A5FA`) |
| Border-radius | `4px` |
| Padding | `0.1em 0.35em` |
| Font size | `0.875em` |
| Font family | JetBrains Mono, monospace |

---

## Admonitions

Admonition types, styled with brand accents:

| Type | Left border | Background (light) | Icon |
|------|-------------|-------------------|------|
| `note` | `#0074D4` | `#EFF6FF` | ℹ |
| `tip` | `#F0D250` | `#FFFDE7` | ✦ |
| `warning` | `#F59E0B` | `#FFFBEB` | ⚠ |
| `danger` | `#EF4444` | `#FFF5F5` | ✕ |

Border-left width: `4px`. Background darkened proportionally in dark mode.

---

## Tables

| Property | Value |
|----------|-------|
| Width | 100% |
| Font size | 0.9rem |
| Header background | `#F9FAFB` (dark mode: `#1F2937`) |
| Header font weight | 600 |
| Header border-bottom | `2px solid #E5E7EB` |
| Cell padding | `0.5rem 0.75rem` |
| Row border-bottom | `1px solid #F3F4F6` |
| Row hover background | `#F9FAFB` (dark mode: `rgba(255,255,255,0.03)`) |
| Vertical align | top |

---

## Breadcrumbs

- Rendered above the page H1, inside the content area
- Font: Inter 400, 13px, muted (`#6B7280`)
- Separator: `/` with extra horizontal spacing
- Last item: same muted color, not bold (the H1 below is the page title)
- No background, no border — text only

---

## In-page TOC (right sidebar)

- Visible only at ≥ 1280px
- Title: "On this page", Inter 500, 12px, uppercase, muted
- Items: H2 and H3 anchors, 13px
- Active item: `#0074D4`, left border `2px solid #0074D4`
- Inactive: `#6B7280`, no border
