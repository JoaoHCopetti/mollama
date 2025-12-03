<script setup lang="ts">
import type { SessionData } from '@/database/Session'
import { db } from '@/database/db'
import { liveQuery } from 'dexie'
import { ref } from 'vue'
import MainSidebarChats from './MainSidebarChats.vue'
import MainSidebarChatsTitle from './MainSidebarChatsTitle.vue'
import MainSidebarHeader from './MainSidebarHeader.vue'

const sessions = ref<SessionData[]>([])
const sessionsObservable = liveQuery(() => db.sessions.orderBy('createdAt').reverse().toArray())

sessionsObservable.subscribe({
  next: (result) => {
    sessions.value = result
  },
  error: (error) => {
    console.error(error)
  },
})
</script>

<template>
  <div class="bg-base-200 pt-5 flex flex-col">
    <MainSidebarHeader />

    <MainSidebarChatsTitle class="px-5 pb-3" />

    <MainSidebarChats :sessions="sessions" />
  </div>
</template>
