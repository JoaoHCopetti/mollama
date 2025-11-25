import 'highlight.js/styles/stackoverflow-dark.min.css'
import MarkdownIt from 'markdown-it'

const CUSTOM_WRAPPER_CLASSES = {
  table: 'md-table-wrapper',
  fence: 'md-fence-wrapper',
}

export const tableWrapperPlugin = (md: MarkdownIt) => {
  const className = CUSTOM_WRAPPER_CLASSES['table']
  const defaultTableOpen = md.renderer.rules.table_open
  const defaultTableClose = md.renderer.rules.table_close

  md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    const original = defaultTableOpen
      ? defaultTableOpen(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
    return `<div class="${className}">${original}`
  }

  md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
    const original = defaultTableClose
      ? defaultTableClose(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
    return `${original}</div>`
  }
}

export const fenceWrapperPlugin = (md: MarkdownIt) => {
  const className = CUSTOM_WRAPPER_CLASSES['fence']
  const defaultRenderer = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    const language = token?.info ? token.info.trim() : ''

    const originalRender = defaultRenderer
      ? defaultRenderer(tokens, idx, options, env, self)
      : token?.content

    return `
        <div class="${className}">
          <div class="md-fence-header flex justify-between items-center">
            <span class="language-name">${language}</span>
            <button class="dui-btn dui-btn-xs dui-btn-ghost">COPY</button>
          </div>
          ${originalRender}
        </div>
      `
  }
}
