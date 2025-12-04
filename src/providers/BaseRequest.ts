import type { AssistantMessage, MessageData } from '@/database/Message'
import { retrieveContext } from '@/services/chat-service'
import type { FetchResponseOptions, Model } from '@/types'
import { omit } from 'lodash-es'

export default abstract class BaseRequest {
  public message?: AssistantMessage

  protected abortController: AbortController
  protected messageChangeCallback?: CallableFunction
  protected model!: Model

  constructor(model: Model) {
    this.model = model

    this.abortController = new AbortController()
  }

  protected abstract performHandleResponse(
    options: FetchResponseOptions,
    context: MessageData[],
  ): Promise<void>

  public async setMessage(message: Partial<AssistantMessage>) {
    const { content, thinking } = message

    if (!this.message) {
      this.message = this.getInitMessage()
    }

    if (content) {
      this.message.content += content
      this.message.tokens.push({ value: content, isThinking: false })
    }

    if (thinking) {
      this.message.thinking += thinking
      this.message.tokens.push({ value: thinking, isThinking: true })
    }

    Object.assign<AssistantMessage, Partial<AssistantMessage>>(
      this.message,
      omit(message, ['content', 'thinking']),
    )

    if (this.messageChangeCallback) {
      await this.messageChangeCallback(this.message)
    }
  }

  public async handleRequest(options: FetchResponseOptions) {
    const context = await retrieveContext(options.sessionId)

    this.message = this.getInitMessage()

    this.message.state.isLoading = true

    await this.performHandleResponse(options, context)

    await this.finish()
  }

  public onMessageChange(callback: (message: AssistantMessage) => void) {
    this.messageChangeCallback = callback
  }

  public abort() {
    this.abortController.abort()
  }

  protected async finish() {
    if (!this.message) {
      console.warn('No message was set when attempting to finish')
      return
    }

    this.message.state = {
      isLoading: false,
      isStreaming: false,
      isThinking: false,
    }

    this.message.response.done = true

    if (this.messageChangeCallback) {
      await this.messageChangeCallback(this.message)
    }

    this.message = undefined
  }

  private getInitMessage(): AssistantMessage {
    return {
      model: this.model,
      content: '',
      tokens: [],
      state: {
        isLoading: false,
        isStreaming: false,
        isThinking: false,
      },
      response: { done: false },
    }
  }
}
