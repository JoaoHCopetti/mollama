<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import SettingsModalBody from './SettingsModalBody.vue'
</script>

<template>
  <AppModal panel-class="max-w-4xl">
    <template #body>
      <SettingsModalBody />
    </template>
  </AppModal>
</template>
