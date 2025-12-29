import { ref, type ShallowRef } from 'vue'

export const useChatScrollHandler = (containerRef: Readonly<ShallowRef<HTMLDivElement | null>>) => {
  const stickToBottom = ref(false)

  const scrollToBottom = () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  }

  const handleScroll = async () => {
    if (!containerRef.value) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = containerRef.value

    stickToBottom.value = scrollHeight - scrollTop - clientHeight < 10
  }

  return {
    stickToBottom,
    scrollToBottom,
    handleScroll,
  }
}
