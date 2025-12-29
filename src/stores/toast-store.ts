import type { Toast, ToastOptions, ToastType } from '@/types'
import { uniqueId } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_TIMEOUT = 4000
const MAX_TOASTS_PER_TIME = 3

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  const show = (type: ToastType, message: string, options: ToastOptions = {}) => {
    toasts.value.unshift({
      id: uniqueId(),
      type,
      message,
    })

    const timeoutId = setTimeout(() => {
      toasts.value.pop()
    }, options.timeout || DEFAULT_TIMEOUT)

    if (toasts.value.length > MAX_TOASTS_PER_TIME) {
      toasts.value.pop()
      clearTimeout(timeoutId)
    }
  }

  const success = (message: string, options: ToastOptions = {}) => {
    show('success', message, options)
  }
  const info = (message: string, options: ToastOptions = {}) => {
    show('info', message, options)
  }

  const error = (message: string, options: ToastOptions = {}) => {
    show('error', message, options)
  }

  return {
    toasts,
    show,
    success,
    info,
    error,
  }
})
