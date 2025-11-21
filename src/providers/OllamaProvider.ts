import type { Model } from '@/types'
import { kebabCase } from 'lodash-es'
import { Ollama } from 'ollama'
import type { BaseProvider } from './BaseProvider'

export default class OllamaProvider implements BaseProvider {
  async fetchModels(): Promise<Model[]> {
    const ollama = new Ollama()

    return (await ollama.list()).models.map((model) => ({
      id: 'ollama-' + kebabCase(model.name),
      name: model.name,
      isCloud: false,
      parameterSize: model.details.parameter_size,
    }))
  }
}
