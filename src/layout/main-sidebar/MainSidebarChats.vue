<script setup lang="ts">
import type { SessionData } from '@/database/Session'
import MainSidebarChatsTitle from './MainSidebarChatsTitle.vue'
import MainSidebarItem from './MainSidebarItem.vue'

defineProps<{
  sessions: SessionData[]
}>()
</script>

<template>
  <div class="h-full">
    <MainSidebarChatsTitle class="px-5 pb-3" />

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
  </div>
</template>
