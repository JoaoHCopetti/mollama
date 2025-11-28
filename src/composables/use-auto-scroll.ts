import { throttle } from 'lodash-es'
import { onBeforeUnmount, ref, watch, type WatchSource } from 'vue'

export const useAutoScroll = () => {
  const stickScrollToBottom = ref<boolean>()
  const el = ref<HTMLDivElement>()

  onBeforeUnmount(() => {
    if (el.value) {
      el.value.removeEventListener('scroll', handleBottomFixedScroll)
    }
  })

  const init = (refEl: HTMLDivElement) => {
    el.value = refEl
    el.value.addEventListener('scroll', handleBottomFixedScroll)
  }

  const scrollToBottom = () => {
    if (el.value) {
      el.value.scrollTo({ top: el.value.scrollHeight })
    }
  }

  const stickAndScrollToBottom = () => {
    stickScrollToBottom.value = true
    scrollToBottom()
  }

  const handleBottomFixedScroll = throttle(() => {
    if (!el.value) {
      throw new Error('Failed to handle scroll: template ref element is undefined')
    }

    const maxScrollTop = el.value.scrollHeight - el.value.clientHeight
    const isBottomHit = Math.trunc(maxScrollTop) - 10 <= Math.trunc(el.value.scrollTop)

    if (isBottomHit) {
      stickScrollToBottom.value = true
      return
    }

    stickScrollToBottom.value = false
  }, 25)

  const registerWatcher = (source: WatchSource[]) => {
    watch(source, () => {
      if (stickScrollToBottom.value) {
        scrollToBottom()
      }
    })
  }

  return {
    init,
    registerWatcher,
    stickScrollToBottom,
    stickAndScrollToBottom,
    scrollToBottom,
    handleBottomFixedScroll,
  }
}
