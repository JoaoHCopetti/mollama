import { throttle } from 'lodash-es'
import { ref, watch, type ShallowRef, type WatchSource } from 'vue'

export const useAutoScroll = (el: Readonly<ShallowRef<HTMLDivElement | null>>) => {
  const stickScrollToBottom = ref<boolean>()

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
  }, 50)

  const registerWatcher = (source: WatchSource) => {
    watch(source, () => {
      if (stickScrollToBottom.value) {
        scrollToBottom()
      }
    })
  }

  return {
    registerWatcher,
    stickScrollToBottom,
    stickAndScrollToBottom,
    scrollToBottom,
    handleBottomFixedScroll,
  }
}
