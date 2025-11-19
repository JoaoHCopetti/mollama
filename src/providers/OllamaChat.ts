import { retrieveContext } from '@/services/chat-service'
import type { ChatResponse, FetchResponseOptions } from '@/types'
import { Ollama, type Message, type ChatResponse as OllamaChatResponse } from 'ollama/browser'
import BaseChat from './BaseChat'

const ollama = new Ollama()

export default class OllamaChat extends BaseChat {
  public async setResponse(response: Partial<OllamaChatResponse>) {
    const { message } = response

    if (message?.content) {
      this.response.content += message.content
    }

    if (message?.thinking) {
      this.response.thinking += message.thinking
    }

    Object.assign<ChatResponse, Partial<ChatResponse>>(this.response, {
      done: response.done,
      totalDuration: response.total_duration,
      promptDuration: response.prompt_eval_duration,
      promptTokens: response.prompt_eval_count,
      responseDuration: response.eval_duration,
      responseTokens: response.eval_count,
    })

    if (this.responseChangeCallback) {
      await this.responseChangeCallback(this.response)
    }
  }

  public async fetchResponse(options: FetchResponseOptions): Promise<void> {
    const context = await retrieveContext(options.sessionId)

    const formattedContext = context.map((message) => ({
      content: message.content,
      role: message.role,
      thinking: message.thinking,
    }))

    this.state.isLoading = true

    if (!options.stream) {
      await this.fetchStaticResponse(options, formattedContext)
    } else {
      await this.fetchStreamedResponse(options, formattedContext)
    }

    this.finish()
  }

  protected async fetchStaticResponse(options: FetchResponseOptions, context: Message[]) {
    const response = await ollama.chat({
      ...options,
      messages: [...context, ...options.messages],
      stream: false,
    })

    await this.setResponse(response)
  }

  protected async fetchStreamedResponse(options: FetchResponseOptions, context: Message[]) {
    const response = await ollama.chat({
      ...options,
      messages: [...context, ...options.messages],
      stream: true,
    })

    const iterator = response[Symbol.asyncIterator]()

    this.state.isStreaming = true

    for await (const chunk of iterator) {
      if (this.abortController.signal.aborted) {
        response.abort()
        return
      }

      this.state.isThinking = !!chunk.message.thinking

      await this.setResponse(chunk)
    }
  }
}
