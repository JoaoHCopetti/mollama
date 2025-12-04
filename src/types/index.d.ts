type FetchResponseOptions = {
  sessionId: number
  model: string
  messages: {
    content: string
    thinking?: string
    system?: string
    role: 'assistant' | 'user'
  }[]

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
  InputMessage,
  MessageState,
  Model,
  ResponseDetails,
  Toast,
  ToastOptions,
  ToastType,
}
