<script setup lang="ts">
import { db } from '@/database/db'
import type { AssistantMessage, MessageData } from '@/database/Message'
import { liveQuery, type Subscription } from 'dexie'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { useAutoScroll } from '@/composables/use-auto-scroll'
import ChatMessagesAssistant from './ChatMessagesAssistant.vue'
import ChatMessagesUser from './ChatMessagesUser.vue'

defineEmits(['messages-mounted'])

const props = defineProps<{
  sessionId: number
  currentAssistMessage?: AssistantMessage
}>()

const autoScrollMessages = useAutoScroll()
const messages = ref<MessageData[]>([])
const subscription = ref<Subscription>()

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
    class="h-full overflow-auto"
  >
    <div class="w-3/4 mt-10 mx-auto flex flex-col gap-10">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{
          'last:mb-10': !currentAssistMessage,
        }"
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

      <ChatMessagesAssistant
        v-if="currentAssistMessage"
        class="mb-10"
        :message="currentAssistMessage"
        @vue:mounted="autoScrollMessages.stickAndScrollToBottom()"
      />
    </div>
  </div>
</template>
