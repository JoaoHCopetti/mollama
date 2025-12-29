<script setup lang="ts">
import { db } from '@/database/db'
import type { AssistantMessage, MessageData } from '@/database/Message'
import { liveQuery } from 'dexie'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import { useChatScrollHandler } from '@/composables/use-chat-scroll-handler'
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import ChatMessagesAssistant from './ChatMessagesAssistant.vue'
import ChatMessagesError from './ChatMessagesError.vue'
import ChatMessagesUser from './ChatMessagesUser.vue'

const props = defineProps<{
  sessionId: number
  currentAssistMessage?: AssistantMessage
}>()

const subscription = useDexieSubscription<MessageData>()
const chatScrollHandler = useChatScrollHandler(useTemplateRef('messagesContainer'))

const messages = ref<MessageData[]>([])
const smoothScroll = ref(false)

const computedMessages = computed<MessageData[]>(() => {
  if (props.currentAssistMessage) {
    return [...messages.value, getTempAssistMessage()]
  }

  return [...messages.value]
})

onMounted(() => {
  chatScrollHandler.stickToBottom.value = true

  subscription.setupLiveQuery(
    liveQuery(() => db.messages.where('sessionId').equals(props.sessionId).toArray()),
  )

  subscription.onResultChange(async (result) => {
    messages.value = result
    chatScrollHandler.stickToBottom.value = true
    await handleScrollbar()
  })
})

const getTempAssistMessage = (): MessageData => {
  const now = new Date().toISOString()

  return {
    id: 0,
    sessionId: 0,
    role: 'assistant',
    assistant: props.currentAssistMessage,
    createdAt: now,
    updatedAt: now,
  }
}

const handleScrollbar = async () => {
  if (chatScrollHandler.stickToBottom.value) {
    await nextTick(chatScrollHandler.scrollToBottom)

    if (!smoothScroll.value) {
      smoothScroll.value = true
    }
  }
}

watch(
  () => props.currentAssistMessage?.tokens.length,
  () => {
    if (chatScrollHandler.stickToBottom.value) {
      nextTick(chatScrollHandler.scrollToBottom)
    }
  },
)
</script>

<template>
  <div
    ref="messagesContainer"
    class="h-full overflow-auto flex chat"
    :class="{
      'scroll-smooth': smoothScroll,
    }"
    @scroll="chatScrollHandler.handleScroll"
  >
    <div class="w-3/4 mt-10 mx-auto flex flex-col gap-10">
      <div
        v-for="message in computedMessages"
        :key="message.id"
        class="last:pb-10"
      >
        <ChatMessagesAssistant
          v-if="message.assistant"
          :message="message.assistant"
          :system="message.system"
        />

        <ChatMessagesUser
          v-else-if="message.user"
          class="-mt-5"
          :message="message.user"
        />

        <ChatMessagesError
          v-else-if="message.error"
          :error="message.error"
        />
      </div>
    </div>
  </div>
</template>
