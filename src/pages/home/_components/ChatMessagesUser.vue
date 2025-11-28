<script setup lang="ts">
import type { UserMessage } from '@/database/Message'

defineProps<{
  message: UserMessage
}>()
</script>

<template>
  <div
    class="message-container py-3 px-4 rounded-2xl last:mb-10 w-4/5 wrap-break-word leading-7 bg-base-200 ml-auto whitespace-pre-line"
  >
    {{ message.content }}
  </div>
</template>
