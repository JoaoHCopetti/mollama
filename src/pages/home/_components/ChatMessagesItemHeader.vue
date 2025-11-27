<script setup lang="ts">
import AppModelInfo from '@/components/AppModelInfo.vue'
import type { MessageInput } from '@/database/Message'

defineProps<{
  message: MessageInput
}>()
</script>

<template>
  <div>
    <div
      v-if="message.model"
      class="uppercase font-bold text-sm mb-3"
    >
      <AppModelInfo :model="message.model" />
    </div>

    <div
      v-if="message.response && message.thinking"
      class="text-sm text-gray-400 mb-2"
    >
      <template v-if="message.response.state.isThinking">
        <span class="dui-loading dui-loading-ring dui-loading-xs mr-1" />

        <span class="animated-text bg-linear-to-br from-gray-500 via-gray-300 to-gray-500">
          Thinking
        </span>
      </template>

      <div v-else>
        <span>Done thinking</span>
      </div>
    </div>
  </div>
</template>
