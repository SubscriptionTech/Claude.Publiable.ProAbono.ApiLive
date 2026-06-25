// @ts-check
import path from 'path';
import { fileURLToPath } from 'url';
import {themes as prismThemes} from 'prism-react-renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Docusaurus injects Prism theme colors as inline styles on every code block,
// which overrides any CSS variable declaration. The only way to control
// --prism-background-color from CSS is to make the JS theme object agree
// with the design tokens from the start.
const lightPrismTheme = {
  plain: { color: '#9CDCFE', backgroundColor: '#333' },   // matches --pad-background-sidebar (light)
  styles: prismThemes.vsDark.styles,
};
const darkPrismTheme = {
  plain: { color: '#9CDCFE', backgroundColor: '#1F2937' }, // matches --pad-background-sidebar (dark)
  styles: prismThemes.vsDark.styles,
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  // Browser tab title and default page title
  title: 'API Live | Reference',
  // Subtitle shown on the homepage hero
  tagline: 'ProAbono API documentation',
  // Browser tab icon (relative to static/)
  favicon: 'img/favicon.ico',

  // Opt into Docusaurus v4 behaviour flags ahead of the stable release
  future: {
    v4: true,
  },

  // Production URL of the site (used to generate absolute URLs and sitemaps)
  url: 'https://your-site.azurestaticapps.net',
  // Path prefix under the domain; '/' means the site lives at the root
  baseUrl: '/',

  // What to do when an internal link points to a non-existent page
  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      // What to do when a Markdown file links to another Markdown file that doesn't exist
      onBrokenMarkdownLinks: 'warn',
    },
  },

  plugins: [
    // Full-text search powered by Pagefind (built as a local plugin)
    path.join(__dirname, 'plugins/docusaurus-pagefind'),
    [
      // Generates MDX pages from the OpenAPI spec and wires them into the sidebar
      'docusaurus-plugin-openapi-docs',
      {
        // Plugin instance ID (referenced by docsPluginId below)
        id: 'api',
        // Which docs plugin instance owns the generated pages
        docsPluginId: 'classic',
        config: {
          proabono: {
            // Source OpenAPI spec to generate pages from
            specPath: '../shared/ProAbonoLive/open-api/pa-live-openapi-3.0.3.yaml',
            // Where the generated MDX files are written
            outputDir: 'docs/api-reference',
            sidebarOptions: {
              // Group sidebar entries by their OpenAPI tag
              groupPathsBy: 'tag',
              // Use the tag description as the category link target
              categoryLinkSource: 'tag',
            },
          },
        },
      },
    ],
  ],

  // Provides the OpenAPI-aware page layout (try-it panel, language tabs, etc.)
  themes: ['docusaurus-theme-openapi-docs'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // Sidebar structure definition
          sidebarPath: './sidebars.js',
          // Serve docs at /docs (not at the root)
          routeBasePath: 'docs',
          // Use the OpenAPI-enhanced page component instead of the default one
          docItemComponent: '@theme/ApiItem',
          // Skip the auto-generated summary page (we build our own summary)
          exclude: ['**/proabono-api-live.info.mdx'],
        },
        // No blog section on this site
        blog: false,
        theme: {
          // Global CSS overrides and design tokens
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        // Honour the OS-level light/dark preference instead of defaulting to light
        respectPrefersColorScheme: true,
      },
      navbar: {
        // Text shown next to the logo
        title: 'API Live | Reference',
        logo: {
          alt: 'ProAbono',
          // SVG logo file (relative to static/)
          src: 'img/logo.svg',
        },
        // Force the navbar to use the dark colour variant regardless of page theme
        style: 'dark',
        items: [
          // Pagefind search box on the right
          { type: 'search', position: 'right' },
          {
            // Link to the source repository; CSS class adds the GitHub icon
            href: 'https://github.com/SubscriptionTech/Claude.Publiable.ProAbono.ApiLive',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        // Auto-updates the year at build time
        copyright: `Copyright © ${new Date().getFullYear()} ProAbono`,
      },
      // Code-sample language tabs shown in each API endpoint page
      languageTabs: [
        { language: "curl" },
        { language: "python" },
        { language: "javascript" },
        { language: "nodejs" },
        { language: "php" },
        { language: "go" },
        { language: "java" },
        { language: "csharp" },
        { language: "ruby" },
        { language: "http" },
        { language: "powershell" },
      ],
      prism: {
        // Syntax-highlight theme for light mode
        theme: lightPrismTheme,
        // Syntax-highlight theme for dark mode
        darkTheme: darkPrismTheme,
        // Extra grammars not bundled by default
        additionalLanguages: ['bash', 'json', 'http'],
      },
    }),
};

export default config;
