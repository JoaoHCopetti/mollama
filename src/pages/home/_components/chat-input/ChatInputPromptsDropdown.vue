<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { PhBookBookmark } from '@phosphor-icons/vue'
import { liveQuery } from 'dexie'
import { onMounted, ref } from 'vue'

defineProps<{
  prompt?: SystemPromptData
}>()
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
    container-class-extend="max-w-52"
    :active-item="prompt"
    :trigger-class="[
      'input-chat-pill',
      {
        'bg-primary/90 hover:bg-primary/80': !!prompt,
        'input-chat-pill-disabled': !systemPrompts.length,
      },
    ]"
    item-class-extend="text-xs py-1"
    @select="$emit('change', $event)"
  >
    <template #trigger>
      <div
        class="w-30"
        :class="{ 'd-tooltip d-tooltip-top': !systemPrompts.length }"
        v-bind="{
          ...(!systemPrompts.length ? { 'data-tip': 'No prompts registered' } : {}),
        }"
      >
        <div class="truncate flex items-center gap-2">
          <PhBookBookmark
            class="min-w-fit"
            :weight="prompt ? 'fill' : 'regular'"
          />
          {{ prompt?.title || 'Select a prompt' }}
        </div>
      </div>
    </template>

    <template #item="{ item }">
      <div class="flex items-center gap-2 truncate fade-truncate">
        <PhBookBookmark
          weight="fill"
          class="min-w-fit"
        />
        {{ item.title }}
      </div>
    </template>
  </AppDropdown>
</template>
