<script setup lang="ts">
import AppTransition from '@/components/AppTransition.vue'
import { useAutoScroll } from '@/composables/use-auto-scroll'
import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import type { MessageInput } from '@/database/Message'
import BaseSession from '@/providers/sessions/BaseSession'
import { createMessage, getOrCreateSession } from '@/services/chat-service'
import { useAppStore } from '@/stores/app-store'
import { onBeforeMount, ref, toRaw, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatInput from './_components/ChatInput.vue'
import ChatMessages from './_components/ChatMessages.vue'

const appStore = useAppStore()
const storage = useLocalStorage()
const route = useRoute()
const router = useRouter()
const messagesScroll = useAutoScroll(useTemplateRef('messagesRef'))

const input = defineModel<string>('input', { default: '' })

const session = ref<BaseSession>(appStore.provider.createSession())
const think = ref<boolean>(false)
const currentMessage = ref<MessageInput>()

onBeforeMount(async () => {
  appStore.selectModel(storage.getItem(LocalStorageEnum.SelectedModelId))

  think.value = storage.getItem(LocalStorageEnum.Think) || false
})

messagesScroll.registerWatcher(
  () => session.value.response.content || session.value.response.thinking,
)

const onSendMessage = async () => {
  if (!appStore.selectedModel) {
    throw new Error('No model selected')
  }

  const content = input.value
  input.value = ''

  session.value = appStore.provider.createSession(appStore.selectedModel)

  appStore.activeSession = await getOrCreateSession(+(route.params.id || 0), {
    title: content,
    lastModel: toRaw(appStore.selectedModel),
  })

  await createMessage({
    content,
    role: 'user',
    sessionId: appStore.activeSession.id,
  })

  messagesScroll.stickAndScrollToBottom()

  registerChatListener(appStore.activeSession.id)

  await handleResponse(appStore.activeSession.id)
}

const registerChatListener = (sessionId: number) => {
  session.value.onResponseChange(async (response) => {
    const message: MessageInput = {
      content: response.content,
      thinking: response.thinking,
      role: 'assistant',
      sessionId: appStore.activeSession!.id,
      model: response.model,
      response,
    }

    currentMessage.value = message

    if (response.done) {
      await createMessage(message)
      currentMessage.value = undefined

      router.push(`/sessions/${sessionId}`)
    }
  })
}

const handleResponse = async (sessionId: number) => {
  if (!appStore.selectedModel) {
    throw new Error('No model selected')
  }

  await session.value.handleResponse({
    sessionId,
    model: appStore.selectedModel.fullName,
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
  session.value.abort()
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div
      ref="messagesRef"
      class="h-full overflow-auto"
      @scroll="messagesScroll.handleBottomFixedScroll"
    >
      <AppTransition
        mode="out-in"
        from-class="opacity-0"
        to-class="opacity-100"
      >
        <ChatMessages
          v-if="appStore.activeSession"
          :key="appStore.activeSession.id"
          :session-id="appStore.activeSession.id"
          :current-message="currentMessage"
          class="w-3/4 mt-5"
        />

        <div v-else>
          <!-- TODO: Fancy message here -->
        </div>
      </AppTransition>
    </div>

    <div class="mb-5">
      <ChatInput
        v-model:input="input"
        v-model:think="think"
        class="w-3/4"
        :is-loading="!!currentMessage?.response?.state.isLoading"
        @send="onSendMessage"
        @stop="stopStreaming"
      />
    </div>
  </div>
</template>
