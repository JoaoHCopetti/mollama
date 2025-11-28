import type { Model } from '@/database/Model'

type ResponseDetails = {
  done: boolean
  totalDuration?: number
  promptTokens?: number
  promptDuration?: number
  responseTokens?: number
  responseDuration?: number
}

interface MessageState {
  isLoading: boolean
  isThinking: boolean
  isStreaming: boolean
}

type FetchResponseOptions = {
  sessionId: number
  model: string
  messages: Pick<MessageData, 'role' | 'content'>[]
  stream?: boolean
  think?: 'low' | 'medium' | 'high' | boolean
}

type Model = {
  id: string
  name: string
  fullName: string
  prettyName: string
  user?: string
  parameterSize?: string
  isCloud?: boolean
}

export { FetchResponseOptions, MessageState, Model, ResponseDetails }
