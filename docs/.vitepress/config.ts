import { defineConfig } from 'vitepress'
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'

import {
  description,
  discord,
  github,
  name,
  ogImage,
  ogUrl,
  releases,
  version
} from './meta'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: name,
  description,
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'David Abou' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:title', content: name }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: ogImage }]
  ],

  vite: {
    plugins: [llmstxt()]
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.svg',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'CLI', link: '/cli/' },
      {
        text: `v${version}`,
        items: [{ text: 'Release Notes', link: releases }]
      }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Quick Start', link: '/guide/quick-start' },
          { text: 'Core Concepts', link: '/guide/core-concepts' }
        ]
      },
      {
        text: 'Essentials',
        items: [
          { text: 'Commands', link: '/essentials/commands' },
          { text: 'Events', link: '/essentials/events' },
          { text: 'Components', link: '/essentials/components' }
        ]
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Middleware', link: '/advanced/middleware' },
          { text: 'Configuration', link: '/advanced/configuration' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: github },
      { icon: 'discord', link: discord }
    ],

    footer: {
      message:
        'Released under the <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a>.',
      copyright:
        'Copyright © 2024-present <a href="https://github.com/davidabou" target="_blank">David Abou</a>'
    },

    search: {
      provider: 'local'
    }
  },
  markdown: {
    config(md) {
      md.use(copyOrDownloadAsMarkdownButtons)
    }
  }
})
