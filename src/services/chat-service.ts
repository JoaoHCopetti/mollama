import { db } from '@/database/db'
import type { MessageInput } from '@/database/Message'
import type { SessionInput } from '@/database/Session'

export const createOrUpdateMessage = async (
  messageInput: Omit<MessageInput, 'createdAt' | 'updatedAt'>,
  id?: number,
) => {
  const now = new Date().toISOString()

  if (id) {
    await db.messages.update(id, { ...messageInput, updatedAt: now })
    return id
  }

  return await db.messages.add({
    ...messageInput,
    createdAt: now,
    updatedAt: now,
  })
}

export const retrieveContext = async (sessionId: number) => {
  return await db.messages.where('sessionId').equals(sessionId).toArray()
}

export const getOrCreateSession = async (
  id?: number,
  sessionInput?: Omit<SessionInput, 'createdAt' | 'updatedAt'>,
) => {
  const session = await db.sessions.get(id || 0)

  if (session) {
    return session
  }

  if (!sessionInput) {
    throw new Error("The specified session id doesn't exist and no new session data was provided")
  }

  const timestamp = new Date().toISOString()

  const newId = await db.sessions.add({
    title: sessionInput.title.substring(0, 100),
    lastModel: sessionInput.lastModel,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return (await db.sessions.get(newId))!
}
