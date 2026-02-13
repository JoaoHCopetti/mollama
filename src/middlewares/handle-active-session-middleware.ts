import { db } from '@/database/db'
import { useAppStore } from '@/stores/app-store'
import type { MiddlewareFunction } from '@/types'

export const handleActiveSessionMiddleware: MiddlewareFunction = (to) => {
  const appStore = useAppStore()
  const sessionId = to.params.id

  if (sessionId) {
    db.sessions.get(+sessionId).then((session) => {
      appStore.activeSession = session
    })
  }

  appStore.activeSession = null
}
