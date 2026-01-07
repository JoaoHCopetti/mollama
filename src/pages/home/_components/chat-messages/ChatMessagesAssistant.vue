<script setup lang="ts">
import AppModelInfo from '@/components/AppModelInfo.vue'
import type { AssistantMessage, SystemMessage } from '@/database/Message'
import { createElement, markdown } from '@/utils'
import { DiffDOM } from 'diff-dom'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import ChatMessagesAssistantFooter from './ChatMessagesAssistantFooter.vue'
import ChatMessagesAssistantHeader from './ChatMessagesAssistantHeader.vue'
import ChatMessagesAssistantThinking from './ChatMessagesAssistantThinking.vue'

const diffDOM = new DiffDOM()

const props = defineProps<{
  message: AssistantMessage
  system?: SystemMessage
}>()

const markdownRef = useTemplateRef('markdownRef')

const htmlContent = computed(() => markdown.render(props.message.content))

onMounted(() => {
  if (markdownRef.value) {
    markdownRef.value.innerHTML = htmlContent.value
  }
})

// Try to avoid text selection cancel
// when new tokens are being generated
watch(htmlContent, (newHTML) => {
  if (!markdownRef.value) {
    return
  }

  const el = createElement('div', newHTML)
  const diff = diffDOM.diff(markdownRef.value, el)

  diffDOM.apply(markdownRef.value, diff)
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="assistant-message group">
    <ChatMessagesAssistantHeader>
      <AppModelInfo :model="message.model" />
    </ChatMessagesAssistantHeader>

    <div
      v-if="message.state.isLoading && !message.state.isStreaming"
      class="d-loading h-12 d-loading-ring"
    />

    <ChatMessagesAssistantThinking
      v-else
      :message="message"
    />

    <div ref="markdownRef" />

    <ChatMessagesAssistantFooter
      v-if="message.response.done"
      class="group-hover:opacity-100"
      :message="message"
      :system="system"
    />

    <div
      v-else
      class="h-10"
    />
  </div>
</template>
