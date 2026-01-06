import { type ShallowRef } from 'vue'

export const useDynamicTextarea = (
  textareaRef: Readonly<ShallowRef<HTMLTextAreaElement | null>>,
  maxHeight = 150,
) => {
  const adjustTextareaHeight = () => {
    if (!textareaRef.value) {
      return
    }

    const textarea = textareaRef.value

    textarea.style.height = 'auto'
    textarea.style.height =
      (textarea.scrollHeight < maxHeight ? textarea.scrollHeight : maxHeight) + 'px'
  }

  return { adjustTextareaHeight }
}
