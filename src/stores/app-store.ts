import { useLocalStorage } from '@/composables/use-local-storage'
import type { SessionData } from '@/database/Session'
import type { BaseProvider } from '@/providers/BaseProvider'
import OllamaProvider from '@/providers/ollama/OllamaProvider'
import type { Model } from '@/types'
import { LocalStorageEnum, ProvidersEnum } from '@/utils/enums'
import { defineStore } from 'pinia'
import { ref, shallowRef, type ShallowRef } from 'vue'

export const useAppStore = defineStore('app', () => {
  const storage = useLocalStorage()

  const availableModels = ref<Model[]>([])
  const selectedModel = ref<Model>()
  const activeSession = ref<SessionData | null>()
  const provider = shallowRef<BaseProvider>() as ShallowRef<BaseProvider>

  const init = async (providerEnum: ProvidersEnum) => {
    const providerInstance = getProvider(providerEnum)

    if (!providerInstance) {
      throw new Error('No provider specified')
    }

    provider.value = providerInstance
    availableModels.value = await providerInstance.getModels()
  }

  const getProvider = (provider: ProvidersEnum): BaseProvider | undefined => {
    if (provider === ProvidersEnum.Ollama) {
      return new OllamaProvider()
    }

    return undefined
  }

  const selectModel = (modelId?: string) => {
    selectedModel.value = availableModels.value.find(({ id }) => id === modelId)

    if (!modelId) {
      storage.removeItem(LocalStorageEnum.SelectedModelId)
      return
    }

    storage.setItem(LocalStorageEnum.SelectedModelId, modelId)
  }

  return {
    init,
    availableModels,
    selectedModel,
    activeSession,
    selectModel,
    provider,
  }
})
