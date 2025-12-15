<script setup lang="ts">
import AppModal from '@/components/AppModal.vue'
import { PhGear } from '@phosphor-icons/vue'
import SettingsModalBody from './SettingsModalBody.vue'
</script>

<template>
  <AppModal panel-class="max-w-2xl">
    <template #title>
      <div class="flex gap-2 items-center">
        <PhGear weight="fill" />
        Settings
      </div>
    </template>

    <template #body>
      <SettingsModalBody />
    </template>
  </AppModal>
</template>
