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
      class="text-sm text-gray-400 mb-2"
    >
      <div v-if="message.state.isThinking">
        <span class="d-loading d-loading-ring d-loading-xs mr-1" />

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
      class="text-sm text-gray-500 mb-3 assistant-thought"
      v-html="htmlThinking"
    />
  </div>
</template>
