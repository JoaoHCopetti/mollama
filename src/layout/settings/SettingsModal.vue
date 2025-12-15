<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <AppModal
    :is-open="isOpen"
    panel-class="max-w-2xl"
  >
    <template #title>Settings</template>

    <template #body> Hi</template>
  </AppModal>
</template>
