<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
import AppModelInfo from '@/components/AppModelInfo.vue'
import { useAppStore } from '@/stores/app-store'
import type { Model } from '@/types'
import { computed } from 'vue'

defineProps<{
  selectedModel?: Model
}>()
const emit = defineEmits(['change'])

const appStore = useAppStore()

const models = computed(() => appStore.availableModels)

const onModelClick = (model: Model) => {
  emit('change', model)
}
</script>

<template>
  <!-- @vue-generic {Model} -->
  <AppDropdown
    :items="models"
    class="d-dropdown-top"
    id-field="id"
    item-extend-class="text-xs font-medium"
    trigger-extend-class="w-64"
    @select="onModelClick"
  >
    <template #trigger>
      <button class="d-btn focus:ring-2">
        <AppModelInfo
          v-if="selectedModel"
          :model="selectedModel"
          class="uppercase text-xs tracking-wider"
        />

        <div v-else>Select a model</div>
      </button>
    </template>

    <template #item="{ item }">
      <AppModelInfo
        :model="item"
        parameter-extend-class="text-[.65rem]"
      />
    </template>
  </AppDropdown>
</template>
