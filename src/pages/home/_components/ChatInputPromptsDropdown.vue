<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { PhBookBookmark } from '@phosphor-icons/vue'
import { liveQuery } from 'dexie'
import { onMounted, ref } from 'vue'

defineEmits(['change'])
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
  <AppDropdown
    id-field="id"
    :items="systemPrompts"
    trigger-class="chat-pill"
    @select="$emit('change', $event)"
  >
    <template #trigger>
      <PhBookBookmark />
      Prompt
    </template>

    <template #item="{ item }">
      {{ item.title }}
    </template>
  </AppDropdown>
</template>
