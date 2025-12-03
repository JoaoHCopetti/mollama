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

type ToastType = 'success' | 'info' | 'error'

type Toast = {
  id: string
  type: ToastType
  message: string
}

interface ToastOptions {
  timeout?: number
}

export {
  FetchResponseOptions,
  MessageState,
  Model,
  ResponseDetails,
  Toast,
  ToastOptions,
  ToastType,
}
