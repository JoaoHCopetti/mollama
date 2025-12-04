import type { MessageState, Model, ResponseDetails } from '@/types'
import { Entity } from 'dexie'
import type AppDB from './AppDB'

export default class Message extends Entity<AppDB> {
  id!: number
  sessionId!: number
  user?: UserMessage
  assistant?: AssistantMessage
  createdAt!: string
  updatedAt!: string
}

type AssistantMessage = {
  model: Model
  content: string
  thinking?: string
  tokens: { value: string; isThinking: boolean }[]
  state: MessageState
  response: ResponseDetails
  system?: {
    content: string
  }
}

interface MessageState {
  isLoading: boolean
  isThinking: boolean
  isStreaming: boolean
}

type ResponseDetails = {
  done: boolean
  totalDuration?: number
  promptTokens?: number
  promptDuration?: number
  responseTokens?: number
  responseDuration?: number
}

type UserMessage = {
  content: string
}

type MessageData = Omit<Message, 'table' | 'db'>

export type { AssistantMessage, MessageData, MessageState, UserMessage }
