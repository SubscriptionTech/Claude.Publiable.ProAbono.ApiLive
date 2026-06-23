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
  title: 'API Live | Reference',
  tagline: 'ProAbono API documentation',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://your-site.azurestaticapps.net',
  baseUrl: '/',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  plugins: [
    path.join(__dirname, 'plugins/docusaurus-pagefind'),
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          proabono: {
            specPath: '../shared/ProAbonoLive/open-api/pa-live-openapi-3.0.3.yaml',
            outputDir: 'docs/api-reference',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
          },
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          docItemComponent: '@theme/ApiItem',
          exclude: ['**/proabono-api-live.info.mdx'],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'API Live | Reference',
        logo: {
          alt: 'ProAbono',
          src: 'img/logo.svg',
        },
        style: 'dark',
        items: [
          { type: 'search', position: 'right' },
          {
            href: 'https://github.com/SubscriptionTech/Claude.Publiable.ProAbono.ApiLive',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} ProAbono`,
      },
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
        theme: lightPrismTheme,
        darkTheme: darkPrismTheme,
        additionalLanguages: ['bash', 'json', 'http'],
      },
    }),
};

export default config;
