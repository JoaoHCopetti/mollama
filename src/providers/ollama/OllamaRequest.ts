import type { AssistantMessage, MessageData } from '@/database/Message'
import type { FetchResponseOptions } from '@/types'
import {
  Ollama,
  type ChatResponse as OllamaChatResponse,
  type Message as OllamaMessage,
} from 'ollama/browser'

import BaseRequest from '../BaseRequest'

const ollama = new Ollama()

export default class OllamaRequest extends BaseRequest {
  public async performHandleResponse(options: FetchResponseOptions, context: MessageData[]) {
    const formattedContext = this.getContext(context)

    const response = await ollama.chat({
      ...options,
      messages: [...formattedContext, ...options.messages],
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

  private getContext = (context: MessageData[]) => {
    return context.map<OllamaMessage>((message) => {
      const { content, thinking, system } = { ...message.assistant, ...message.user }

      if (!content) {
        throw Error(
          `Error while retrieving context, provided content is:` + JSON.stringify(content),
        )
      }

      return {
        content,
        thinking,
        system,
        role: !!message.assistant ? 'assistant' : 'user',
      }
    })
  }

  protected getFormattedMessage = (
    response: OllamaChatResponse,
  ): Omit<AssistantMessage, 'state'> => {
    return {
      content: response.message.content,
      thinking: response.message.thinking,
      model: this.model!,
      tokens: this.message?.tokens || [],
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
