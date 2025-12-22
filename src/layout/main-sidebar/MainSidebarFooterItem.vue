<script setup lang="ts">
defineProps<{
  label: string
  icon: any
}>()
</script>

<template>
  <a
    class="text-center flex flex-col text-gray-400 hover:text-gray-300 active:text-white transition-colors cursor-pointer"
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
