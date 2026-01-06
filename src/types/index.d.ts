import type { SystemPromptData } from '@/database/SystemPrompt'

type FetchResponseOptions = {
  sessionId: number
  model: Model
  think?: 'low' | 'medium' | 'high' | boolean
  prompt?: SystemPromptData
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

interface InputConfig {
  message: string
  model?: Model
  think: boolean
  prompt?: SystemPromptData
}

export {
  FetchResponseOptions,
  InputConfig,
  InputMessage,
  MessageState,
  Model,
  ResponseDetails,
  ToastTypes,
}
