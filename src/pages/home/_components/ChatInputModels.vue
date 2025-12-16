<script setup lang="ts">
import AppModelInfo from '@/components/AppModelInfo.vue'
import { useAppStore } from '@/stores/app-store'
import type { Model } from '@/types'
import { PhCloud, PhDesktop } from '@phosphor-icons/vue'
import { computed, useTemplateRef } from 'vue'

const appStore = useAppStore()
const dropdownItemRef = useTemplateRef<HTMLLIElement>('dropdownItemRef')

const models = computed(() => appStore.availableModels)
const selectedModel = computed(() => appStore.selectedModel)

const onModelClick = (model: Model) => {
  appStore.selectModel(model.id)

  if (dropdownItemRef.value) {
    Object.values(dropdownItemRef.value).forEach((item) => item.blur())
  }
}
</script>

<template>
  <div class="dui-dropdown dui-dropdown-top">
    <div
      tabindex="0"
      role="button"
      class="dui-btn"
    >
      <AppModelInfo
        v-if="selectedModel"
        :key="selectedModel.id"
        :model="selectedModel"
      />

      <span v-else> Select a model</span>
    </div>

    <ul class="dui-dropdown-content dui-menu bg-base-100 rounded-box z-1 w-72 p-2 shadow-sm">
      <li
        v-for="model in models"
        :key="model.id"
        ref="dropdownItemRef"
        class="text-xs"
        tabindex="0"
        @click="onModelClick(model)"
        @keypress.enter="onModelClick(model)"
      >
        <a class="active:bg-gray-800">
          <Component
            :is="model.isCloud ? PhCloud : PhDesktop"
            weight="fill"
          />

          <div class="truncate">{{ model.name }}</div>

          <span
            v-if="model.parameterSize"
            class="dui-badge dui-badge-sm opacity-50 border-0"
          >
            {{ model.parameterSize }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>
