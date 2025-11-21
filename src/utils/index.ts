import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-dark.min.css'
import MarkdownIt from 'markdown-it'

export const timeDiffForHumans = (date: Date): string => {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'

  const intervals: [string, number][] = [
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]

  for (const [unit, secondsInUnit] of intervals) {
    const interval = Math.floor(seconds / secondsInUnit)

    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}

export const focusChatTextarea = () => {
  const messageInput = document.querySelector<HTMLTextAreaElement>('#message')

  if (messageInput) {
    messageInput.focus()
  }
}

export const markdown = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(str, { language: lang }).value
    }

    return str
  },
}).use(sfcPlugin)
