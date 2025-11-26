<script setup lang="ts">
import { useAutoScroll } from '@/composables/use-auto-scroll'
import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import { createOrUpdateMessage, getOrCreateSession } from '@/services/chat-service'
import BaseSession from '@/sessions/BaseSession'
import OllamaSession from '@/sessions/OllamaSession'
import { useAppStore } from '@/stores/app-store'
import { computed, onBeforeMount, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatInput from './_components/ChatInput.vue'
import ChatMessages from './_components/ChatMessages.vue'

const appStore = useAppStore()
const storage = useLocalStorage()
const route = useRoute()
const router = useRouter()
const messagesScroll = useAutoScroll(useTemplateRef('messagesRef'))

const input = defineModel<string>('input', { default: '' })

const chat = ref<BaseSession>(new OllamaSession())
const think = ref<boolean>(false)
const currentMessageId = ref<number>()

const activeSession = computed(() => appStore.activeSession)

onBeforeMount(async () => {
  think.value = storage.getItem(LocalStorageEnum.Think) || false
})

messagesScroll.registerWatcher(() => chat.value.response.content || chat.value.response.thinking)

const onSendMessage = async () => {
  if (!appStore.selectedModel) {
    throw new Error('No model selected')
  }

  chat.value = new OllamaSession()

  appStore.activeSession = await getOrCreateSession(+(route.params.id || 0), {
    title: input.value,
    lastModel: appStore.selectedModel,
  })

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
  if (!appStore.selectedModel) {
    throw new Error('No model selected')
  }

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

const stopStreaming = () => {
  chat.value.abort()
}
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
