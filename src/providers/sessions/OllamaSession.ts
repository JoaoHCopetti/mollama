import type { AssistantMessageTemp, MessageData } from '@/database/Message'
import type { FetchResponseOptions } from '@/types'
import { Ollama, type Message, type ChatResponse as OllamaChatResponse } from 'ollama/browser'
import BaseSession from './BaseSession'

const ollama = new Ollama()

export default class OllamaSession extends BaseSession {
  public async performHandleResponse(
    options: FetchResponseOptions,
    context: MessageData[],
  ): Promise<void> {
    const formattedContext = context.map((message) => ({
      content: message.content,
      role: message.role,
      thinking: message.thinking,
    }))

    if (!options.stream) {
      await this.fetchStaticResponse(options, formattedContext)
    } else {
      await this.fetchStreamedResponse(options, formattedContext)
    }
  }

  protected async fetchStaticResponse(options: FetchResponseOptions, context: Message[]) {
    const response = await ollama.chat({
      ...options,
      messages: [...context, ...options.messages],
      stream: false,
    })

    this.setMessage(this.getFormattedMessage(response))
  }

  protected async fetchStreamedResponse(options: FetchResponseOptions, context: Message[]) {
    const response = await ollama.chat({
      ...options,
      messages: [...context, ...options.messages],
      stream: true,
    })

    const iterator = response[Symbol.asyncIterator]()

    this.message!.state.isStreaming = true

    for await (const chunk of iterator) {
      if (this.message) {
        this.message.state.isThinking = !!chunk.message.thinking
      }

      if (this.abortController.signal.aborted) {
        response.abort()
        return
      }

      await this.setMessage(this.getFormattedMessage(chunk))
    }
  }

  protected getFormattedMessage = (
    response: OllamaChatResponse,
  ): Omit<AssistantMessageTemp, 'state'> => {
    return {
      content: response.message.content,
      thinking: response.message.thinking,
      role: 'assistant',
      model: this.model!,
      response: {
        done: false,
        promptDuration: response.prompt_eval_duration,
        promptTokens: response.prompt_eval_count,
        responseDuration: response.eval_duration,
        responseTokens: response.eval_count,
        totalDuration: response.total_duration,
      },
    }
  }
}
