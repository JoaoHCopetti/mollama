<script setup lang="ts">
import AppTransition from '@/components/AppTransition.vue'
import { useLocalStorage } from '@/composables/use-local-storage'
import BaseRequest from '@/providers/BaseRequest'
import { createAssistMessage, createUserMessage, getOrCreateSession } from '@/services/chat-service'
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
const think = ref<boolean>(false)

const currentAssistMessage = computed(() => request.value?.message)

provide(inputConfigKey, inputConfig.value)

onBeforeMount(async () => {
  const selectedModel = storage.getItem(LocalStorageEnum.SelectedModelId)

  appStore.selectModel(selectedModel)

  think.value = storage.getItem(LocalStorageEnum.Think) || false
})

const onInputConfigChange = ({ type, inputConfig }: InputConfigPayload) => {
  if (type === 'model') {
    appStore.selectModel(inputConfig.model?.id)
  }
}

const onSendMessage = async () => {
  if (!appStore.selectedModel) {
    throw new Error('No model selected')
  }

  const content = inputConfig.value.message

  request.value = appStore.provider.createRequest(appStore.selectedModel)

  inputConfig.value.message = ''

  appStore.activeSession = await getOrCreateSession(+(route.params.id || 0), {
    title: content,
    lastModel: appStore.selectedModel,
  })

  await createUserMessage({
    sessionId: appStore.activeSession.id,
    user: { content },
  })

  registerRequestListener(appStore.activeSession.id)

  await handleRequest(appStore.activeSession.id)
}

const registerRequestListener = (sessionId: number) => {
  if (!request.value) {
    return
  }

  request.value.onMessageChange(async (message) => {
    if (message.response?.done) {
      await createAssistMessage(sessionId, message)

      if (!route.params.id) {
        router.push(`/sessions/${sessionId}`)
      }
    }
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
    model: appStore.selectedModel.fullName,
    think: think.value,
    messages: [
      {
        content: inputConfig.value.message,
        role: 'user',
      },
    ],
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
      active-class="animate-all duration-100"
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

    <div class="mb-5">
      <ChatInput
        class="w-3/4"
        :current-assist-message="request?.message"
        @update:input-config="onInputConfigChange"
        @send="onSendMessage"
        @stop="stopStreaming"
      />
    </div>
  </div>
</template>
