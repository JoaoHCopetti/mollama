<script setup lang="ts">
import type { AssistantMessage } from '@/database/Message'
import { createElement, markdown } from '@/utils'
import { DiffDOM } from 'diff-dom'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import ChatMessagesAssistantActions from './ChatMessagesAssistantActions.vue'
import ChatMessagesAssistantHeader from './ChatMessagesAssistantHeader.vue'
import ChatMessagesAssistantThinking from './ChatMessagesAssistantThinking.vue'

const diffDOM = new DiffDOM()

const props = defineProps<{
  message: AssistantMessage
}>()

const htmlContent = computed(() => markdown.render(props.message.content))
const markdownRef = useTemplateRef('markdownRef')

onMounted(() => {
  if (markdownRef.value) {
    markdownRef.value.innerHTML = htmlContent.value
  }
})

// Try to avoid text selection cancel
// when new tokens are generated
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
  <div class="message-container group rounded-2xl w-4/5 wrap-break-word leading-7">
    <ChatMessagesAssistantHeader :message="message" />

    <div
      v-if="message.state.isLoading && !message.state.isStreaming"
      class="dui-loading dui-loading-sm dui-loading-ring"
    />

    <ChatMessagesAssistantThinking
      v-else
      :message="message"
    />

    <div ref="markdownRef" />

    <ChatMessagesAssistantActions
      v-if="message.response.done"
      :message="message"
    />
  </div>
</template>
