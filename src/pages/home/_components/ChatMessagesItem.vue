<script setup lang="ts">
import type { MessageData } from '@/database/Message'
import { useAppStore } from '@/stores/app-store'
import type { ChatState } from '@/types'
import { computed } from 'vue'

const appStore = useAppStore()

const props = defineProps<{
  message: MessageData
  chatState: ChatState
  currentMessageId?: number
}>()

const htmlContent = computed(() => appStore.markdown.render(props.message.content))
const htmlThinking = computed(() => props.message.thinking && appStore.markdown.render(props.message.thinking))
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="py-3 w-full rounded-2xl last:mb-10 max-w-4/5 wrap-break-word leading-7"
    :class="{
      'bg-base-200 ml-auto px-4': message.role === 'user',
    }"
  >
    <div
      v-if="message.thinking"
      class="text-sm text-gray-400 mb-2"
    >
      <template v-if="chatState.isThinking && message.id === currentMessageId">
        <span class="loading loading-ring loading-xs mr-1" />

        <span>Thinking</span>
      </template>

      <div v-else-if="message.thinking && !chatState.isThinking">
        <span>Done thinking</span>
      </div>
    </div>

    <div v-if="htmlThinking">
      <div
        class="text-sm text-gray-500 mb-3 whitespace-pre-line"
        v-html="htmlThinking"
      />
    </div>

    <div v-html="htmlContent" />
  </div>
</template>

<style>
pre {
  line-height: 1.25rem !important;
  background-color: var(--color-base-200);
  padding: 1rem;
  border-radius: 0.25rem;
}

code:not([class]) {
  color: var(--color-warning-content);
  background-color: var(--color-warning);
  padding: 2px 4px;
  margin-right: 2px;
  border-radius: 0.2rem;
}
</style>
