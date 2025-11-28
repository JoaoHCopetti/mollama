<script setup lang="ts">
import type { AssistantMessage, AssistantMessageTemp } from '@/database/Message'
import { markdown } from '@/utils'
import { computed } from 'vue'
import ChatMessagesSharedHeader from './ChatMessagesSharedHeader.vue'
import ChatMessagesSharedThinking from './ChatMessagesSharedThinking.vue'

const props = defineProps<{
  message: AssistantMessage | AssistantMessageTemp
}>()

const htmlContent = computed(() => markdown.render(props.message.content))
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="message-container rounded-2xl w-4/5 wrap-break-word leading-7">
    <ChatMessagesSharedHeader :message="message" />

    <div v-if="message.state.isLoading && !message.state.isStreaming && !message.thinking">
      Loading
    </div>

    <ChatMessagesSharedThinking
      v-if="message.thinking"
      :message="message"
    />

    <div v-html="htmlContent" />
  </div>
</template>
