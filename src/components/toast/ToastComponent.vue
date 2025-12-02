<script setup lang="ts">
import { computed } from 'vue'

import { useToastStore } from '@/stores/toast-store'
import ToastAlert from './ToastAlert.vue'

const toastStore = useToastStore()

const toasts = computed(() => toastStore.toasts)
</script>

<template>
  <TransitionGroup
    tag="div"
    class="fixed right-0 top-0 z-50 mt-5 mr-5"
    name="toast"
  >
    <ToastAlert
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.type"
      :message="toast.message"
    />
  </TransitionGroup>
</template>

<style>
@reference "tailwindcss";

.toast-move,
.toast-enter-active,
.toast-leave-active {
  @apply opacity-100 transition-all;
}

.toast-enter-from,
.toast-leave-to {
  @apply opacity-0;
}
</style>
