<script setup lang="ts">
import { useElementScroll } from '@/composables/use-element-scroll'
import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import { db } from '@/database/db'
import { createOrUpdateMessage } from '@/services/chat-service'
import BaseSession from '@/sessions/BaseSession'
import OllamaSession from '@/sessions/OllamaSession'
import { useAppStore } from '@/stores/app-store'
import { clone } from 'lodash-es'
import { computed, onBeforeMount, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatInput from './_components/ChatInput.vue'
import ChatMessages from './_components/ChatMessages.vue'

const appStore = useAppStore()
const storage = useLocalStorage()
const route = useRoute()
const router = useRouter()
const messagesScroll = useElementScroll(useTemplateRef('messagesRef'))

const input = defineModel<string>('input', { default: '' })

const chat = ref<BaseSession>(new OllamaSession())
const think = ref<boolean>(false)
const currentMessageId = ref<number>()

const activeSession = computed(() => appStore.activeSession)

onBeforeMount(async () => {
  think.value = storage.getItem(LocalStorageEnum.Think) || false
})

const onSendMessage = async () => {
  chat.value = new OllamaSession()

  appStore.activeSession = await getOrCreateSession()

  await createOrUpdateMessage({
    content: input.value,
    role: 'user',
    sessionId: appStore.activeSession.id,
  })

  input.value = ''

  messagesScroll.stickScrollToBottom.value = true
  messagesScroll.scrollToBottom()

  registerChatListener(appStore.activeSession.id)

  await handleResponse(appStore.activeSession.id)
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

const handleResponse = async (sessionId: number) => {
  if (!appStore.selectedModel) throw new Error('No model selected')

  await chat.value.handleResponse({
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

const stopStreaming = () => {
  chat.value.abort()
}

watch(
  () => chat.value.response?.content || chat.value.response?.thinking,
  () => {
    if (messagesScroll.stickScrollToBottom.value) {
      messagesScroll.scrollToBottom()
    }
  },
)
</script>

<template>
  <div class="h-full flex flex-col">
    <div
      ref="messagesRef"
      class="h-full overflow-auto"
      @scroll="messagesScroll.handleBottomFixedScroll"
    >
      <ChatMessages
        v-if="activeSession"
        class="w-3/4 mt-5"
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
        @stop="stopStreaming"
      />
    </div>
  </div>
</template>
