export type ShortcutActions =
  | 'chat-focus'
  | 'new-chat'
  | 'toggle-think'
  | 'models-dropdown-focus'
  | 'prompts-dropdown-focus'

export type ShortcutCallbacks = Record<ShortcutActions, (e: KeyboardEvent) => void>

export type Shortcuts = Record<
  ShortcutActions,
  { keys: Pick<KeyboardEvent, 'altKey' | 'shiftKey' | 'ctrlKey' | 'code'> }
>
