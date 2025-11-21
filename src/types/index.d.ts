import type { ModelData } from '@/database/Model'

type ChatResponse = {
  content: string
  model: ModelData
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

export { ChatResponse, ChatState, FetchResponseOptions }
