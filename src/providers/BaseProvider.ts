import type BaseRequest from '@/providers/BaseRequest'
import type { Model } from '@/types'

export interface BaseProvider {
  createRequest(model: Model): BaseRequest
  getModels(): Promise<Model[]>
}
