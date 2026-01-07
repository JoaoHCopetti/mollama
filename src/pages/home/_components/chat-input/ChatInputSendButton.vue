<script setup lang="ts">
import AppTransition from '@/components/AppTransition.vue'
import type { MessageState } from '@/database/Message'
import { PhCaretCircleUp, PhStop } from '@phosphor-icons/vue'

defineProps<{
  assistMessageState?: MessageState
  message: string
}>()
defineEmits(['send', 'stop'])
</script>

<template>
  <AppTransition
    from-class="scale-95 opacity-0"
    to-class="scale-100 opacity-100"
  >
    <button
      v-if="!assistMessageState?.isLoading"
      class="d-btn d-btn-circle d-btn-primary"
      :disabled="message.trim() === ''"
      @click="$emit('send')"
    >
      <PhCaretCircleUp
        class="text-xl"
        weight="fill"
      />
    </button>

    <button
      v-else
      class="d-btn d-btn-circle d-btn-error"
      :disabled="assistMessageState.isLoading && !assistMessageState.isStreaming"
      @click="$emit('stop')"
    >
      <PhStop
        weight="fill"
        class="text-xl"
      />
    </button>
  </AppTransition>
</template>
