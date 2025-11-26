import type BaseSession from '@/providers/sessions/BaseSession'
import OllamaSession from '@/providers/sessions/OllamaSession'
import type { Model } from '@/types'
import { kebabCase } from 'lodash-es'
import { Ollama } from 'ollama'
import type { BaseProvider } from './BaseProvider'

export default class OllamaProvider implements BaseProvider {
  createSession(model?: Model): BaseSession {
    return new OllamaSession(model)
  }

  async getModels(): Promise<Model[]> {
    const ollama = new Ollama()

    return (await ollama.list()).models.map((model) => ({
      id: 'ollama:' + kebabCase(model.name),
      name: model.name,
      isCloud: 'remote_host' in model,
      parameterSize: model.details.parameter_size,
    }))
  }
}
