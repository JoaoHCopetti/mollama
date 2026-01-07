<script setup lang="ts">
import { PhGear } from '@phosphor-icons/vue'
import { markRaw, onMounted, ref, type Component } from 'vue'
import SystemPromptsSettings from './system-prompts/SystemPromptsSettings.vue'

type SettingsMenuItem = {
  id: string
  label: string
  component: Component
}

const MENU_ITEMS: SettingsMenuItem[] = [
  {
    id: 'system-prompts',
    label: 'System Prompts',
    component: markRaw(SystemPromptsSettings),
  },
]

onMounted(() => {
  selectedItem.value = MENU_ITEMS[0]
})

const selectedItem = ref<SettingsMenuItem>()

const selectItem = (item: SettingsMenuItem) => {
  selectedItem.value = item
}
</script>

<template>
  <div class="flex min-h-[70vh]">
    <div class="min-w-fit pr-5">
      <h3 class="flex gap-2 items-center mt-0 mb-4">
        <PhGear weight="fill" />
        Settings
      </h3>

      <ul class="d-menu p-0 m-0 gap-2">
        <li
          v-for="item in MENU_ITEMS"
          :key="item.id"
        >
          <a
            tabindex="0"
            class="font-medium active:bg-base-200 rounded-lg"
            :class="{
              'bg-white/10': selectedItem?.id === item.id,
            }"
            @click.prevent="selectItem(item)"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>

    <div
      v-if="selectedItem"
      class="w-full h-full pr-5 pl-5 -mr-4"
    >
      <h2>{{ selectedItem?.label }}</h2>

      <Component
        :is="selectedItem.component"
        class="h-full py-3"
      />
    </div>
  </div>
</template>
