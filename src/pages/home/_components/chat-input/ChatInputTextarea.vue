<script setup lang="ts">
import type { MessageState } from '@/database/Message'
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { onMounted, useTemplateRef } from 'vue'

const MAX_TEXTAREA_HEIGHT = 150

const props = defineProps<{
  currentMessageState?: MessageState
}>()
const emit = defineEmits(['send', 'focus-change'])

const textareaRef = useTemplateRef('textareaRef')
const shortcutsStore = useShortcutsStore()

const message = defineModel<string>('message', { default: '' })

onMounted(() => {
  adjustTextareaHeight()

  shortcutsStore.onPress('chat-focus', () => {
    if (textareaRef.value) {
      textareaRef.value.focus()
    }
  })
})

const adjustTextareaHeight = () => {
  if (!textareaRef.value) {
    return
  }

  const textarea = textareaRef.value

  textarea.style.height = 'auto'
  textarea.style.height =
    (textarea.scrollHeight < MAX_TEXTAREA_HEIGHT ? textarea.scrollHeight : MAX_TEXTAREA_HEIGHT) +
    'px'
}

const onEnterKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') {
    return
  }

  setTimeout(adjustTextareaHeight, 100)

  if (message.value.trim() === '' && !event.shiftKey) {
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
    v-model="message"
    name="message"
    autofocus
    class="bg-transparent h-14 font-sans text-[0.95rem] placeholder-gray-500 leading-7 min-h-14 px-0 w-full focus-within:outline-0 resize-none mb-4 border-none"
    placeholder="Type anything (CTRL + ALT + F)"
    @keydown.enter="onEnterKeydown"
    @focusin="$emit('focus-change', true)"
    @focusout="$emit('focus-change', false)"
    @update:model-value="adjustTextareaHeight"
  />
</template>
