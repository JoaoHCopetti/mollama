import type BaseRequest from '@/providers/BaseRequest'
import OllamaRequest from '@/providers/ollama/OllamaRequest'
import type { Model } from '@/types'
import { Ollama, type ModelResponse, type Config as OllamaConfig } from 'ollama/browser'
import type { BaseProvider } from '../BaseProvider'

export default class OllamaProvider implements BaseProvider {
  ollama!: Ollama

  constructor(config?: Partial<OllamaConfig>) {
    this.ollama = new Ollama(config)
  }

  async checkConnection(host: string): Promise<boolean> {
    try {
      await fetch(host)

      return true
    } catch (error) {
      throw error
    }
  }

  createRequest(model: Model): BaseRequest {
    return new OllamaRequest(this, model)
  }

  private getLabels = (model: ModelResponse) => {
    const name = model.name.split(':')[0]!
    const nameParts = name.split('/')
    const [user, prettyName] = nameParts.length === 2 ? [nameParts[0], nameParts[1]] : [name, name]

    return {
      name,
      fullName: model.name,
      prettyName: prettyName || name,
      user,
    }
  }

  async getModels(): Promise<Model[]> {
    return (await this.ollama.list()).models.map((model) => {
      const { fullName, name, prettyName, user } = this.getLabels(model)

      return {
        id: model.digest,
        name,
        fullName,
        prettyName,
        user,
        isCloud: 'remote_host' in model,
        parameterSize: model.details.parameter_size,
      }
    })
  }
}
