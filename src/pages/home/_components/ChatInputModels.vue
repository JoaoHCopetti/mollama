<script setup lang="ts">
import { LocalStorageEnum, useLocalStorage } from '@/composables/use-local-storage'
import type { ModelData } from '@/database/Model'
import { useAppStore } from '@/stores/app-store'
import { focusChatTextarea } from '@/utils'
import { computed, onMounted } from 'vue'

const appStore = useAppStore()

const models = computed(() => appStore.availableModels)
const appStorage = useLocalStorage()

const onModelClick = (model: ModelData) => {
  appStore.selectModel(model)

  focusChatTextarea()
}

onMounted(() => {
  const model = appStorage.getItem(LocalStorageEnum.SelectedModel)

  if (model) {
    appStore.selectModel(model)
  }
})
</script>

<template>
  <div class="dropdown dropdown-top">
    <div
      tabindex="0"
      role="button"
      class="btn"
    >
      {{ appStore.selectedModel?.name || 'Select a model' }}
    </div>

    <ul
      tabindex="-1"
      class="dropdown-content menu bg-base-100 rounded-box z-1 w-72 p-2 shadow-sm"
    >
      <li
        v-for="model in models"
        :key="model.id"
        class="text-xs"
        @click.prevent="onModelClick(model)"
      >
        <a class="truncate">{{ model.name }}</a>
      </li>
    </ul>
  </div>
</template>
