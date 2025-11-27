import type { MessageData } from '@/database/Message'
import { retrieveContext } from '@/services/chat-service'
import type { ChatResponse, FetchResponseOptions, Model } from '@/types'
import { omit } from 'lodash-es'

export default abstract class BaseSession {
  public response: ChatResponse

  protected abortController: AbortController
  protected responseChangeCallback?: CallableFunction
  protected model?: Model

  constructor(model?: Model) {
    this.model = model
    this.response = {
      content: '',
      thinking: '',
      state: {
        isLoading: false,
        isThinking: false,
        isStreaming: false,
      },
    }

    this.abortController = new AbortController()
  }

  protected abstract performHandleResponse(
    options: FetchResponseOptions,
    context: MessageData[],
  ): Promise<void>

  public async setResponse(response: Partial<ChatResponse>) {
    const { content, thinking } = response

    if (content) {
      this.response.content += content
    }

    if (thinking) {
      this.response.thinking += thinking
    }

    Object.assign<ChatResponse, Partial<ChatResponse>>(
      this.response,
      omit(response, ['content', 'thinking']),
    )

    if (this.responseChangeCallback) {
      await this.responseChangeCallback(this.response)
    }
  }

  public async handleResponse(options: FetchResponseOptions) {
    const context = await retrieveContext(options.sessionId)

    this.response.state.isLoading = true

    await this.performHandleResponse(options, context)

    await this.finish()
  }

  public onResponseChange(callback: (response: ChatResponse) => void) {
    this.responseChangeCallback = callback
  }

  public abort() {
    this.abortController.abort()
    this.finish()
  }

  protected async finish() {
    this.response.state = {
      isLoading: false,
      isStreaming: false,
      isThinking: false,
    }

    this.response.done = true

    if (this.responseChangeCallback) {
      await this.responseChangeCallback(this.response)
    }
  }
}
