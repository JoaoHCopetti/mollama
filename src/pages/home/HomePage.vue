<script setup lang="ts">
import AppTransition from '@/components/AppTransition.vue'
import { useLocalStorage } from '@/composables/use-local-storage'
import { db } from '@/database/db'
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
import ChatEmpty from './_components/ChatEmpty.vue'
import ChatInput, { type InputConfigPayload } from './_components/chat-input/ChatInput.vue'
import ChatMessages from './_components/chat-messages/ChatMessages.vue'
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
    throw new Error('No model selected')
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

  if (!sessionId) {
    throw new Error(
      `No active session is set (active session is: ${JSON.stringify(appStore.activeSession)})`,
    )
  }

  if (!request.value) {
    throw new Error(`No request is set (request is: ${JSON.stringify(request.value)})`)
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
  })
}

const handleRequest = async (sessionId: number) => {
  if (!appStore.selectedModel) {
    throw new Error('No model selected')
  }

  if (!request.value) {
    throw new Error('No session active')
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
  <div class="h-full flex flex-col">
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
        class="h-full w-full flex items-center justify-center"
      />
    </AppTransition>

    <div class="mb-5 w-full relative">
      <div
        class="-translate-x-1/2 left-1/2 h-14 bg-linear-0 absolute -top-14 z-0 w-full from-base-100/80 to-transparent"
      />

      <ChatInput
        class="w-3/4 z-20 relative"
        :current-assist-message="request?.message"
        @update:input-config="onInputConfigChange"
        @send="onMessageSend"
        @stop="stopStreaming"
      />
    </div>
  </div>
</template>
