import { useAppStore } from '@/stores/app-store'
import type { MiddlewareFunction } from '@/types'

export const ensureAppIsReady: MiddlewareFunction = async () => {
  const appStore = useAppStore()

  if (!appStore.isReady) {
    return { name: 'setup' }
  }
}
