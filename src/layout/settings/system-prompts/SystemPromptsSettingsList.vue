<script setup lang="ts">
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { liveQuery } from 'dexie'
import { onMounted, ref } from 'vue'

const subscription = useDexieSubscription<SystemPromptData>()
const systemPrompts = ref<SystemPromptData[]>([])

onMounted(() => {
  subscription.setupLiveQuery(liveQuery(() => db.systemPrompts.toArray()))
  subscription.onResultChange((result) => {
    systemPrompts.value = result
  })
})
</script>

<template>
  <ul class="dui-list rounded-lg ml-0 pl-0 max-h-52 overflow-auto">
    <li
      v-for="systemPrompt in systemPrompts"
      :key="systemPrompt.id"
      class="p-3 odd:bg-base-200 even:bg-base-300 hover:bg-white/5 transition-colors rounded-0 flex items-center justify-between w-full cursor-pointer"
    >
      <div>{{ systemPrompt.title }}</div>
    </li>
  </ul>
</template>
