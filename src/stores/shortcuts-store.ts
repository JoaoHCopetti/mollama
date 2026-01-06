import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

type ShortcutActions = 'chat-focus' | 'new-chat' | 'toggle-think'
type ShortcutCallbacks = Record<ShortcutActions, (e: KeyboardEvent) => void>
type Shortcuts = Record<
  ShortcutActions,
  { keys: Pick<KeyboardEvent, 'altKey' | 'shiftKey' | 'ctrlKey' | 'code'> }
>

const DEFAULT_SHORTCUTS: Shortcuts = {
  'chat-focus': {
    keys: { altKey: true, shiftKey: false, ctrlKey: true, code: 'KeyF' },
  },
  'new-chat': {
    keys: { altKey: true, shiftKey: false, ctrlKey: true, code: 'KeyN' },
  },
  'toggle-think': {
    keys: { altKey: true, shiftKey: false, ctrlKey: true, code: 'KeyT' },
  },
}

export const useShortcutsStore = defineStore('shortcuts', () => {
  const shortcuts = ref(DEFAULT_SHORTCUTS)
  const callbacks: Ref<Partial<ShortcutCallbacks>> = ref({})
  const isShortcutsRegistered = ref<boolean>(false)

  const init = () => {
    if (isShortcutsRegistered.value) {
      console.warn(`Trying to init shortcuts, but it's already registered`)
      return
    }

    document.addEventListener('keydown', handleKeydownEvent)
    isShortcutsRegistered.value = true
  }

  const destroy = () => {
    callbacks.value = {}
    document.removeEventListener('keydown', handleKeydownEvent)
    isShortcutsRegistered.value = false
  }

  const handleKeydownEvent = (e: KeyboardEvent) => {
    if (!(e.altKey || e.ctrlKey)) {
      return
    }

    for (const action in shortcuts.value) {
      const shortcut = shortcuts.value[action as ShortcutActions]

      if (shortcut && isEventKeys(e, shortcut.keys)) {
        e.preventDefault()
        callbacks.value[action as ShortcutActions]?.(e)
      }
    }
  }

  const isEventKeys = (event: KeyboardEvent, keys: Shortcuts[ShortcutActions]['keys']) => {
    return (
      keys.altKey === event.altKey &&
      keys.ctrlKey === event.ctrlKey &&
      keys.code === event.code &&
      event.shiftKey === keys.shiftKey
    )
  }

  const trigger = (shortcut: ShortcutActions) => {
    const callback = callbacks.value[shortcut]

    if (callback) {
      callback(new KeyboardEvent('manual'))
    }
  }

  const onPress = (shortcut: ShortcutActions, callback: (e: KeyboardEvent) => void) => {
    if (callbacks.value[shortcut]) {
      console.warn(`Shortcut '${shortcut}' is already registered`)
      return
    }

    callbacks.value[shortcut] = callback
  }

  return {
    init,
    destroy,
    onPress,
    trigger,
  }
})

export type { ShortcutActions }
