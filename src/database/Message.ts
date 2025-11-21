import { Entity } from 'dexie'
import type AppDB from './AppDB'
import type { ModelData } from './Model'

export default class Message extends Entity<AppDB> {
  id!: number
  sessionId!: number
  model?: ModelData
  role!: 'user' | 'system' | 'assistant'
  content!: string
  thinking?: string
  createdAt!: string
  updatedAt!: string
}

export type MessageData = Omit<Message, 'table' | 'db'>
export type MessageInput = Omit<MessageData, 'id'>
