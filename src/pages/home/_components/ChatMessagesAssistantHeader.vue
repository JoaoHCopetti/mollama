<script setup lang="ts">
import AppModelInfo from '@/components/AppModelInfo.vue'
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
  </div>
</template>
