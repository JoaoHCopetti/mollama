<script setup lang="ts">
import AppTransition from '@/components/AppTransition.vue'
import { useLocalStorage } from '@/composables/use-local-storage'
import { db } from '@/database/db'
import ValidationError from '@/errors/ValidationError'
import BaseRequest from '@/providers/BaseRequest'
import {
  createAssistMessage,
  createErrorMessage,
  createUserMessage,
  getOrCreateSession,
} from '@/services/chat-service'
import { useAppStore } from '@/stores/app-store'
import type { InputConfig } from '@/types'
import { LocalStorageEnum } from '@/utils/enums'
import { computed, onBeforeMount, provide, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatEmpty from './_partials/MollamaLogo.vue'
import ChatInput, { type InputConfigPayload } from './_partials/chat-input/ChatInput.vue'
import ChatMessages from './_partials/chat-messages/ChatMessages.vue'
import { inputConfigKey } from './injection-keys'

const appStore = useAppStore()
const storage = useLocalStorage()
const route = useRoute()
const router = useRouter()
const inputConfig = ref<InputConfig>({ message: '', think: false })
const request = ref<BaseRequest>()

const currentAssistMessage = computed(() => request.value?.message)

provide(inputConfigKey, inputConfig.value)

onBeforeMount(async () => {
  restoreSelectedModel()
  restoreThinkMode()
  restoreSelectedPrompt()
})

const restoreSelectedModel = () => {
  const selectedModelId = storage.getItem(LocalStorageEnum.SelectedModelId)

  appStore.selectModel(selectedModelId)
  inputConfig.value.model = appStore.selectedModel
}

const restoreThinkMode = () => {
  inputConfig.value.think = storage.getItem(LocalStorageEnum.Think) || false
}

const restoreSelectedPrompt = async () => {
  const lastPromptId = storage.getItem(LocalStorageEnum.SelectedPromptId)

  if (lastPromptId) {
    const lastPrompt = await db.systemPrompts.get(lastPromptId)

    inputConfig.value.prompt = lastPrompt
  }
}

const onInputConfigChange = ({ type, inputConfig }: InputConfigPayload) => {
  if (type === 'model') {
    appStore.selectModel(inputConfig.model?.id)
  }
}

const onMessageSend = async () => {
  if (!appStore.selectedModel) {
    throw new ValidationError('No model is selected')
  }

  if (!appStore.provider) {
    throw new ValidationError('No provider selected')
  }

  const content = inputConfig.value.message
  inputConfig.value.message = ''

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
      await createAssistMessage(sessionId, message, inputConfig.value.prompt)

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
    think: inputConfig.value.think,
    prompt: inputConfig.value.prompt,
  })
}

const stopStreaming = () => {
  if (request.value) {
    request.value.abort()
    return
  }

  request.value = undefined
}
</script>

<template>
  <div class="flex h-full flex-col">
    <AppTransition
      from-class="opacity-0"
      to-class="opacity-100"
      active-class="animate-all duration-150 ease-in"
    >
      <ChatMessages
        v-if="appStore.activeSession"
        :key="appStore.activeSession.id"
        :session-id="appStore.activeSession.id"
        :current-assist-message="currentAssistMessage"
      />

      <ChatEmpty
        v-else-if="appStore.activeSession === null"
        class="flex h-full w-full items-center justify-center"
      />
    </AppTransition>

    <div class="relative mb-5 w-full px-5 sm:px-0">
      <div
        class="absolute -top-14 left-1/2 z-0 h-14 w-full -translate-x-1/2 bg-linear-0 from-base-100/80 to-transparent"
      />

      <ChatInput
        class="relative z-20 w-full sm:w-3/4"
        :current-assist-message="request?.message"
        @update:input-config="onInputConfigChange"
        @send="onMessageSend"
        @stop="stopStreaming"
      />
    </div>
  </div>
</template>
