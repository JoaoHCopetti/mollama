<script setup lang="ts">
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { deleteSystemPrompt } from '@/services/system-prompt-service'
import { PhTrash } from '@phosphor-icons/vue'
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

const onDeleteClick = (systemPrompt: SystemPromptData) => {
  deleteSystemPrompt(systemPrompt.id)
}
</script>

<template>
  <div class="overflow-auto overflow-x-hidden">
    <ul
      v-if="systemPrompts.length"
      v-auto-animate
      class="dui-list overflow-hidden ml-0 pl-0"
    >
      <li
        v-for="systemPrompt in systemPrompts"
        :key="systemPrompt.id"
        class="px-4 py-2 first:rounded-t-lg last:rounded-b-lg group bg-base-200 hover:bg-white/5 transition-colors rounded-0 flex items-center justify-between w-full cursor-pointer"
      >
        <div>{{ systemPrompt.title }}</div>

        <button
          class="dui-btn group-hover:opacity-100 opacity-0 transition-all dui-btn-sm dui-btn-ghost hover:bg-white/10 border-0"
          @click="onDeleteClick(systemPrompt)"
        >
          <PhTrash
            weight="fill"
            size="1.4em"
          />
        </button>
      </li>
    </ul>

    <div
      v-else
      class="min-h-full text-center text-white/50 mt-32"
    >
      Nothing here
    </div>
  </div>
</template>
