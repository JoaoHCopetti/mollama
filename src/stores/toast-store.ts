import { uniqueId } from 'lodash-es'
import { defineStore } from 'pinia'

export type ToastType = 'success' | 'info' | 'error'

export type Toast = {
  id: string
  type: ToastType
  message: string
}

export interface ToastOptions {
  timeout?: number
}

const DEFAULT_TIMEOUT = 4000
const MAX_TOASTS_PER_TIME = 3

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
  }),
  actions: {
    show(type: ToastType, message: string, options: ToastOptions = {}) {
      this.toasts.unshift({
        id: uniqueId(),
        type,
        message,
      })

      const timeoutId = setTimeout(() => {
        this.toasts.pop()
      }, options.timeout || DEFAULT_TIMEOUT)

      if (this.toasts.length > MAX_TOASTS_PER_TIME) {
        this.toasts.pop()
        clearTimeout(timeoutId)
      }
    },
    success(message: string, options: ToastOptions = {}) {
      this.show('success', message, options)
    },
    info(message: string, options: ToastOptions = {}) {
      this.show('info', message, options)
    },
    error(message: string, options: ToastOptions = {}) {
      this.show('error', message, options)
    },
  },
})
