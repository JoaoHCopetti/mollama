<script setup lang="ts">
import AppModelInfo from '@/components/AppModelInfo.vue'
import AppTransition from '@/components/AppTransition.vue'
import type { AssistantMessage, AssistantMessageTemp } from '@/database/Message'

defineProps<{
  message: AssistantMessage | AssistantMessageTemp
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
      <AppTransition
        from-class="opacity-0"
        to-class="opacity-100"
      >
        <div v-if="message.state.isThinking">
          <span class="dui-loading dui-loading-ring dui-loading-xs mr-1" />

          <span class="animated-text bg-linear-to-br from-gray-500 via-gray-300 to-gray-500">
            Thinking
          </span>
        </div>

        <div v-else>
          <span>Done thinking</span>
        </div>
      </AppTransition>
    </div>
  </div>
</template>
