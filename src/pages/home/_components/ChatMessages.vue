<script setup lang="ts">
import { db } from '@/database/db'
import type { MessageData } from '@/database/Message'
import { liveQuery, type Subscription } from 'dexie'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ChatMessagesItem from './ChatMessagesItem.vue'

const props = defineProps<{
  sessionId: number
}>()

const messages = ref<MessageData[]>([])
const subscription = ref<Subscription>()

const setupLiveQuery = () => {
  if (subscription.value) {
    subscription.value.unsubscribe()
  }

  const messagesObservable = liveQuery(() => db.messages.where('sessionId').equals(props.sessionId).toArray())

  subscription.value = messagesObservable.subscribe({
    next: (result) => (messages.value = result),
    error: (error) => console.error(error),
  })
}

watch(() => props.sessionId, setupLiveQuery)

onMounted(() => {
  setupLiveQuery()
})

onBeforeUnmount(() => {
  if (subscription.value) {
    subscription.value.unsubscribe()
  }
})
</script>

<template>
  <div class="mx-auto flex flex-col gap-10">
    <template
      v-for="message in messages"
      :key="message.id"
    >
      <ChatMessagesItem :message="message" />
    </template>
  </div>
</template>

<style>
pre {
  line-height: 1.25rem !important;
  background-color: var(--color-base-200);
  padding: 1rem;
  border-radius: 0.25rem;
}

code:not([class]) {
  color: var(--color-warning-content);
  background-color: var(--color-warning);
  padding: 2px 5px;
  border-radius: 0.2rem;
}
</style>
