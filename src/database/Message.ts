import type { MessageState, Model, ResponseDetails } from '@/types'
import { Entity } from 'dexie'
import type AppDB from './AppDB'

export default class Message extends Entity<AppDB> {
  id!: number
  sessionId!: number
  model?: Model
  role!: 'user' | 'system' | 'assistant'
  content!: string
  thinking?: string
  state?: MessageState
  response?: ResponseDetails
  createdAt!: string
  updatedAt!: string
}

export type MessageData = Omit<Message, 'table' | 'db'>

export type UserMessage = Omit<MessageData, 'state' | 'response' | 'thinking' | 'model'>
export type AssistantMessage = MessageData &
  Required<Pick<MessageData, 'model' | 'response' | 'state'>>

export type AssistantMessageTemp = Omit<
  AssistantMessage,
  'id' | 'createdAt' | 'updatedAt' | 'sessionId'
>
