<script setup lang="ts">
import { useDynamicTextarea } from '@/composables/use-dynamic-textarea'
import type { MessageState } from '@/database/Message'
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { onMounted, useTemplateRef } from 'vue'

const props = defineProps<{
  currentMessageState?: MessageState
}>()
const emit = defineEmits(['send', 'focus-change'])

const textareaRef = useTemplateRef('textareaRef')
const dynamicTextarea = useDynamicTextarea(textareaRef)
const shortcutsStore = useShortcutsStore()

const message = defineModel<string>('message', { default: '' })

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

  dynamicTextarea.adjustTextareaHeight()

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
    @update:model-value="dynamicTextarea.adjustTextareaHeight"
  />
</template>
