<script setup lang="ts">
import { db } from '@/database/db'
import type { AssistantMessage, MessageData } from '@/database/Message'
import { liveQuery, type Subscription } from 'dexie'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import ChatMessagesAssistant from './ChatMessagesAssistant.vue'
import ChatMessagesUser from './ChatMessagesUser.vue'

defineEmits(['messages-mounted'])

const props = defineProps<{
  sessionId: number
  currentAssistMessage?: AssistantMessage
}>()

const messages = ref<MessageData[]>([])
const subscription = ref<Subscription>()

const computedMessages = computed(() => {
  if (props.currentAssistMessage) {
    return [
      ...messages.value,
      { id: 'current', assistant: props.currentAssistMessage, user: undefined },
    ]
  }

  return [...messages.value]
})

onMounted(() => {
  setupLiveQuery()
})

onBeforeUnmount(() => {
  if (subscription.value) {
    subscription.value.unsubscribe()
  }
})

const setupLiveQuery = () => {
  const messagesObservable = liveQuery(() =>
    db.messages.where('sessionId').equals(props.sessionId).toArray(),
  )

  subscription.value = messagesObservable.subscribe({
    next: async (result) => {
      messages.value = result
    },
    error: (error) => console.error(error),
  })
}
</script>

<template>
  <div
    ref="messagesContainer"
    class="h-full overflow-auto flex flex-col-reverse"
  >
    <div class="w-3/4 mt-10 mx-auto flex flex-col gap-10">
      <div
        v-for="message in computedMessages"
        :key="message.id"
        class="last:mb-10"
      >
        <ChatMessagesAssistant
          v-if="message.assistant"
          :message="message.assistant"
        />

        <ChatMessagesUser
          v-else
          class="-mt-5"
          :message="message.user!"
        />
      </div>
    </div>
  </div>
</template>
