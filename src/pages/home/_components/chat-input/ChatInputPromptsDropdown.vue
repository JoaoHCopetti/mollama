<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { PhArticle, PhBookBookmark } from '@phosphor-icons/vue'
import { liveQuery } from 'dexie'
import { onMounted, ref } from 'vue'

defineEmits(['change'])
defineProps<{
  prompt?: SystemPromptData
}>()

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
    :active-item="prompt"
    :trigger-class="[
      'chat-pill',
      {
        'bg-primary/90 hover:bg-primary/80': !!prompt,
      },
    ]"
    item-class-extend="text-sm p-1"
    @select="$emit('change', $event)"
  >
    <template #trigger>
      <PhBookBookmark />
      Prompt
    </template>

    <template #item="{ item }">
      <div class="flex items-center gap-2">
        <PhArticle
          weight="fill"
          size="1.1rem"
        />
        {{ item.title }}
      </div>
    </template>
  </AppDropdown>
</template>
