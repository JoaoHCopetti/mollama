<script setup lang="ts">
import type { AssistantMessage, AssistantMessageTemp } from '@/database/Message'
import { markdown } from '@/utils'
import { computed } from 'vue'
import ChatMessagesItemHeader from './ChatMessagesItemHeader.vue'

const props = defineProps<{
  message: AssistantMessage | AssistantMessageTemp
}>()

const htmlThinking = computed(
  () => props.message.thinking && markdown.render(props.message.thinking),
)

const htmlContent = computed(() => markdown.render(props.message.content))
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="message-container py-3 rounded-2xl last:mb-10 w-4/5 wrap-break-word leading-7">
    <ChatMessagesItemHeader :message="message" />

    <div
      v-if="htmlThinking"
      class="text-sm text-gray-500 mb-3"
      v-html="htmlThinking"
    />

    <div v-html="htmlContent" />
  </div>
</template>
