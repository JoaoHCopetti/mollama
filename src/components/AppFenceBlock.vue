<script setup lang="ts">
import { useToastStore } from '@/stores/toast-store'
import { copyToClipboard } from '@/utils'
import { PhClipboard } from '@phosphor-icons/vue'
import { uniqueId } from 'lodash-es'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  language: string
  originalRender: string
}>()

const copyButtonId = `fence-copy-${uniqueId()}`

const toastStore = useToastStore()

const buttonEl = ref<HTMLButtonElement | null>()

onMounted(async () => {
  await nextTick()
  buttonEl.value = document.getElementById(copyButtonId) as HTMLButtonElement

  if (!buttonEl.value) {
    console.error("Couldn't find fence copy button")
    return
  }

  buttonEl.value.addEventListener('click', handleButtonClick)
})

onBeforeUnmount(() => {
  if (!buttonEl.value) {
    return
  }

  buttonEl.value.removeEventListener('click', handleButtonClick)
})

const handleButtonClick = () => {
  const element = document.createElement('div')

  element.innerHTML = props.originalRender

  copyToClipboard(element.innerText.trim())
    .then(() => {
      toastStore.success('Copied to clipboard!')
    })
    .catch((e) => {
      toastStore.error('Error while trying to copy')
      console.error(e)
    })
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdown-fence my-5 rounded-lg bg-base-300">
    <div
      class="flex max-h-5 min-h-5 items-center justify-between rounded-t-lg bg-base-200 px-3 py-5 text-sm font-bold uppercase"
    >
      <span class="text-xs uppercase">{{ language || 'text' }}</span>

      <button
        :id="copyButtonId"
        class="d-btn d-btn-circle d-btn-ghost transition-all d-btn-xs"
      >
        <PhClipboard size="1rem" />
      </button>
    </div>

    <div v-html="originalRender" />
  </div>
</template>
