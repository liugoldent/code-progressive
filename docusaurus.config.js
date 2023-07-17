// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "__yeah! Code",
  tagline: "漸進一步-程式",
  url: "https://code-progressive.netlify.app/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/code.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-279PGEJ1XN',
        anonymizeIP: true,
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "__yeah! Code",
        logo: {
          alt: "My Site Logo",
          src: "img/code.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "程式筆記",
          },
        ],
      },
      algolia: {
        contextualSearch: true,
        placeholder: "Search in website",
        appId: "3TGXEHXUAQ",
        apiKey: "33fc9d43d54c6edc7e2cfad5aca67046",
        indexName: "code_progressive",
        externalUrlRegex: "external\\.com|domain\\.com",
        searchParameters: {},
        searchPagePath: "search",
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },
      },
      footer: {
        style: "dark",
        links: [
          // {
          //   title: "Docs",
          //   items: [
          //     {
          //       label: "Tutorial",
          //       to: "/docs/intro",
          //     },
          //   ],
          // },
          // {
          //   title: "Community",
          //   items: [
          //     {
          //       label: "Stack Overflow",
          //       href: "https://stackoverflow.com/questions/tagged/docusaurus",
          //     },
          //     {
          //       label: "Discord",
          //       href: "https://discordapp.com/invite/docusaurus",
          //     },
          //     {
          //       label: "Twitter",
          //       href: "https://twitter.com/docusaurus",
          //     },
          //   ],
          // },
          {
            title: "More",
            items: [
              // {
              //   label: "Blog",
              //   to: "/blog",
              // },
              {
                label: "__yeahPay",
                href: "https://www.instagram.com/__yeahpay/",
              },
              {
                label: "__stockFlight",
                href: "https://www.instagram.com/__stockflight/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} __yeah! Code`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      metadata: [
        { name: 'keyword', content: '每日選股, 台股' },
        { name: 'keyword', content: `${month}${day}選股` }
      ],
    }),
};

module.exports = config;


// <!-- Google tag (gtag.js) -->
// <script async src="https://www.googletagmanager.com/gtag/js?id=G-MV4MKGH442"></script>
// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());

//   gtag('config', 'G-MV4MKGH442');
// </script>
