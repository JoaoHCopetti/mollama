import type { ChatResponse, ChatState, FetchResponseOptions } from '@/types'

export default abstract class BaseSession {
  public state: ChatState
  public response!: ChatResponse

  protected abortController: AbortController
  protected responseChangeCallback?: CallableFunction

  constructor() {
    this.initResponse()
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
    this.initResponse()
    this.state = { isLoading: false, isThinking: false, isStreaming: false }
    this.abortController = new AbortController()
  }

  public abort() {
    this.abortController.abort()
    this.finish()
  }

  protected finish() {
    this.state = {
      isLoading: false,
      isStreaming: false,
      isThinking: false,
    }
  }

  private initResponse() {
    this.response = {
      content: '',
      model: { id: 'n-a', name: 'N/A' },
    }
  }
}
