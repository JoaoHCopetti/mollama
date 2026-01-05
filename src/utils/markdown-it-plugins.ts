import AppFenceBlock from '@/components/AppFenceBlock.vue'
import 'highlight.js/styles/stackoverflow-dark.min.css'
import MarkdownIt from 'markdown-it'
import { renderVNode } from '.'

const CUSTOM_WRAPPER_CLASSES = {
  table: 'markdown-table',
  fence: 'markdown-fence',
}

export const tableWrapperPlugin = (md: MarkdownIt) => {
  const className = CUSTOM_WRAPPER_CLASSES['table']
  const defaultTableOpen = md.renderer.rules.table_open
  const defaultTableClose = md.renderer.rules.table_close

  md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    const originalRender = defaultTableOpen
      ? defaultTableOpen(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)

    return `<div class="${className}">${originalRender}`
  }

  md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
    const originalRender = defaultTableClose
      ? defaultTableClose(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)

    return `${originalRender}</div>`
  }
}

export const fenceWrapperPlugin = (md: MarkdownIt) => {
  const defaultRenderer = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    const language = token?.info ? token.info.trim() : ''

    const originalRender = defaultRenderer
      ? defaultRenderer(tokens, idx, options, env, self)
      : token?.content

    return renderVNode(AppFenceBlock, {
      language,
      originalRender,
    }).outerHTML
  }
}
