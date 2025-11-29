<script setup lang="ts">
import type { AssistantMessage, AssistantMessageTemp } from '@/database/Message'
import { markdown } from '@/utils'
import { computed } from 'vue'
import ChatMessagesAssistantHeader from './ChatMessagesAssistantHeader.vue'
import ChatMessagesAssistantThinking from './ChatMessagesAssistantThinking.vue'

const props = defineProps<{
  message: AssistantMessage | AssistantMessageTemp
}>()

const htmlContent = computed(() => markdown.render(props.message.content))
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="message-container rounded-2xl w-4/5 wrap-break-word leading-7">
    <ChatMessagesAssistantHeader :message="message" />

    <div
      v-if="message.state.isLoading && !message.state.isStreaming"
      class="dui-loading dui-loading-sm dui-loading-ring"
    />

    <ChatMessagesAssistantThinking
      v-else
      :message="message"
    />

    <div
      class="assistant-message"
      v-html="htmlContent"
    />
  </div>
</template>
