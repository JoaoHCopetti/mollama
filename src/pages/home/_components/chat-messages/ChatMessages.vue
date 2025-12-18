<script setup lang="ts">
import { db } from '@/database/db'
import type { AssistantMessage, MessageData } from '@/database/Message'
import { liveQuery } from 'dexie'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import { useChatScrollHandler } from '@/composables/use-chat-scroll-handler'
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import ChatMessagesAssistant from './ChatMessagesAssistant.vue'
import ChatMessagesUser from './ChatMessagesUser.vue'

defineEmits(['messages-mounted'])

const props = defineProps<{
  sessionId: number
  currentAssistMessage?: AssistantMessage
}>()

const subscription = useDexieSubscription<MessageData>()
const chatScrollHandler = useChatScrollHandler(useTemplateRef('messagesContainer'))

const messages = ref<MessageData[]>([])
const smoothScroll = ref(false)

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
  subscription.setupLiveQuery(
    liveQuery(() => db.messages.where('sessionId').equals(props.sessionId).toArray()),
  )

  subscription.onResultChange(async (result) => {
    messages.value = result

    await handleScrollbar()
  })
})

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
    class="h-full overflow-auto flex"
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
