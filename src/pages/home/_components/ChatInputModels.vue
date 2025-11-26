<script setup lang="ts">
import ModelInfo from '@/components/ModelInfo.vue'
import { useAppStore } from '@/stores/app-store'
import type { Model } from '@/types'
import { focusChatTextarea } from '@/utils'
import { computed } from 'vue'

const appStore = useAppStore()

const models = computed(() => appStore.availableModels)
const selectedModel = computed(() => appStore.selectedModel)

const onModelClick = (model: Model) => {
  appStore.selectModel(model.id)

  focusChatTextarea()
}
</script>

<template>
  <div class="dui-dropdown dui-dropdown-top">
    <div
      tabindex="0"
      role="button"
      class="dui-btn"
    >
      <ModelInfo
        v-if="selectedModel"
        :model="selectedModel"
      />

      <span v-else> Select a model</span>
    </div>

    <ul
      tabindex="-1"
      class="dui-dropdown-content dui-menu bg-base-100 rounded-box z-1 w-72 p-2 shadow-sm"
    >
      <li
        v-for="model in models"
        :key="model.id"
        class="text-xs"
        @click.prevent="onModelClick(model)"
      >
        <a class="truncate">
          <ModelInfo :model="model" />
        </a>
      </li>
    </ul>
  </div>
</template>
