import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

const config: Config = {
    title: 'The Answer AI',
    tagline: 'Intelligent Answers, Instantly',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://docs.theanswer.ai',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'The Answer AI', // Usually your GitHub org/user name.
    projectName: 'docusaurus', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en']
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Set this to true to use autogenerated sidebars
                    routeBasePath: 'docs',
                    sidebarItemsGenerator: async function ({ defaultSidebarItemsGenerator, ...args }) {
                        const sidebarItems = await defaultSidebarItemsGenerator(args)
                        return sidebarItems
                    }
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true
                    },
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn'
                },
                theme: {
                    customCss: './src/components/HomepageFeatures/styles.module.css'
                }
            } satisfies Preset.Options
        ]
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'AnswerAI',
            logo: {
                alt: 'AnswerAI Logo',
                src: 'img/logo.svg',
                srcDark: 'img/answerai-logo-600-wide-white.png' // Add this line for dark mode logo
            },
            items: [
                {
                    to: '/docs/using-answerai',
                    label: 'Using AnswerAI',
                    position: 'left'
                },
                {
                    to: '/docs/developers',
                    label: 'Developers',
                    position: 'left'
                },
                {
                    to: '/docs/use-cases',
                    label: 'Use Cases',
                    position: 'left'
                },
                {
                    to: '/docs/community',
                    label: 'Community',
                    position: 'left'
                },
                {
                    href: 'https://github.com/answers-ai/answerai',
                    label: 'GitHub',
                    position: 'right'
                }
            ]
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Tutorial',
                            to: '/docs/intro'
                        }
                    ]
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Stack Overflow',
                            href: 'https://stackoverflow.com/questions/tagged/docusaurus'
                        },
                        {
                            label: 'Discord',
                            href: 'https://discordapp.com/invite/docusaurus'
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/docusaurus'
                        }
                    ]
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog'
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/facebook/docusaurus'
                        }
                    ]
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula
        }
    } satisfies Preset.ThemeConfig
}

export default config
