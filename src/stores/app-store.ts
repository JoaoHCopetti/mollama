import { useLocalStorage } from '@/composables/use-local-storage'
import type { SessionData } from '@/database/Session'
import ValidationError from '@/errors/ValidationError'
import type { BaseProvider } from '@/providers/BaseProvider'
import OllamaProvider from '@/providers/ollama/OllamaProvider'
import type { Model } from '@/types'
import { LocalStorageEnum, ProvidersEnum } from '@/utils/enums'
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useAppStore = defineStore('app', () => {
  const storage = useLocalStorage()

  const provider = shallowRef<BaseProvider>()
  const availableModels = ref<Model[]>([])
  const selectedModel = ref<Model>()
  const activeSession = ref<SessionData | null>()
  const onModelsFetchedCallback = ref<() => void>()

  const state = ref<'not-initialized' | 'not-ready' | 'ready'>('not-initialized')

  const init = async (providerEnum: ProvidersEnum, host: string) => {
    const providerInstance = getProvider(providerEnum, { host })

    if (!providerInstance) {
      provider.value = undefined
      throw new ValidationError(`Provider isn't defined (${providerEnum})`)
    }

    try {
      await providerInstance.checkConnection(host)

      provider.value = providerInstance
      state.value = 'ready'
    } catch (error) {
      provider.value = undefined
      state.value = 'not-ready'

      throw error
    }
  }

  const fetchModels = async () => {
    if (provider.value) {
      availableModels.value = await provider.value.getModels()

      if (onModelsFetchedCallback.value) {
        onModelsFetchedCallback.value()
      }
    }
  }

  const getProvider = (provider: ProvidersEnum, providerConfig: any): BaseProvider | undefined => {
    if (provider === ProvidersEnum.Ollama) {
      return new OllamaProvider(providerConfig)
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

  const onModelsFetched = (callback: () => void) => {
    onModelsFetchedCallback.value = callback
  }

  return {
    init,
    getProvider,
    state,
    availableModels,
    selectedModel,
    activeSession,
    selectModel,
    provider,
    fetchModels,
    onModelsFetched,
  }
})
