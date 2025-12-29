import type { Observable, Subscription } from 'dexie'
import { onBeforeUnmount, ref } from 'vue'

export const useDexieSubscription = <T>() => {
  const subscription = ref<Subscription>()
  const result = ref<T[]>()
  const resultChangeCallback = ref()

  onBeforeUnmount(() => {
    if (subscription.value) {
      subscription.value.unsubscribe()
    }
  })

  const setupLiveQuery = (observable: Observable) => {
    subscription.value = observable.subscribe({
      next: async (data) => {
        result.value = data

        if (resultChangeCallback.value) {
          await resultChangeCallback.value(data)
        }
      },
      error: (error) => console.error(error),
    })
  }

  const onResultChange = (callback: (data: T[]) => void | Promise<void>) => {
    resultChangeCallback.value = callback
  }

  return {
    setupLiveQuery,
    onResultChange,
  }
}
