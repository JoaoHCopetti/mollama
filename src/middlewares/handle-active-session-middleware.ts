import { db } from '@/database/db'
import { useAppStore } from '@/stores/app-store'
import type { MiddlewareFunction } from '@/types'

export const handleActiveSessionMiddleware: MiddlewareFunction = async (to) => {
  const appStore = useAppStore()
  const sessionId = to.params.id

  if (sessionId) {
    const session = await db.sessions.get(+sessionId)

    appStore.activeSession = session
    return
  }

  appStore.activeSession = null
}
