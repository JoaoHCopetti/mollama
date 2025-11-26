<script setup lang="ts">
import { useAutoScroll } from '@/composables/use-auto-scroll'
import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import BaseSession from '@/providers/sessions/BaseSession'
import { createOrUpdateMessage, getOrCreateSession } from '@/services/chat-service'
import { useAppStore } from '@/stores/app-store'
import { clone } from 'lodash-es'
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

const session = ref<BaseSession>(appStore.provider.createSession())
const think = ref<boolean>(false)
const lastMessageId = ref<number>()

const activeSession = computed(() => appStore.activeSession)

onBeforeMount(async () => {
  appStore.selectModel(storage.getItem(LocalStorageEnum.SelectedModel) || undefined)

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
    lastModel: clone(appStore.selectedModel),
  })

  await createOrUpdateMessage({
    content,
    role: 'user',
    sessionId: appStore.activeSession.id,
  })

  messagesScroll.stickAndScrollToBottom()

  registerChatListener(appStore.activeSession.id)

  await handleResponse(appStore.activeSession.id)
}

const registerChatListener = (sessionId: number) => {
  lastMessageId.value = undefined

  session.value.onResponseChange(async (response) => {
    lastMessageId.value = await createOrUpdateMessage(
      {
        sessionId,
        content: response.content,
        thinking: response.thinking,
        role: 'assistant',
        model: response.model,
      },
      lastMessageId.value,
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

  await session.value.handleResponse({
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
      <ChatMessages
        v-if="activeSession"
        class="w-3/4 mt-5"
        :session-id="activeSession.id"
        :chat-state="session.state"
        :last-message-id="lastMessageId"
      />
    </div>

    <div class="mb-5">
      <ChatInput
        v-model:input="input"
        v-model:think="think"
        class="w-3/4"
        :chat-state="session.state"
        @send="onSendMessage"
        @stop="stopStreaming"
      />
    </div>
  </div>
</template>
