<script setup lang="ts">
import type { AssistantMessage } from '@/database/Message'
import { markdown } from '@/utils'
import { computed } from 'vue'

const props = defineProps<{
  message: AssistantMessage
}>()

const htmlThinking = computed(
  () => props.message.thinking && markdown.render(props.message.thinking),
)
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
      v-if="htmlThinking"
      class="assistant-message-thought"
      v-html="htmlThinking"
    />
  </div>
</template>
