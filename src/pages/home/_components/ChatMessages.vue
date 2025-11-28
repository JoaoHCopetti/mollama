<script setup lang="ts">
import { db } from '@/database/db'
import type { AssistantMessage, AssistantMessageTemp, MessageData } from '@/database/Message'
import { copyToClipboard } from '@/utils'
import { liveQuery, type Subscription } from 'dexie'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import ChatMessagesAssistant from './ChatMessagesAssistant.vue'
import ChatMessagesUser from './ChatMessagesUser.vue'

const props = defineProps<{
  sessionId: number
  currentAssistMessage?: AssistantMessageTemp
}>()

const messages = ref<MessageData[]>([])
const subscription = ref<Subscription>()

const setupLiveQuery = () => {
  if (subscription.value) {
    subscription.value.unsubscribe()
  }

  const messagesObservable = liveQuery(() =>
    db.messages.where('sessionId').equals(props.sessionId).toArray(),
  )

  subscription.value = messagesObservable.subscribe({
    next: (result) => (messages.value = result),
    error: (error) => console.error(error),
  })
}

const registerCopyListeners = () => {
  const copyButtons = document.querySelectorAll('.md-fence-wrapper .md-fence-header button')

  if (!copyButtons.length) {
    return
  }

  copyButtons?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.md-fence-wrapper')?.querySelector('pre code')

      if (!code) {
        return
      }

      copyToClipboard(code.textContent)
    })
  })
}

onMounted(() => {
  setupLiveQuery()

  setTimeout(() => {
    registerCopyListeners()
  }, 100)
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
      <ChatMessagesAssistant
        v-if="message.role === 'assistant'"
        :message="message as AssistantMessage"
      />

      <ChatMessagesUser
        v-else
        :message="message"
      />
    </template>

    <ChatMessagesAssistant
      v-if="currentAssistMessage"
      :message="currentAssistMessage"
    />
  </div>
</template>
