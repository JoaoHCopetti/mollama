<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import SettingsModalBody from './SettingsModalBody.vue'
</script>

<template>
  <AppModal panel-class="max-w-2xl">
    <template #body>
      <SettingsModalBody />
    </template>
  </AppModal>
</template>
