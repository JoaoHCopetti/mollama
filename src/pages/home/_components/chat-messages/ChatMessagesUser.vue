<script setup lang="ts">
import type { UserMessage } from '@/database/Message'

defineProps<{
  message: UserMessage
}>()
</script>

<template>
  <div
    class="assistant-message ml-auto w-4/5 rounded-2xl bg-base-200 px-4 py-3 leading-7 wrap-break-word whitespace-pre-line"
  >
    {{ message.content }}
  </div>
</template>
