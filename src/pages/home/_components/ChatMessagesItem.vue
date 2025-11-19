<script setup lang="ts">
import type { MessageData } from '@/database/Message'
import { useAppStore } from '@/stores/app-store'
import 'highlight.js/styles/stackoverflow-dark.min.css'
import { computed } from 'vue'

const appStore = useAppStore()
const props = defineProps<{
  message: MessageData
}>()

const content = computed(() =>
  props.message.role === 'user' ? props.message.content : appStore.markdown.render(props.message.content),
)
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="py-3 w-full rounded-2xl last:mb-10 leading-7 max-w-4/5 wrap-break-word whitespace-pre-line"
    :class="{
      'bg-base-200 ml-auto px-4': message.role === 'user',
    }"
  >
    <div v-if="message.thinking">
      <div
        class="text-sm text-gray-500 mb-3"
        v-html="message.thinking"
      />
    </div>

    <div v-html="content" />
  </div>
</template>
