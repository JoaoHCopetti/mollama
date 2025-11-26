import type BaseSession from '@/providers/sessions/BaseSession'
import OllamaSession from '@/providers/sessions/OllamaSession'
import type { Model } from '@/types'
import { Ollama } from 'ollama'
import type { BaseProvider } from './BaseProvider'

export default class OllamaProvider implements BaseProvider {
  createSession(model?: Model): BaseSession {
    return new OllamaSession(model)
  }

  async getModels(): Promise<Model[]> {
    const ollama = new Ollama()

    return (await ollama.list()).models.map((model) => ({
      id: model.digest,
      fullName: model.name,
      prettyName: model.name.split(':')[0] || model.name,
      isCloud: 'remote_host' in model,
      parameterSize: model.details.parameter_size,
    }))
  }
}
