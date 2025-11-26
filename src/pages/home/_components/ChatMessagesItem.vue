<script setup lang="ts">
import type { MessageData } from '@/database/Message'
import type { ChatState } from '@/types'
import { markdown } from '@/utils'
import { computed } from 'vue'

const props = defineProps<{
  message: MessageData
  chatState: ChatState
  currentMessageId?: number
}>()

const htmlContent = computed(() =>
  props.message.role === 'user' ? props.message.content : markdown.render(props.message.content),
)

const htmlThinking = computed(
  () => props.message.thinking && markdown.render(props.message.thinking),
)
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="message-container py-3 rounded-2xl last:mb-10 w-4/5 wrap-break-word leading-7"
    :class="{
      'bg-base-200 ml-auto px-4': message.role === 'user',
    }"
  >
    <div
      v-if="message.thinking"
      class="text-sm text-gray-400 mb-2"
    >
      <template v-if="chatState.isThinking && message.id === currentMessageId">
        <span class="dui-loading dui-loading-ring dui-loading-xs mr-1" />

        <span class="animated-text">Thinking</span>
      </template>

      <div v-else-if="message.thinking">
        <span>Done thinking</span>
      </div>
    </div>

    <div
      v-if="message.thinking"
      class="text-sm text-gray-500 mb-3 whitespace-pre-line"
      v-html="htmlThinking"
    />

    <div
      :class="{ 'whitespace-pre-line': message.role === 'user' }"
      v-html="htmlContent"
    />
  </div>
</template>
