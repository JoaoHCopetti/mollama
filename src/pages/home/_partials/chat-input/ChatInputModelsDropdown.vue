<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
import AppModelInfo from '@/components/AppModelInfo.vue'
import { useAppStore } from '@/stores/app-store'
import { useShortcutsStore } from '@/stores/shortcuts-store'
import type { Model } from '@/types'
import { computed, onMounted, useTemplateRef } from 'vue'

defineProps<{
  selectedModel?: Model
}>()

const dropdownTrigger = useTemplateRef('dropdownTriggerRef')

const appStore = useAppStore()
const shortcutsStore = useShortcutsStore()
const models = computed(() => appStore.availableModels)

onMounted(() => {
  shortcutsStore.onPress('models-dropdown-focus', () => {
    if (dropdownTrigger.value) {
      dropdownTrigger.value.focus()
    }
  })
})
</script>

<template>
  <!-- @vue-generic {Model} -->
  <AppDropdown
    :items="models"
    class="d-dropdown-top"
    id-field="id"
    item-extend-class="text-xs font-medium"
  >
    <template #trigger>
      <button
        ref="dropdownTriggerRef"
        class="d-btn w-44 ring-white/20 focus:ring-2 sm:w-64"
      >
        <AppModelInfo
          v-if="selectedModel"
          :model="selectedModel"
          class="text-xs tracking-wider uppercase"
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
