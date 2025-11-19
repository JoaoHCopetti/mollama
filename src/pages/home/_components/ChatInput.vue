<script setup lang="ts">
import { LocalStorageEnum } from '@/composables/use-local-storage'
import { useAppStore } from '@/stores/app-store'
import type { ChatState } from '@/types'
import { onMounted, ref, useTemplateRef } from 'vue'
import ChatInputModels from './ChatInputModels.vue'

const MAX_TEXTAREA_HEIGHT = 150

const emit = defineEmits(['send', 'stop'])

defineProps<{
  chatState: ChatState
}>()

const input = defineModel<string>('input', { default: '' })
const think = defineModel<boolean>('think', { default: false })

const textareaRef = useTemplateRef('textareaRef')
const isTextareaFocused = ref<boolean>(false)
const appStore = useAppStore()

onMounted(() => {
  adjustTextareaHeight()
})

const adjustTextareaHeight = () => {
  if (!textareaRef.value) return

  const textarea = textareaRef.value

  textarea.style.height = 'auto'
  textarea.style.height =
    (textarea.scrollHeight < MAX_TEXTAREA_HEIGHT ? textarea.scrollHeight : MAX_TEXTAREA_HEIGHT) + 'px'
}

const onThinkChange = (e: Event) => {
  const target = e.target as HTMLInputElement

  appStore.setItem(LocalStorageEnum.Think, target.checked)
}

const onMessageSend = (event: KeyboardEvent | PointerEvent) => {
  if (input.value.trim() === '') return

  if (event instanceof PointerEvent) {
    emit('send')
    return
  }

  if (event.key === 'Enter') {
    if (event.shiftKey) return

    event.preventDefault()
    emit('send')
  }
}
</script>

<template>
  <div
    class="bg-base-300 p-4 rounded-3xl mx-auto shadow-2xl"
    :class="{
      'outline-gray-400 outline-2': isTextareaFocused,
    }"
  >
    <textarea
      id="message"
      ref="textareaRef"
      v-model="input"
      name="message"
      class="bg-transparent min-h-20 px-0 w-full focus-within:outline-0 resize-none mb-4 border-none"
      placeholder="Type anything..."
      @input="adjustTextareaHeight"
      @keydown="onMessageSend"
      @focusin="isTextareaFocused = true"
      @focusout="isTextareaFocused = false"
    />

    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <ChatInputModels />

        <label class="label bg-base-200 py-1 pl-2 pr-3 text-sm rounded-full">
          <input
            v-model="think"
            type="checkbox"
            class="toggle bg-base-300 border-base-300 toggle-primary"
            @input="onThinkChange"
          />
          Think
        </label>
      </div>

      <div>
        <button
          v-if="true"
          class="btn btn-primary"
          :disabled="input.trim() === ''"
          @click="onMessageSend"
        >
          Send
        </button>

        <button
          v-else
          class="btn btn-error"
          @click="$emit('stop')"
        >
          Stop
        </button>
      </div>
    </div>
  </div>
</template>

<style>
textarea {
  font-family: 'Albert Sans';
  font-size: 1.05rem;
}
</style>
