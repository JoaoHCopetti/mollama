<script setup lang="ts">
import type { Component } from 'vue'
defineEmits(['input'])

defineProps<{
  label?: string
  icon: Component
}>()

const checked = defineModel<boolean>({ default: false })

const onToggle = () => {
  checked.value = !checked.value
}
</script>

<template>
  <label
    class="dui-label font-medium cursor-pointer bg-base-100 transition-all select-none hover:bg-base-100/80 py-1 pl-2 pr-3 text-sm rounded-full"
    :class="{
      'bg-primary/90 hover:bg-primary/80': checked,
    }"
    @click="onToggle"
  >
    <Component
      :is="icon"
      :weight="checked ? 'fill' : 'bold'"
    />

    <span v-if="label">{{ label }}</span>
  </label>
</template>
