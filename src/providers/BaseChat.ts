import type { ChatResponse, ChatState, FetchResponseOptions } from '@/types'

export default abstract class BaseChat {
  public state: ChatState
  public response: ChatResponse

  protected abortController: AbortController
  protected finishCallback?: CallableFunction
  protected responseChangeCallback?: CallableFunction

  constructor() {
    this.response = {
      content: '',
      thinking: '',
      done: false,
    }
    this.state = {
      isLoading: false,
      isThinking: false,
      isStreaming: false,
    }
    this.abortController = new AbortController()
  }

  public abstract setResponse(response: any): void
  public abstract fetchResponse(options: FetchResponseOptions): Promise<void>

  public onResponseChange(callback: (response: ChatResponse) => void) {
    this.responseChangeCallback = callback
  }

  public resetState() {
    this.response = { content: '', thinking: '', done: false }
    this.state = { isLoading: false, isThinking: false, isStreaming: false }
    this.abortController = new AbortController()
  }

  public onFinish(callback: (response: ChatResponse) => void) {
    this.finishCallback = callback
  }

  public abort() {
    this.abortController.abort()
    this.finish()
  }

  protected finish() {
    this.state.isLoading = false
    this.state.isStreaming = false
    this.state.isThinking = false

    if (this.finishCallback) {
      this.finishCallback(this.response)
    }
  }
}
