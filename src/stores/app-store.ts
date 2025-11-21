import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import type { ModelData } from '@/database/Model'
import type { SessionData } from '@/database/Session'
import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import { Ollama } from 'ollama'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const storage = useLocalStorage()
  const ollama = new Ollama()
  const markdown = new MarkdownIt({
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(str, { language: lang }).value
      }

      return str
    },
  }).use(sfcPlugin)

  const availableModels = ref<ModelData[]>([])
  const selectedModel = ref<ModelData>()
  const activeSession = ref<SessionData>()

  const init = async () => {
    ollama.list().then((response) => {
      const models = response.models.map<ModelData>((model) => ({
        id: +new Date(),
        name: model.name,
        parameterSize: model.details.parameter_size,
      }))

      availableModels.value = models
    })
  }

  const selectModel = (model: ModelData) => {
    selectedModel.value = model
    storage.setItem(LocalStorageEnum.SelectedModel, model)
  }

  return {
    init,
    markdown,
    availableModels,
    selectedModel,
    activeSession,
    selectModel,
  }
})
