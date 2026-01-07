<script setup lang="ts">
import type { ToastType } from '@/types/toast-store'
import { PhCheckCircle, PhInfo, PhWarningCircle } from '@phosphor-icons/vue'
import { computed, type Component } from 'vue'

type ToastAlertTypes = {
  type: ToastType
  message: string
}

const TOAST_TYPES_MAP: Record<ToastType, { icon: Component; classNames: string }> = {
  success: {
    icon: PhCheckCircle,
    classNames: 'bg-success-content text-success',
  },
  error: {
    icon: PhWarningCircle,
    classNames: 'bg-error-content text-error',
  },
  info: {
    icon: PhInfo,
    classNames: 'bg-primary-content text-primary',
  },
}

const props = defineProps<ToastAlertTypes>()

const toastProps = computed(() => TOAST_TYPES_MAP[props.type])
</script>

<template>
  <div
    class="mb-2 flex w-80 max-w-80 flex-nowrap items-center gap-2 rounded-md bg-base-300 px-2 py-3 shadow-xl"
    :class="toastProps.classNames"
  >
    <Component
      :is="toastProps.icon"
      weight="fill"
      class="text-xl"
    />

    <span class="text-sm">{{ message }}</span>
  </div>
</template>
