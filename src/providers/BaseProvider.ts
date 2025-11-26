import type BaseSession from '@/providers/sessions/BaseSession'
import type { Model } from '@/types'

export interface BaseProvider {
  createSession(): BaseSession
  fetchModels(): Promise<Model[]>
}
