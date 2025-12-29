<script setup lang="ts">
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { liveQuery } from 'dexie'
import { onMounted, ref } from 'vue'
import SystemPromptsSettingsListItem from './SystemPromptsSettingsListItem.vue'

defineEmits<{
  edit: [args: { systemPrompt: SystemPromptData }]
}>()

const subscription = useDexieSubscription<SystemPromptData>()
const systemPrompts = ref<SystemPromptData[]>([])
const activeSystemPrompt = ref<SystemPromptData>()

onMounted(() => {
  subscription.setupLiveQuery(liveQuery(() => db.systemPrompts.toArray()))
  subscription.onResultChange((result) => {
    systemPrompts.value = result
  })
})

const onSystemPromptClick = (systemPrompt: SystemPromptData) => {
  if (activeSystemPrompt.value?.id === systemPrompt.id) {
    activeSystemPrompt.value = undefined
    return
  }

  activeSystemPrompt.value = systemPrompt
}
</script>

<template>
  <div class="overflow-auto overflow-x-hidden">
    <ul
      v-if="systemPrompts.length"
      class="d-list overflow-hidden ml-0 pr-6 pl-0"
    >
      <SystemPromptsSettingsListItem
        v-for="systemPrompt in systemPrompts"
        :key="systemPrompt.id"
        :system-prompt="systemPrompt"
        :is-active="activeSystemPrompt?.id === systemPrompt.id"
        @click="onSystemPromptClick(systemPrompt)"
        @edit="$emit('edit', $event)"
      />
    </ul>

    <div
      v-else
      class="min-h-full text-center text-white/50 mt-32"
    >
      Nothing here
    </div>
  </div>
</template>
