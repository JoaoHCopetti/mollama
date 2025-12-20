import type { MessageState, Model, ResponseDetails } from '@/types'
import { Entity } from 'dexie'
import type AppDB from './AppDB'

export default class Message extends Entity<AppDB> {
  id!: number
  sessionId!: number
  user?: UserMessage
  assistant?: AssistantMessage
  system?: SystemMessage
  role!: 'user' | 'assistant' | 'system'
  createdAt!: string
  updatedAt!: string
}

interface UserMessage {
  content: string
}

interface AssistantMessage {
  model: Model
  content: string
  thinking?: string
  tokens: { value: string; isThinking: boolean }[]
  state: MessageState
  response: ResponseDetails
}

interface SystemMessage {
  title: string
  content: string
}

interface MessageState {
  isLoading: boolean
  isThinking: boolean
  isStreaming: boolean
}

interface ResponseDetails {
  done: boolean
  totalDuration?: number
  promptTokens?: number
  promptDuration?: number
  responseTokens?: number
  responseDuration?: number
}

type MessageData = Omit<Message, 'table' | 'db'>

export type { AssistantMessage, MessageData, MessageState, SystemMessage, UserMessage }
