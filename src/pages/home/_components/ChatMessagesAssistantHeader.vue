<script setup lang="ts">
import AppModelInfo from '@/components/AppModelInfo.vue'
import type { AssistantMessage } from '@/database/Message'

defineProps<{
  message: AssistantMessage
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
