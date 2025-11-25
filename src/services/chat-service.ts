import { db } from '@/database/db'
import type { MessageInput } from '@/database/Message'

export const createOrUpdateMessage = async (
  message: Omit<MessageInput, 'createdAt' | 'updatedAt'>,
  id?: number,
) => {
  const now = new Date().toISOString()

  if (id) {
    await db.messages.update(id, { ...message, updatedAt: now })
    return id
  }

  return await db.messages.add({
    ...message,
    createdAt: now,
    updatedAt: now,
  })
}

export const retrieveContext = async (sessionId: number) => {
  return await db.messages.where('sessionId').equals(sessionId).toArray()
}
