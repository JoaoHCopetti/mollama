import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-dark.min.css'
import MarkdownIt from 'markdown-it'

export const useUtils = () => {
  const markdown = new MarkdownIt({
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(str, { language: lang }).value
      }

      return str
    },
  }).use(sfcPlugin)

  return { markdown }
}
