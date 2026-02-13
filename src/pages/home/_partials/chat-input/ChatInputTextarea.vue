<script setup lang="ts">
import { useBreakpoints } from '@/composables/use-breakpoints'
import { useDynamicTextarea } from '@/composables/use-dynamic-textarea'
import type { MessageState } from '@/database/Message'
import { useChatInputStore } from '@/stores/chat-input-store'
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { onMounted, useTemplateRef } from 'vue'

const emit = defineEmits(['send', 'focus-change'])
const props = defineProps<{
  currentMessageState?: MessageState
}>()

const { screenGreaterThan } = useBreakpoints()

const textareaRef = useTemplateRef('textareaRef')
const dynamicTextarea = useDynamicTextarea(textareaRef, screenGreaterThan('sm') ? 150 : 100)
const shortcutsStore = useShortcutsStore()
const chatInputStore = useChatInputStore()

onMounted(() => {
  dynamicTextarea.adjustTextareaHeight()

  shortcutsStore.onPress('chat-focus', () => {
    if (textareaRef.value) {
      textareaRef.value.focus()
    }
  })
})

const onEnterKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') {
    return
  }

  setTimeout(dynamicTextarea.adjustTextareaHeight, 100)

  if (chatInputStore.config.message.trim() === '' && !event.shiftKey) {
    event.preventDefault()
    return
  }

  if (!event.shiftKey) {
    event.preventDefault()

    if (!props.currentMessageState?.isLoading) {
      emit('send')
    }
  }
}
</script>

<template>
  <textarea
    id="message"
    ref="textareaRef"
    v-model="chatInputStore.config.message"
    name="message"
    autofocus
    class="mb-4 w-full resize-none border-none bg-transparent px-0 font-sans text-[0.95rem] leading-7 placeholder-gray-500 focus-within:outline-0 sm:h-14"
    placeholder="Type anything"
    @keydown.enter="onEnterKeydown"
    @focusin="$emit('focus-change', true)"
    @focusout="$emit('focus-change', false)"
    @update:model-value="dynamicTextarea.adjustTextareaHeight"
  />
</template>
