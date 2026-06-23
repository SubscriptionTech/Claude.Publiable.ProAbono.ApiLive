# Design — Technical

Docusaurus-specific configuration for fonts, syntax highlighting, CSS variables, and the logo.

For the visual specification (colors, typography, layout, UI components), see the [functional specifications](../functional/index.md).

---

## Font loading

Load Inter and JetBrains Mono from Google Fonts. Add to `website/src/css/custom.css` or inject via `docusaurus.config.js` `headTags`:

```
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap
https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap
```

---

## Prism syntax highlighter

### Inline style injection — why CSS variables alone are not enough

Docusaurus reads the configured Prism theme object at render time and injects `plain.color` and `plain.backgroundColor` as **inline styles** directly on each code block element. Inline styles have higher specificity than any CSS rule, so a declaration like `--prism-background-color: var(--pad-background-sidebar)` in `custom.css` is silently overridden.

The only reliable way to control those colors from the design token system is to make the Prism theme JS object agree with the token values from the start. Because the theme object is pure JavaScript evaluated at build time, it cannot reference CSS variables — the flow must go **JS → CSS**, never the other way around.

### Configuration

Define separate light and dark theme objects in `website/docusaurus.config.js`, using the exact hex values from the `--pad-background-sidebar` token:

```js
import {themes as prismThemes} from 'prism-react-renderer';

const lightPrismTheme = {
  plain: { color: '#9CDCFE', backgroundColor: '#333' },   // matches --pad-background-sidebar (light)
  styles: prismThemes.vsDark.styles,
};
const darkPrismTheme = {
  plain: { color: '#9CDCFE', backgroundColor: '#1F2937' }, // matches --pad-background-sidebar (dark)
  styles: prismThemes.vsDark.styles,
};
```

Then reference them in the Prism config:

```js
prism: {
  theme: lightPrismTheme,
  darkTheme: darkPrismTheme,
  additionalLanguages: ['bash', 'json', 'http'],
},
```

**Consequence:** do not set `--prism-background-color` in `custom.css`. It would be overridden anyway, and the inline value is now already correct. If `--pad-background-sidebar` is ever changed, update both the CSS token and the two `backgroundColor` values in `docusaurus.config.js`.

---

## Design token mapping

The functional specifications define all colors as `--pad-` tokens. Some of these map directly to Docusaurus/Infima `--ifm-` CSS variables; the rest are defined as custom properties and applied via custom selectors.

### Direct Infima mappings

| `--pad-` token | `--ifm-` variable |
|----------------|-------------------|
| `--pad-background` | `--ifm-background-color` |
| `--pad-background-sidebar` | `--ifm-navbar-background-color` |
| `--pad-primary` | `--ifm-color-primary` |
| `--pad-primary-dark` | `--ifm-color-primary-dark` |
| `--pad-primary-tint` | `--ifm-color-primary-lightest` |
| `--pad-text-on-dark` | `--ifm-navbar-link-color` |

Infima also requires a full primary color scale (`-darker`, `-darkest`, `-light`, `-lighter`). These intermediate shades have no `--pad-` equivalent and are set to their raw hex values directly.

### Custom properties

All other `--pad-` tokens are set as custom CSS properties in `custom.css` and applied through custom selectors targeting Docusaurus component classes.

---

## CSS variable overrides

All overrides live in `website/src/css/custom.css`:

```css
:root {
  /* Design tokens — light mode */
  --pad-background: #FFFFFF;
  --pad-background-sidebar: #1A1D23;
  --pad-background-code-inline: #F3F4F6;
  --pad-background-table-header: #F9FAFB;
  --pad-background-table-row-hover: #F9FAFB;
  --pad-text-base: #111827;
  --pad-text-muted: #6B7280;
  --pad-text-on-dark: #E5E7EB;
  --pad-border: #E5E7EB;
  --pad-border-subtle: #F3F4F6;
  --pad-code-title-bg: #2D3748;
  --pad-primary: #0074D4;
  --pad-primary-dark: #0063B5;
  --pad-primary-tint: #D6EAFF;
  --pad-sidebar-active-bg: rgba(0, 116, 212, 0.15);
  --pad-sidebar-active-text: #008CFF;
  --pad-sidebar-hover-bg: rgba(255, 255, 255, 0.06);
  --pad-code-inline-text: #0063B5;
  --pad-code-highlight-bg: rgba(0, 116, 212, 0.15);
  --pad-search-input-bg: rgba(255, 255, 255, 0.07);
  --pad-search-input-border: rgba(255, 255, 255, 0.1);
  --pad-search-placeholder: rgba(255, 255, 255, 0.3);
  --pad-search-input-focus-bg: rgba(255, 255, 255, 0.1);
  --pad-search-item-hover-bg: rgba(255, 255, 255, 0.04);
  --pad-search-item-separator: rgba(255, 255, 255, 0.06);
  --pad-search-result-title: #60A5FA;
  --pad-search-result-title-hover: #93C5FD;
  --pad-search-excerpt: rgba(255, 255, 255, 0.45);
  --pad-search-highlight-bg: rgba(0, 116, 212, 0.25);
  --pad-search-highlight-text: #93C5FD;
  --pad-admonition-note-border: #0074D4;
  --pad-admonition-note-bg: #EFF6FF;
  --pad-admonition-tip-border: #F0D250;
  --pad-admonition-tip-bg: #FFFDE7;
  --pad-admonition-warning-border: #F59E0B;
  --pad-admonition-warning-bg: #FFFBEB;
  --pad-admonition-danger-border: #EF4444;
  --pad-admonition-danger-bg: #FFF5F5;

  /* Infima variable overrides — mapped from design tokens */
  --ifm-background-color: var(--pad-background);
  --ifm-color-primary: var(--pad-primary);
  --ifm-color-primary-dark: var(--pad-primary-dark);
  --ifm-color-primary-darker: #0057A0;
  --ifm-color-primary-darkest: #004080;
  --ifm-color-primary-light: #008CFF;
  --ifm-color-primary-lighter: #29A0FF;
  --ifm-color-primary-lightest: var(--pad-primary-tint);
  --ifm-font-family-base: 'Inter', system-ui, sans-serif;
  --ifm-font-family-monospace: 'JetBrains Mono', 'Fira Code', monospace;
  --ifm-code-font-size: 87.5%;
  --ifm-navbar-background-color: var(--pad-background-sidebar);
  --ifm-navbar-link-color: var(--pad-text-on-dark);
  --ifm-navbar-link-hover-color: #FFFFFF;
}

[data-theme='dark'] {
  /* Design token dark mode overrides */
  --pad-background: #0F1117;
  --pad-background-sidebar: #13161D;
  --pad-background-code-inline: #1F2937;
  --pad-background-table-header: #1F2937;
  --pad-background-table-row-hover: rgba(255, 255, 255, 0.03);
  --pad-text-base: #E5E7EB;
  --pad-text-muted: #9CA3AF;
  --pad-border: #2D3748;
  --pad-border-subtle: #2D3748;
  --pad-code-inline-text: #60A5FA;
  --pad-admonition-tip-bg: #2D2A12;

  /* Infima variables auto-propagate through the var() references above */
  --ifm-background-color: var(--pad-background);
  --ifm-navbar-background-color: var(--pad-background-sidebar);
}
```

---

## Logo configuration

File: copy `brand.ab41491b.svg` to `website/static/img/logo.svg`.

Configure in `website/docusaurus.config.js`:

```js
navbar: {
  logo: {
    alt: 'ProAbono',
    src: 'img/logo.svg',
  },
}
```

Rendered at **32px height** in the navbar, aspect-ratio preserved. Do not apply additional color filters — the SVG contains its own blue/yellow gradient.
