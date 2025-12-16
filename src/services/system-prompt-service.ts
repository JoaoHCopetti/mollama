import { db } from '@/database/db'
import type { SystemPromptInput } from '@/database/SystemPrompt'

export const createSystemPrompt = async (
  data: Omit<SystemPromptInput, 'createdAt' | 'updatedAt'>,
) => {
  const now = new Date().toISOString()

  return await db.systemPrompts.add({
    ...data,
    createdAt: now,
    updatedAt: now,
  })
}

export const deleteSystemPrompt = async (id: number) => {
  await db.systemPrompts.delete(id)
}
