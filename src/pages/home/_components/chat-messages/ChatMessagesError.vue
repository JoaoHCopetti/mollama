<script setup lang="ts">
import type { ErrorMessage } from '@/database/Message'
import { PhWarningCircle } from '@phosphor-icons/vue'

defineProps<{
  error: ErrorMessage
}>()
</script>

<template>
  <div class="message-container">
    <div class="text-error font-bold text-sm mb-3 uppercase flex items-center gap-2">
      <PhWarningCircle weight="fill" />

      <span>ERROR</span>
    </div>

    <div>{{ error.title }}</div>

    <div class="text-xs text-white/50">{{ error.content }}</div>
  </div>
</template>
