import type { Model } from '@/database/Model'

type ChatResponse = {
  content: string
  model?: Model
  done?: boolean
  thinking?: string
  totalDuration?: number
  promptTokens?: number
  promptDuration?: number
  responseTokens?: number
  responseDuration?: number
}

interface ChatState {
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

export { ChatResponse, ChatState, FetchResponseOptions, Model }
