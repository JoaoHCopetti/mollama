<script setup lang="ts">
import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import { db } from '@/database/db'
import BaseChat from '@/providers/BaseChat'
import OllamaChat from '@/providers/OllamaChat'
import { createOrUpdateMessage } from '@/services/chat-service'
import { useAppStore } from '@/stores/app-store'
import { clone, throttle } from 'lodash-es'
import { computed, onBeforeMount, ref, useTemplateRef, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatInput from './_components/ChatInput.vue'
import ChatMessages from './_components/ChatMessages.vue'

const appStore = useAppStore()
const storage = useLocalStorage()
const route = useRoute()
const router = useRouter()

const input = defineModel<string>('input', { default: '' })

const chat = ref<BaseChat>(new OllamaChat()) as Ref<BaseChat>
const think = ref<boolean>(false)
const currentMessageId = ref<number>()
const stickScrollToBottom = ref<boolean>(true)

const messagesContainer = useTemplateRef('messagesContainer')

const activeSession = computed(() => appStore.activeSession)

onBeforeMount(async () => {
  think.value = storage.getItem(LocalStorageEnum.Think) || false
})

const onSendMessage = async () => {
  const session = (appStore.activeSession = await getOrCreateSession())

  chat.value.resetState()

  await createOrUpdateMessage({
    content: input.value,
    role: 'user',
    sessionId: session.id,
  })

  input.value = ''

  stickScrollToBottom.value = true
  scrollToBottom()

  registerChatListener(session.id)

  await fetchResponse(session.id)
}

const registerChatListener = (sessionId: number) => {
  currentMessageId.value = undefined

  chat.value.onResponseChange(async (response) => {
    currentMessageId.value = await createOrUpdateMessage(
      {
        sessionId,
        content: response.content,
        thinking: response.thinking,
        role: 'assistant',
      },
      currentMessageId.value,
    )

    if (response.done) {
      router.push(`/sessions/${sessionId}`)
    }
  })
}

const fetchResponse = async (sessionId: number) => {
  if (!appStore.selectedModel) throw new Error('No model selected')

  await chat.value.fetchResponse({
    sessionId,
    model: appStore.selectedModel.name,
    stream: true,
    think: think.value,
    messages: [
      {
        content: input.value,
        role: 'user',
      },
    ],
  })
}

const getOrCreateSession = async () => {
  const session = await db.sessions.get(+route.params.id! || 0)

  if (session) return session
  if (!appStore.selectedModel) throw new Error('No model selected')

  const id = await db.sessions.add({
    title: input.value.substring(0, 100),
    lastModel: clone(appStore.selectedModel),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  return (await db.sessions.get(id))!
}

const stopMessage = () => {
  chat.value.abort()
}
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({ top: messagesContainer.value.scrollHeight })
  }
}

const handleMessagesScroll = throttle(() => {
  if (!messagesContainer.value) {
    return
  }

  const maxScrollTop = messagesContainer.value.scrollHeight - messagesContainer.value.clientHeight
  const isBottomHit = Math.trunc(maxScrollTop) - 10 <= Math.trunc(messagesContainer.value.scrollTop)

  if (isBottomHit) {
    stickScrollToBottom.value = true
    return
  }

  stickScrollToBottom.value = false
}, 50)

watch(
  () => chat.value.response.content || chat.value.response.thinking,
  () => {
    if (stickScrollToBottom.value) {
      scrollToBottom()
    }
  },
)
</script>

<template>
  <div class="h-full flex flex-col">
    <div
      ref="messagesContainer"
      class="mt-10 h-full overflow-auto"
      @scroll="handleMessagesScroll"
    >
      <ChatMessages
        v-if="activeSession"
        class="w-3/4"
        :session-id="activeSession.id"
        :chat-state="chat.state"
        :current-message-id="currentMessageId"
      />
    </div>

    <div class="mb-5">
      <ChatInput
        v-model:input="input"
        v-model:think="think"
        class="w-3/4"
        :chat-state="chat.state"
        @send="onSendMessage"
        @stop="stopMessage"
      />
    </div>
  </div>
</template>
