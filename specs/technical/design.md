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

Configure in `website/docusaurus.config.js`:

```js
prism: {
  theme: require('prism-react-renderer').themes.vsDark,
  additionalLanguages: ['bash', 'json', 'http'],
},
```

---

## CSS variable overrides

All overrides live in `website/src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #0074D4;
  --ifm-color-primary-dark: #0063B5;
  --ifm-color-primary-darker: #0057A0;
  --ifm-color-primary-darkest: #004080;
  --ifm-color-primary-light: #008CFF;
  --ifm-color-primary-lighter: #29A0FF;
  --ifm-color-primary-lightest: #D6EAFF;
  --ifm-font-family-base: 'Inter', system-ui, sans-serif;
  --ifm-font-family-monospace: 'JetBrains Mono', 'Fira Code', monospace;
  --ifm-code-font-size: 87.5%;
  --ifm-navbar-background-color: #1A1D23;
  --ifm-navbar-link-color: #E5E7EB;
  --ifm-navbar-link-hover-color: #FFFFFF;
}

[data-theme='dark'] {
  --ifm-background-color: #0F1117;
  --ifm-navbar-background-color: #13161D;
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
