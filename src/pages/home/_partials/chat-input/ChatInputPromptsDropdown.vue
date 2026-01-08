<script setup lang="ts">
import AppDropdown from '@/components/AppDropdown.vue'
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { PhBookBookmark } from '@phosphor-icons/vue'
import { liveQuery } from 'dexie'
import { onMounted, ref, useTemplateRef } from 'vue'

defineProps<{
  prompt?: SystemPromptData
}>()
defineEmits(['change'])

const subscription = useDexieSubscription<SystemPromptData>()
const shortcutsStore = useShortcutsStore()

const systemPrompts = ref<SystemPromptData[]>([])
const dropdownTrigger = useTemplateRef('dropdownTriggerRef')

onMounted(() => {
  subscription.setupLiveQuery(liveQuery(() => db.systemPrompts.toArray()))

  subscription.onResultChange((result) => {
    systemPrompts.value = result
  })

  shortcutsStore.onPress('prompts-dropdown-focus', () => {
    if (dropdownTrigger.value) {
      dropdownTrigger.value.focus()
    }
  })
})
</script>

<template>
  <AppDropdown
    id-field="id"
    class="d-dropdown-top left-0 sm:d-dropdown-top"
    :items="systemPrompts"
    container-extend-class="max-w-52"
    :active-item="prompt"
    item-extend-class="text-sm py-1"
    @select="$emit('change', $event)"
  >
    <template #trigger>
      <button
        ref="dropdownTriggerRef"
        class="input-chat-pill ring-white/20 focus:ring-2"
        :class="[
          {
            'bg-primary/90 hover:bg-primary/80': !!prompt,
            'input-chat-pill-disabled': !systemPrompts.length,
          },
        ]"
      >
        <div
          class="sm:w-30"
          :class="{ 'd-tooltip d-tooltip-top': !systemPrompts.length }"
          v-bind="{
            ...(!systemPrompts.length ? { 'data-tip': 'No prompts registered' } : {}),
          }"
        >
          <div class="flex items-center gap-2 truncate">
            <PhBookBookmark
              class="min-w-fit"
              :weight="prompt ? 'fill' : 'regular'"
            />

            <span class="hidden sm:block">{{ prompt?.title || 'Select a prompt' }}</span>
          </div>
        </div>
      </button>
    </template>

    <template #item="{ item }">
      <div class="fade-truncate flex items-center gap-2 truncate">
        <PhBookBookmark
          weight="fill"
          class="min-w-fit"
        />
        {{ item.title }}
      </div>
    </template>
  </AppDropdown>
</template>
