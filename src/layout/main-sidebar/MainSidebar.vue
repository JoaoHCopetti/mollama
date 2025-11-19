<script setup lang="ts">
import type { SessionData } from '@/database/Session'
import { db } from '@/database/db'
import { liveQuery } from 'dexie'
import { ref } from 'vue'
import MainSidebarHeader from './MainSidebarHeader.vue'
import MainSidebarItem from './MainSidebarItem.vue'

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
    <div class="mx-3">
      <MainSidebarHeader />
    </div>

    <ul class="flex flex-col pl-0 overflow-auto ml-3 pr-2">
      <MainSidebarItem
        v-for="session in sessions"
        :key="session.id"
        :session="session"
      />
    </ul>
  </div>
</template>
