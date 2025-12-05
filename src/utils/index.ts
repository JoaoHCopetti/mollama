import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-dark.min.css'
import MarkdownIt from 'markdown-it'
import type { Component, VNode, VNodeProps } from 'vue'
import { createVNode, render } from 'vue'
import { fenceWrapperPlugin, tableWrapperPlugin } from './markdown-it-plugins'

export const markdown = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(str, { language: lang }).value
    }

    return str
  },
})
  .use(tableWrapperPlugin)
  .use(fenceWrapperPlugin)

export const timeDiffForHumans = (date: Date): string => {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) {
    return 'just now'
  }

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

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy: ', error)
    return false
  }
}

export const renderVNode = <
  T extends Component,
  P extends Record<string, any> = T extends new () => { $props: infer Props }
    ? Props & VNodeProps
    : Record<string, any> & VNodeProps,
>(
  component: T,
  props?: P,
): HTMLElement => {
  const vNode: VNode = createVNode(component, props)
  const container = document.createElement('div')

  render(vNode, container)

  return container
}

export const createElement = (tag: keyof HTMLElementTagNameMap, innerHTML: string) => {
  const el = document.createElement(tag)

  el.innerHTML = innerHTML

  return el
}
