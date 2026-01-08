<script setup lang="ts">
import type { ErrorMessage } from '@/database/Message'
import { PhWarningCircle } from '@phosphor-icons/vue'

defineProps<{
  error: ErrorMessage
}>()
</script>

<template>
  <div class="assistant-message">
    <div class="mb-3 flex items-center gap-2 text-sm font-bold text-error uppercase">
      <PhWarningCircle weight="fill" />

      <span>ERROR</span>
    </div>

    <div>{{ error.title }}</div>

    <div class="text-xs text-white/50">{{ error.content }}</div>

    <div class="h-10" />
  </div>
</template>
