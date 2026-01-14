<script setup lang="ts">
import type { AssistantMessage } from '@/database/Message'

defineProps<{
  message: AssistantMessage
}>()

/*
  There's a bug when rendering the thought process as html and a fence code is written.
  Still figuring out.
  It hides all the content and show an empty fence code.

  const htmlThinking = computed(() => {
    return props.message.thinking && markdown.render(props.message.thinking)
  })
 */
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div
      v-if="message.response && message.thinking"
      class="mb-2 text-sm text-gray-400"
    >
      <div v-if="message.state.isThinking">
        <span class="d-loading mr-1 d-loading-xs d-loading-ring" />

        <span
          class="animated-text bg-linear-to-br from-gray-500 via-gray-300 to-gray-500"
          :style="{ 'animation-duration': '1s' }"
        >
          Thinking
        </span>
      </div>

      <div v-else>
        <span>Done thinking</span>
      </div>
    </div>

    <div
      class="assistant-message-thought whitespace-pre-wrap"
      v-html="message.thinking"
    />
  </div>
</template>
