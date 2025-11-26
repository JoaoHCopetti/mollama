import { retrieveContext } from '@/services/chat-service'
import type { ChatResponse, FetchResponseOptions } from '@/types'
import { Ollama, type Message, type ChatResponse as OllamaChatResponse } from 'ollama/browser'
import BaseSession from './BaseSession'

const ollama = new Ollama()

export default class OllamaSession extends BaseSession {
  public async handleResponse(options: FetchResponseOptions): Promise<void> {
    const context = await retrieveContext(options.sessionId)

    const formattedContext = context.map((message) => ({
      content: message.content,
      role: message.role,
      thinking: message.thinking,
    }))

    this.lastState.isLoading = true

    if (!options.stream) {
      await this.fetchStaticResponse(options, formattedContext)
    } else {
      this.lastState.isStreaming = true
      await this.fetchStreamedResponse(options, formattedContext)
    }

    this.finish()
  }

  protected getFormattedResponse = (response: OllamaChatResponse): ChatResponse => {
    return {
      model: this.currentModel,
      content: response.message.content,
      thinking: response.message.thinking,
      done: response.done,
      promptDuration: response.prompt_eval_duration,
      promptTokens: response.prompt_eval_count,
      responseDuration: response.eval_duration,
      responseTokens: response.eval_count,
      totalDuration: response.total_duration,
    }
  }

  protected async fetchStaticResponse(options: FetchResponseOptions, context: Message[]) {
    const response = await ollama.chat({
      ...options,
      messages: [...context, ...options.messages],
      stream: false,
    })

    this.setResponse(this.getFormattedResponse(response))
  }

  protected async fetchStreamedResponse(options: FetchResponseOptions, context: Message[]) {
    const response = await ollama.chat({
      ...options,
      messages: [...context, ...options.messages],
      stream: true,
    })

    const iterator = response[Symbol.asyncIterator]()

    for await (const chunk of iterator) {
      this.lastState.isThinking = !!chunk.message.thinking

      if (this.abortController.signal.aborted) {
        response.abort()
        return
      }

      await this.setResponse(this.getFormattedResponse(chunk))
    }
  }
}
