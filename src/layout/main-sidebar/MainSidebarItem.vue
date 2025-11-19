<script setup lang="ts">
import type { SessionData } from '@/database/Session'
import { timeDiffForHumans } from '@/utils'
import { computed } from 'vue'

const props = defineProps<{
  session: SessionData
}>()
const date = computed(() => timeDiffForHumans(new Date(props.session.createdAt)))
</script>

<template>
  <RouterLink
    is="li"
    v-slot="{ isActive }"
    :to="`/sessions/${session.id}`"
    class="flex flex-col no-underline rounded gap-2 p-3 m-1 bg-base-100 hover:bg-base-300 relative transition-all cursor-pointer active:scale-[1.01]"
    active-class="border-l-4 border-primary"
  >
    <div
      class="truncate text-white"
      :class="{
        'font-semibold': isActive,
      }"
    >
      {{ session.title }}
    </div>

    <div class="text-xs text-gray-400">
      <span>{{ date }}</span>
    </div>
  </RouterLink>
</template>
