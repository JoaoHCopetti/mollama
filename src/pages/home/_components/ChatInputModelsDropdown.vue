<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
import AppModelInfo from '@/components/AppModelInfo.vue'
import { useAppStore } from '@/stores/app-store'
import type { Model } from '@/types'
import { computed } from 'vue'
const appStore = useAppStore()

const models = computed(() => appStore.availableModels)
const selectedModel = computed(() => appStore.selectedModel)

const onModelClick = (model: Model) => {
  appStore.selectModel(model.id)
}
</script>

<template>
  <div>
    <!-- @vue-generic {Model} -->
    <AppDropdown
      :items="models"
      id-field="id"
      item-class="text-xs"
      trigger-class="w-56"
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
  </div>
</template>
