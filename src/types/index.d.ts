import type { SystemPromptData } from '@/database/SystemPrompt'
import type {
  NavigationGuardReturn,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router'

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

type MiddlewareFunction = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalizedLoaded,
) => Promise<NavigationGuardReturn> | NavigationGuardReturn

export {
  FetchResponseOptions,
  InputConfig,
  InputMessage,
  MessageState,
  MiddlewareFunction,
  Model,
  ResponseDetails,
  ToastTypes,
}
