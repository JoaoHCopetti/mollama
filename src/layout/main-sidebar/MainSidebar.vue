<script setup lang="ts">
import type { SessionData } from '@/database/Session'
import { db } from '@/database/db'
import { liveQuery } from 'dexie'
import { ref } from 'vue'
import SettingsModal from '../settings/SettingsModal.vue'
import MainSidebarChats from './MainSidebarChats.vue'
import MainSidebarFooter from './MainSidebarFooter.vue'
import MainSidebarHeader from './MainSidebarHeader.vue'

const sessions = ref<SessionData[]>([])
const sessionsObservable = liveQuery(() => db.sessions.orderBy('createdAt').reverse().toArray())
const isSettingsOpen = ref<boolean>(false)

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

    <MainSidebarChats :sessions="sessions" />

    <MainSidebarFooter @settings-click="isSettingsOpen = true" />

    <SettingsModal />
  </div>
</template>
