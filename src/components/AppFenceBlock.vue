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

const toast = useToastStore()

const copyToClipboardId = `fence-copy-${props.idx}`
const buttonEl = ref<HTMLButtonElement | null>()

onMounted(async () => {
  await nextTick()
  buttonEl.value = document.getElementById(copyToClipboardId) as HTMLButtonElement

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
      toast.success('Copied to clipboard!')
    })
    .catch((e) => {
      toast.error('Error while trying to copy')
      console.error(e)
    })
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="md-fence-wrapper">
    <div class="md-fence-header flex justify-between items-center">
      <span class="language-name">{{ language }}</span>

      <button
        :id="copyToClipboardId"
        class="dui-btn dui-btn-xs dui-btn-ghost"
      >
        <PhClipboard size="1rem" />
      </button>
    </div>

    <div v-html="originalRender" />
  </div>
</template>
