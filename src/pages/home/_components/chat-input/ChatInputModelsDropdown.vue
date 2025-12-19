<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
import AppModelInfo from '@/components/AppModelInfo.vue'
import { useAppStore } from '@/stores/app-store'
import type { Model } from '@/types'
import { computed } from 'vue'

const emit = defineEmits(['change'])
const appStore = useAppStore()

defineProps<{
  selectedModel?: Model
}>()

const models = computed(() => appStore.availableModels)

const onModelClick = (model: Model) => {
  emit('change', model)
}
</script>

<template>
  <!-- @vue-generic {Model} -->
  <AppDropdown
    :items="models"
    id-field="id"
    item-class-extend="text-sm"
    trigger-class-extend="w-52"
    @select="onModelClick"
  >
    <template #trigger>
      <AppModelInfo
        v-if="selectedModel"
        :model="selectedModel"
        class="uppercase text-xs tracking-wider"
      />

      <div v-else>Select a model</div>
    </template>

    <template #item="{ item }">
      <AppModelInfo :model="item" />
    </template>
  </AppDropdown>
</template>
