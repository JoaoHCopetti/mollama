<script setup lang="ts">
import { computed } from 'vue'

import { useToastStore } from '@/stores/toast-store'
import ToastContainerAlert from './ToastContainerAlert.vue'

const toastStore = useToastStore()

const toasts = computed(() => toastStore.toasts)
</script>

<template>
  <TransitionGroup
    tag="div"
    class="fixed top-0 right-0 z-50 mt-5 mr-5"
    name="list"
  >
    <ToastContainerAlert
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.type"
      :message="toast.message"
    />
  </TransitionGroup>
</template>
