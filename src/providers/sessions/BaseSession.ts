import type { ChatResponse, ChatState, FetchResponseOptions, Model } from '@/types'
import { omit } from 'lodash-es'

export default abstract class BaseSession {
  public lastState!: ChatState
  public lastResponse!: ChatResponse

  protected abortController!: AbortController
  protected responseChangeCallback?: CallableFunction
  protected currentModel!: Model

  constructor() {
    this.resetState()
  }

  private resetState = () => {
    this.lastResponse = {
      content: '',
      thinking: '',
      model: { id: 'N/A', name: 'N/A' },
    }

    this.lastState = {
      isLoading: false,
      isThinking: false,
      isStreaming: false,
    }

    this.abortController = new AbortController()
  }

  public async setResponse(response: Partial<ChatResponse>) {
    const { content, thinking } = response

    if (content) {
      this.lastResponse.content += content || ''
    }

    if (thinking) {
      this.lastResponse.thinking += thinking || ''
    }

    Object.assign<ChatResponse, Partial<ChatResponse>>(
      this.lastResponse,
      omit(response, ['content', 'thinking']),
    )

    if (this.responseChangeCallback) {
      await this.responseChangeCallback(this.lastResponse)
    }
  }

  public abstract handleResponse(options: FetchResponseOptions): Promise<void>

  public onResponseChange(callback: (response: ChatResponse) => void) {
    this.responseChangeCallback = callback
  }

  public abort() {
    this.abortController.abort()
    this.finish()
  }

  protected finish() {
    this.resetState()
  }
}
