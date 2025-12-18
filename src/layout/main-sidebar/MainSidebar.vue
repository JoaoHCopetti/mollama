<script setup lang="ts">
import { useDexieSubscription } from '@/composables/use-dexie-subscription'
import type { SessionData } from '@/database/Session'
import { db } from '@/database/db'
import { liveQuery } from 'dexie'
import { onMounted, ref } from 'vue'
import SettingsModal from '../settings/SettingsModal.vue'
import MainSidebarChats from './MainSidebarChats.vue'
import MainSidebarFooter from './MainSidebarFooter.vue'
import MainSidebarHeader from './MainSidebarHeader.vue'

const sessions = ref<SessionData[]>([])
const isSettingsOpen = ref<boolean>(false)
const subscription = useDexieSubscription<SessionData>()

onMounted(() => {
  subscription.setupLiveQuery(liveQuery(() => db.sessions.orderBy('createdAt').reverse().toArray()))

  subscription.onResultChange((result) => {
    sessions.value = result
  })
})
</script>

<template>
  <div class="bg-base-200 pt-5 flex flex-col">
    <MainSidebarHeader />

    <MainSidebarChats :sessions="sessions" />

    <MainSidebarFooter @settings-click="isSettingsOpen = true" />

    <SettingsModal v-model:is-open="isSettingsOpen" />
  </div>
</template>
