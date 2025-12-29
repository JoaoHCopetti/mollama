<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
</script>

<template>
  <div>
    <AppDropdown
      :items="[{ id: 1, text: 'Test' }]"
      id-field="id"
    >
      <template #trigger> Hi </template>

      <template #item="{ item }">{{ item.text }}</template>
    </AppDropdown>
  </div>
</template>
