<script setup lang="ts">
defineProps<{
  label: string
  icon: any
}>()
</script>

<template>
  <a
    class="flex cursor-pointer flex-col text-center text-gray-400 transition-colors hover:text-gray-300 active:text-white"
  >
    <div
      class="d-tooltip"
      :data-tip="label"
    >
      <div class="mb-1">
        <Component
          :is="icon"
          weight="duotone"
          class="text-2xl"
        />
      </div>
    </div>
  </a>
</template>
