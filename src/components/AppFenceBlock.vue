<script setup lang="ts">
import { useToastStore } from '@/stores/toast-store'
import { copyToClipboard } from '@/utils'
import { PhClipboard } from '@phosphor-icons/vue'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  idx?: number
  language: string
  originalRender: string
}>()

const copyButtonId = `fence-copy-${props.idx}`

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
  <div class="md-fence-wrapper group bg-base-300 rounded-lg my-5">
    <div
      class="md-fence-header flex justify-between items-center bg-base-200 px-3 py-2 min-h-5 max-h-5 text-sm rounded-t-lg uppercase font-bold"
    >
      <span class="text-xs uppercase">{{ language || 'text' }}</span>

      <button
        :id="copyButtonId"
        class="d-btn d-btn-xs d-btn-ghost group-hover:opacity-100 opacity-0 transition-all"
      >
        <PhClipboard size="1rem" />
      </button>
    </div>

    <div v-html="originalRender" />
  </div>
</template>
