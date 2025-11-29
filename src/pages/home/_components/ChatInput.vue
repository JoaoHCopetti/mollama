<script setup lang="ts">
import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import type BaseRequest from '@/providers/BaseRequest'
import { PhArrowFatUp, PhStop } from '@phosphor-icons/vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import ChatInputModels from './ChatInputModels.vue'

const MAX_TEXTAREA_HEIGHT = 150

const emit = defineEmits(['send', 'stop'])

const props = defineProps<{
  request?: BaseRequest
}>()

const storage = useLocalStorage()

const input = defineModel<string>('input', { default: '' })
const think = defineModel<boolean>('think', { default: false })

const textareaRef = useTemplateRef('textareaRef')
const isTextareaFocused = ref<boolean>(false)

const state = computed(() => props.request?.message?.state)

onMounted(() => {
  adjustTextareaHeight()
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

const onThinkChange = (e: Event) => {
  const target = e.target as HTMLInputElement

  storage.setItem(LocalStorageEnum.Think, target.checked)
}

const onMessageSend = (event: KeyboardEvent | PointerEvent) => {
  setTimeout(adjustTextareaHeight, 100)

  if (input.value.trim() === '') {
    return
  }

  if (event instanceof PointerEvent) {
    emit('send')
    return
  }

  if (event.key === 'Enter' && !event.shiftKey) {
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
      class="bg-transparent h-14 font-sans text-[0.95rem] leading-7 min-h-14 px-0 w-full focus-within:outline-0 resize-none mb-4 border-none"
      placeholder="Type anything..."
      @keydown="onMessageSend"
      @focusin="isTextareaFocused = true"
      @focusout="isTextareaFocused = false"
      @update:model-value="adjustTextareaHeight"
    />

    <div class="flex justify-between">
      <div class="flex items-center gap-2">
        <ChatInputModels />

        <label class="dui-label bg-base-200 py-1 pl-2 pr-3 text-sm rounded-full">
          <input
            v-model="think"
            type="checkbox"
            class="dui-toggle bg-base-300 border-base-300 dui-toggle-primary"
            @input="onThinkChange"
          />
          Think
        </label>
      </div>

      <div>
        <button
          v-if="!state?.isLoading"
          class="dui-btn dui-btn-primary"
          :disabled="input.trim() === ''"
          @click="onMessageSend"
        >
          <PhArrowFatUp
            class="text-xl"
            weight="fill"
          />
        </button>

        <button
          v-else
          class="dui-btn dui-btn-error"
          :disabled="state.isLoading && !state.isStreaming"
          @click="$emit('stop')"
        >
          <PhStop
            weight="fill"
            class="text-xl"
          />
        </button>
      </div>
    </div>
  </div>
</template>
