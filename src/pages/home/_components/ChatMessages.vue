<script setup lang="ts">
import { db } from '@/database/db'
import type { AssistantMessage, AssistantMessageTemp, MessageData } from '@/database/Message'
import { liveQuery, type Subscription } from 'dexie'
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

import { useAutoScroll } from '@/composables/use-auto-scroll'
import ChatMessagesAssistant from './ChatMessagesAssistant.vue'
import ChatMessagesUser from './ChatMessagesUser.vue'

defineEmits(['messages-mounted'])

const props = defineProps<{
  sessionId: number
  currentAssistMessage?: AssistantMessageTemp
}>()

const autoScrollMessages = useAutoScroll()
const messagesContainer = useTemplateRef('messagesContainer')
const messages = ref<MessageData[]>([])
const subscription = ref<Subscription>()
const smoothScroll = ref<boolean>(false)

autoScrollMessages.registerWatcher([
  () => props.currentAssistMessage?.thinking,
  () => props.currentAssistMessage?.content,
])

onMounted(() => {
  setupLiveQuery()

  if (messagesContainer.value) {
    autoScrollMessages.init(messagesContainer.value)
  }
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

      await nextTick()

      autoScrollMessages.stickAndScrollToBottom()
      smoothScroll.value = true
    },
    error: (error) => console.error(error),
  })
}
</script>

<template>
  <div
    ref="messagesContainer"
    class="h-full overflow-auto"
    :class="{
      'scroll-smooth': smoothScroll,
    }"
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
          v-if="message.role === 'assistant'"
          :message="message as AssistantMessage"
        />

        <ChatMessagesUser
          v-else
          class="-mt-5"
          :message="message"
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
