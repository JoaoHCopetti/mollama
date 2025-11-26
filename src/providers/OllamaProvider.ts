import type BaseSession from '@/providers/sessions/BaseSession'
import OllamaSession from '@/providers/sessions/OllamaSession'
import type { Model } from '@/types'
import { Ollama, type ModelResponse } from 'ollama'
import type { BaseProvider } from './BaseProvider'

export default class OllamaProvider implements BaseProvider {
  createSession(model?: Model): BaseSession {
    return new OllamaSession(model)
  }

  private getPrettyName = (model: ModelResponse) => {
    const name = model.name.split(':')[0]

    if (!name) {
      return model.name
    }

    return name.split('/')[1] || name
  }

  private getModelUserName = (model: ModelResponse) => {
    return model.name.split('/')[0]
  }

  async getModels(): Promise<Model[]> {
    const ollama = new Ollama()

    return (await ollama.list()).models.map((model) => ({
      id: model.digest,
      fullName: model.name,
      prettyName: this.getPrettyName(model),
      user: this.getModelUserName(model),
      isCloud: 'remote_host' in model,
      parameterSize: model.details.parameter_size,
    }))
  }
}
