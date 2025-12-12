import DefaultTheme from 'vitepress/theme'
import CopyOrDownloadAsMarkdownButtons from 'vitepress-plugin-llms/vitepress-components/CopyOrDownloadAsMarkdownButtons.vue'

import type { Theme } from 'vitepress'

import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component(
      'CopyOrDownloadAsMarkdownButtons',
      CopyOrDownloadAsMarkdownButtons
    )
  }
} satisfies Theme
