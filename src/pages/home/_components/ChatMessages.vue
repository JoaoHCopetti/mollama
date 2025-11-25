<script setup lang="ts">
import { db } from '@/database/db'
import type { MessageData } from '@/database/Message'
import type { ChatState } from '@/types'
import { copyToClipboard } from '@/utils'
import { liveQuery, type Subscription } from 'dexie'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ChatMessagesItem from './ChatMessagesItem.vue'

const props = defineProps<{
  sessionId: number
  chatState: ChatState
  currentMessageId?: number
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
  const copyButtons = document.querySelectorAll('.language button')

  if (!copyButtons.length) {
    return
  }

  copyButtons?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.md-fence-wrapper')?.querySelector('pre code')

      if (!code) {
        return
      }

      console.log('copied')
      copyToClipboard(code.textContent)
    })
  })
}

watch(
  () => props.sessionId,
  () => {
    setupLiveQuery()
    setTimeout(() => {
      registerCopyListeners()
    }, 100)
  },
)

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
    <ChatMessagesItem
      v-for="message in messages"
      :key="message.id"
      :chat-state="chatState"
      :message="message"
      :current-message-id="currentMessageId"
    />
  </div>
</template>
