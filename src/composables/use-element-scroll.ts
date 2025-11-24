import { throttle } from 'lodash-es'
import { ref, type ShallowRef } from 'vue'

export const useElementScroll = (el: Readonly<ShallowRef<HTMLDivElement | null>>) => {
  const stickScrollToBottom = ref<boolean>()

  const scrollToBottom = () => {
    if (el.value) {
      el.value.scrollTo({ top: el.value.scrollHeight })
    }
  }

  const handleBottomFixedScroll = throttle(() => {
    if (!el.value) {
      throw new Error("Failed to handle scroll: couldn't access template ref element")
      return
    }

    const maxScrollTop = el.value.scrollHeight - el.value.clientHeight
    const isBottomHit = Math.trunc(maxScrollTop) - 10 <= Math.trunc(el.value.scrollTop)

    if (isBottomHit) {
      stickScrollToBottom.value = true
      return
    }

    stickScrollToBottom.value = false
  }, 50)

  return { stickScrollToBottom, scrollToBottom, handleBottomFixedScroll }
}
