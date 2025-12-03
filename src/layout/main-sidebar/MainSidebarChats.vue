<script setup lang="ts">
import type { SessionData } from '@/database/Session'
import MainSidebarItem from './MainSidebarItem.vue'

defineProps<{
  sessions: SessionData[]
}>()
</script>

<template>
  <div class="overflow-auto">
    <TransitionGroup
      tag="ul"
      name="list"
      class="flex flex-col pl-0 overflow-auto ml-3 pr-2 mt-0"
    >
      <MainSidebarItem
        v-for="session in sessions"
        :key="session.id"
        :session="session"
      />
    </TransitionGroup>
  </div>
</template>
