import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import type { SessionData } from '@/database/Session'
import type { BaseProvider } from '@/providers/BaseProvider'
import OllamaProvider from '@/providers/OllamaProvider'
import type { Model } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export enum ProvidersEnum {
  Ollama,
}

const getProvider = (provider: ProvidersEnum): BaseProvider | undefined => {
  if (provider === ProvidersEnum.Ollama) {
    return new OllamaProvider()
  }

  return undefined
}

export const useAppStore = defineStore('app', () => {
  const storage = useLocalStorage()

  const availableModels = ref<Model[]>([])
  const selectedModel = ref<Model>()
  const activeSession = ref<SessionData>()

  const init = async (provider: ProvidersEnum) => {
    const providerInstance = getProvider(provider)

    if (!providerInstance) {
      throw new Error('No provider specified')
    }

    availableModels.value = await providerInstance.fetchModels()
  }

  const selectModel = (model: Model) => {
    selectedModel.value = model
    storage.setItem(LocalStorageEnum.SelectedModel, model)
  }

  return {
    init,
    availableModels,
    selectedModel,
    activeSession,
    selectModel,
  }
})
