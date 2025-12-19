<script setup lang="ts">
import AppTransition from '@/components/AppTransition.vue'
import type { MessageState } from '@/database/Message'
import { PhCaretCircleUp, PhStop } from '@phosphor-icons/vue'

defineEmits(['send', 'stop'])
defineProps<{
  assistMessageState?: MessageState
  message: string
}>()
</script>

<template>
  <AppTransition
    from-class="scale-95 opacity-0"
    to-class="scale-100 opacity-100"
  >
    <button
      v-if="!assistMessageState?.isLoading"
      class="dui-btn dui-btn-primary"
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
      class="dui-btn dui-btn-error"
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
