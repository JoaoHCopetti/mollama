<script setup lang="ts">
import type { MessageData } from '@/database/Message'
import type { ChatState } from '@/types'

defineProps<{
  message: MessageData
  chatState: ChatState
  isLastMessage: boolean
}>()
</script>

<template>
  <div>
    {{ message.model }}
    <div
      v-if="message.thinking"
      class="text-sm text-gray-400 mb-2"
    >
      <template v-if="isLastMessage && chatState.isThinking">
        <span class="dui-loading dui-loading-ring dui-loading-xs mr-1" />

        <span class="animated-text">Thinking</span>
      </template>

      <div v-else>
        <span>Done thinking</span>
      </div>
    </div>
  </div>
</template>
