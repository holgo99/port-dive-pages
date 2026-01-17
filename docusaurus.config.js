// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "PortDive",
  tagline: "AI-driven portfolio deep dives. Build Conviction, Not Anxiety.",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://holgo99.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/portdive-pages/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "PortDive UG.", // Usually your GitHub org/user name.
  projectName: "PortDive", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"), // ← Must point to correct file
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl:
          //  "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.css")],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/og-image-1200x630.png",
      // Meta config
      metadata: [
        {
          name: "description",
          content:
            "Build conviction without anxiety. PortDive synthesizes Multi-AI models analyzing macro trends, technicals, sentiment, and fundamentals into unified investment decisions.",
        },
        {
          name: "keywords",
          content:
            "portfolio analysis, AI investing, consensus view, investment tools, fintech",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:image",
          content:
            "https://holgo99.github.io/portdive-pages/img/og-image-1200x630.png",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:image",
          content:
            "https://holgo99.github.io/portdive-pages/img/social-card-1200x675.png",
        },
        {
          name: "theme-color",
          content: "#1FA39B",
        },
      ],
      colorMode: {
        respectPrefersColorScheme: true,
      },
      sidebar: {
        hideable: true, // Make sidebar hideable on all sizes
        autoCollapseCategories: false,
      },
      navbar: {
        title: "PortDive",
        logo: {
          alt: "PortDive Logo",
          src: "img/portdive-logo-primary.svg",
        },
        // Auto-hide navbar on scroll (optional)
        hideOnScroll: false,
        items: [
          {
            type: "docSidebar",
            sidebarId: "docs",
            position: "left",
            label: "Analytics",
          },
          /*
          {
            type: "dropdown",
            label: "Resources",
            position: "left",
            items: [
              { label: "Analytics", to: "docs" },
              { label: "NVO", to: "docs/nvo" },
              { label: "ZETA", to: "docs/zeta" },
            ],
            },*/

          // Right items
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/holgo99/portdive-pages",
            label: "GitHub",
            position: "right",
          },
          {
            type: "search",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Analytics",
            items: [
              {
                label: "Analytics",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "X",
                href: "https://x.com/Holgo99",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} PortDive. All rights reserved. Built with Docusaurus.`,
      },
      // Theme config
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
