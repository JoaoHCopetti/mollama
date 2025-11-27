<script setup lang="ts">
import type { MessageData, TempMessage } from '@/database/Message'
import { markdown } from '@/utils'
import { computed } from 'vue'
import ChatMessagesItemHeader from './ChatMessagesItemHeader.vue'

const props = defineProps<{
  message: MessageData | TempMessage
}>()

const htmlThinking = computed(
  () => props.message.thinking && markdown.render(props.message.thinking),
)

const htmlContent = computed(() =>
  props.message.role === 'user' ? props.message.content : markdown.render(props.message.content),
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
    <ChatMessagesItemHeader :message="message" />

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
