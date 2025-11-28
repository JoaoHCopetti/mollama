<script setup lang="ts">
import { useAutoScroll } from '@/composables/use-auto-scroll'
import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import BaseSession from '@/providers/sessions/BaseSession'
import { createMessage, getOrCreateSession } from '@/services/chat-service'
import { useAppStore } from '@/stores/app-store'
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatInput from './_components/ChatInput.vue'
import ChatMessages from './_components/ChatMessages.vue'

const appStore = useAppStore()
const storage = useLocalStorage()
const route = useRoute()
const router = useRouter()
const messagesRef = ref<HTMLDivElement>()
const autoScrollMessages = useAutoScroll()

const input = defineModel<string>('input', { default: '' })

const session = ref<BaseSession>()
const think = ref<boolean>(false)

const currentAssistMessage = computed(() => session.value?.message)

onBeforeMount(async () => {
  const selectedModel = storage.getItem(LocalStorageEnum.SelectedModelId)

  appStore.selectModel(selectedModel)

  think.value = storage.getItem(LocalStorageEnum.Think) || false
})

autoScrollMessages.registerWatcher([
  () => currentAssistMessage.value?.thinking,
  () => currentAssistMessage.value?.content,
])

const onSendMessage = async () => {
  if (!appStore.selectedModel) {
    throw new Error('No model selected')
  }

  const content = input.value

  input.value = ''
  session.value = appStore.provider.createSession(appStore.selectedModel)

  appStore.activeSession = await getOrCreateSession(+(route.params.id || 0), {
    title: content,
    lastModel: appStore.selectedModel,
  })

  await createMessage({
    content,
    role: 'user',
    sessionId: appStore.activeSession.id,
  })

  registerChatListener(appStore.activeSession.id)

  await handleResponse(appStore.activeSession.id)
}

const registerChatListener = (sessionId: number) => {
  if (!session.value) {
    return
  }

  session.value.onMessageChange(async (message) => {
    if (message.response?.done) {
      await createMessage({ ...message, sessionId })

      router.push(`/sessions/${sessionId}`)
    }
  })
}

const handleResponse = async (sessionId: number) => {
  if (!appStore.selectedModel) {
    throw new Error('No model selected')
  }

  if (!session.value) {
    throw new Error('No session active')
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
  if (session.value) {
    session.value.abort()
  }
}

const onChatMessagesMount = () => {
  if (messagesRef.value) {
    autoScrollMessages.init(messagesRef.value)

    autoScrollMessages.stickAndScrollToBottom()
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div
      ref="messagesRef"
      class="h-full overflow-auto"
    >
      <ChatMessages
        v-if="appStore.activeSession"
        :key="appStore.activeSession.id"
        :session-id="appStore.activeSession.id"
        :current-assist-message="currentAssistMessage"
        class="w-3/4 mt-5 mx-auto"
        @messages-mounted="onChatMessagesMount"
      />

      <div v-else>
        <!-- TODO: Fancy message here -->
      </div>
    </div>

    <div class="mb-5">
      <ChatInput
        v-model:input="input"
        v-model:think="think"
        class="w-3/4"
        :is-loading="!!currentAssistMessage?.state.isLoading"
        @send="onSendMessage"
        @stop="stopStreaming"
      />
    </div>
  </div>
</template>
