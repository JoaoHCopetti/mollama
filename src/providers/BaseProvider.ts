import type { Model } from '@/types'

export interface BaseProvider {
  fetchModels(): Promise<Model[]>
}
