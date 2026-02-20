<script setup lang="ts">
import ValidationError from '@/errors/ValidationError'
import BaseRequest from '@/providers/BaseRequest'
import {
  createAssistMessage,
  createErrorMessage,
  createUserMessage,
  getOrCreateSession,
} from '@/services/chat-service'
import { useAppStore } from '@/stores/app-store'
import { useChatInputStore } from '@/stores/chat-input-store'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatInput from './_partials/chat-input/ChatInput.vue'
import ChatMessages from './_partials/chat-messages/ChatMessages.vue'
import MollamaLogo from './_partials/MollamaLogo.vue'

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()
const request = ref<BaseRequest>()
const chatInputStore = useChatInputStore()

const currentAssistMessage = computed(() => request.value?.message)

const onMessageSend = async () => {
  if (!appStore.selectedModel) {
    throw new ValidationError('No model is selected')
  }

  if (!appStore.provider) {
    throw new ValidationError('No provider selected')
  }

  const content = chatInputStore.config.message
  chatInputStore.config.message = ''

  request.value = appStore.provider.createRequest(appStore.selectedModel)

  appStore.activeSession = await getOrCreateSession(+(route.params.id || 0), {
    title: content,
    lastModel: appStore.selectedModel,
  })

  await registerRequestListener()

  await createUserMessage(appStore.activeSession.id, { content })
  await handleRequest(appStore.activeSession.id)
}

const registerRequestListener = async () => {
  const sessionId = appStore.activeSession?.id

  if (!request.value || !sessionId) {
    throw new ValidationError(`No session is active`)
  }

  request.value.onMessageChange(async (message) => {
    if (message.response.done) {
      await createAssistMessage(sessionId, message, chatInputStore.config.prompt)

      if (!route.params.id) {
        router.push(`/sessions/${sessionId}`)
      }
    }
  })

  request.value.onError(async (message) => {
    await createErrorMessage(sessionId, message)

    if (!route.params.id) {
      router.push(`/sessions/${sessionId}`)
    }
  })
}

const handleRequest = async (sessionId: number) => {
  if (!appStore.selectedModel) {
    throw new ValidationError('No model is selected')
  }

  if (!request.value) {
    throw new ValidationError('No session is active')
  }

  await request.value.handleRequest({
    sessionId,
    model: appStore.selectedModel,
    think: chatInputStore.config.think,
    prompt: chatInputStore.config.prompt,
  })
}

const stopStreaming = () => {
  if (request.value) {
    request.value.abort()
    return
  }

  request.value = undefined
}

onMounted(async () => {
  appStore.onModelsFetched(() => {
    chatInputStore.restoreChatConfig()
  })
})
</script>

<template>
  <div class="flex h-full flex-col">
    <ChatMessages
      v-if="appStore.activeSession"
      :key="appStore.activeSession.id"
      :session-id="appStore.activeSession.id"
      :current-assist-message="currentAssistMessage"
    />

    <MollamaLogo
      v-else-if="appStore.activeSession === null"
      class="flex h-full w-full items-center justify-center"
    />

    <div class="relative mb-5 w-full px-5 sm:px-0">
      <div
        class="absolute -top-14 left-1/2 z-0 h-14 w-full -translate-x-1/2 bg-linear-0 from-base-100/80 to-transparent"
      />

      <ChatInput
        class="relative z-20 w-full sm:w-3/4"
        :current-assist-message="request?.message"
        @send="onMessageSend"
        @stop="stopStreaming"
      />
    </div>
  </div>
</template>
