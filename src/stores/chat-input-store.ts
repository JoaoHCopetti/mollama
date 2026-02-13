import { useLocalStorage } from '@/composables/use-local-storage'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import type { InputConfig, Model } from '@/types'
import { LocalStorageEnum } from '@/utils/enums'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './app-store'

export const useChatInputStore = defineStore('chat-input', () => {
  const appStore = useAppStore()
  const storage = useLocalStorage()

  const config = ref<InputConfig>({
    message: '',
    think: false,
    model: undefined,
    prompt: undefined,
  })

  const restoreChatConfig = async () => {
    restoreModel()
    restoreThink()
    await restorePrompt()
  }

  const restoreModel = () => {
    const selectedModelId = storage.getItem(LocalStorageEnum.SelectedModelId)

    appStore.selectModel(selectedModelId)
    config.value.model = appStore.selectedModel
  }

  const restoreThink = () => {
    config.value.think = storage.getItem(LocalStorageEnum.Think) || false
  }

  const restorePrompt = async () => {
    const lastPromptId = storage.getItem(LocalStorageEnum.SelectedPromptId)

    if (lastPromptId) {
      const lastPrompt = await db.systemPrompts.get(lastPromptId)

      config.value.prompt = lastPrompt
    }
  }

  const setMessage = (message: string) => {
    config.value.message = message
  }

  const setThink = (think: boolean) => {
    config.value.think = think

    storage.setItem(LocalStorageEnum.Think, think)
  }

  const setModel = (model: Model) => {
    config.value.model = model

    appStore.selectModel(model.id)
  }

  const setPrompt = (prompt: SystemPromptData) => {
    const newPrompt = prompt.id !== config.value.prompt?.id ? prompt : undefined

    config.value.prompt = newPrompt

    if (newPrompt) {
      storage.setItem(LocalStorageEnum.SelectedPromptId, newPrompt.id)
    } else {
      storage.removeItem(LocalStorageEnum.SelectedPromptId)
    }
  }

  return {
    config,
    setThink,
    setModel,
    setPrompt,
    setMessage,
    restoreChatConfig,
  }
})
