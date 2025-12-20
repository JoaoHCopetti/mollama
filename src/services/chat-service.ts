import { db } from '@/database/db'
import type { AssistantMessage, SystemMessage, UserMessage } from '@/database/Message'
import type { SessionInput } from '@/database/Session'
import { toRaw } from 'vue'

export const createAssistMessage = async (sessionId: number, message: AssistantMessage) => {
  const now = new Date().toISOString()

  return await db.messages.add({
    sessionId,
    assistant: toRaw(message),
    role: 'assistant',
    createdAt: now,
    updatedAt: now,
  })
}

export const createUserMessage = async (sessionId: number, message: UserMessage) => {
  const now = new Date().toISOString()

  return await db.messages.add({
    sessionId,
    user: toRaw(message),
    role: 'user',
    createdAt: now,
    updatedAt: now,
  })
}

export const createSystemMessage = async (sessionId: number, message: SystemMessage) => {
  const now = new Date().toISOString()

  return await db.messages.add({
    sessionId,
    system: toRaw(message),
    role: 'system',
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
