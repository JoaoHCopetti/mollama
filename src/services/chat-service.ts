import { db } from '@/database/db'
import type { MessageData } from '@/database/Message'
import type { SessionInput } from '@/database/Session'
import { toRaw } from 'vue'

export const createMessage = async (
  messageInput: Omit<MessageData, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const now = new Date().toISOString()

  return await db.messages.add({
    ...messageInput,
    state: toRaw(messageInput.state),
    model: toRaw(messageInput.model),
    response: toRaw(messageInput.response),
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

  const now = new Date().toISOString()

  const newId = await db.sessions.add({
    title: sessionInput.title.substring(0, 100),
    lastModel: toRaw(sessionInput.lastModel),
    createdAt: now,
    updatedAt: now,
  })

  return (await db.sessions.get(newId))!
}
