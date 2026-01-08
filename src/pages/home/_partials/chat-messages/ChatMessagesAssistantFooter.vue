<script setup lang="ts">
import type { AssistantMessage, SystemMessage } from '@/database/Message'
import { useToastStore } from '@/stores/toast-store'
import { copyToClipboard } from '@/utils'
import { PhClipboard } from '@phosphor-icons/vue'

const props = defineProps<{
  message: AssistantMessage
  system?: SystemMessage
}>()

const toastStore = useToastStore()

const onCopyClick = () => {
  copyToClipboard(props.message.content)
    .then(() => {
      toastStore.success('Copied to clipboard!')
    })
    .catch((e) => {
      toastStore.error('Error while trying to copy')
      console.error(e)
    })
}
</script>

<template>
  <div class="h-10 opacity-0 transition-opacity">
    <button
      class="d-btn d-btn-circle border-0 bg-transparent hover:bg-white/10"
      @click="onCopyClick"
    >
      <PhClipboard weight="bold" />
    </button>
  </div>
</template>
