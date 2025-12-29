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
  public async performHandleResponse(options: FetchResponseOptions, messages: MessageData[]) {
    const response = await ollama.chat({
      model: options.model.fullName,
      think: options.think,
      messages: [
        ...(options.prompt ? [{ role: 'system', content: options.prompt.content || '' }] : []),
        ...this.getFormattedMessages(messages),
      ],
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

      await this.setMessage(this.getFormattedChunk(chunk))
    }
  }

  private getFormattedMessages = (messages: MessageData[]) => {
    return messages.map<OllamaMessage>((message) => {
      const entityMessage = message[message.role]

      if (!entityMessage) {
        throw new Error(`There's no message content on "${message.role}"`)
      }

      return message.user || message.system
        ? {
            role: message.role,
            content: entityMessage.content,
          }
        : {
            role: message.role,
            content: entityMessage.content,
            thinking: message.assistant?.thinking,
          }
    })
  }

  protected getFormattedChunk = (response: OllamaChatResponse): Omit<AssistantMessage, 'state'> => {
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
