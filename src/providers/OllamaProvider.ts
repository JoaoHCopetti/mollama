import type BaseSession from '@/providers/sessions/BaseSession'
import OllamaSession from '@/providers/sessions/OllamaSession'
import type { Model } from '@/types'
import { kebabCase } from 'lodash-es'
import { Ollama } from 'ollama'
import type { BaseProvider } from './BaseProvider'

export default class OllamaProvider implements BaseProvider {
  createSession(): BaseSession {
    return new OllamaSession()
  }

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
