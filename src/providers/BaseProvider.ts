import type BaseSession from '@/providers/sessions/BaseSession'
import type { Model } from '@/types'

export interface BaseProvider {
  createSession(model?: Model): BaseSession
  getModels(): Promise<Model[]>
}
