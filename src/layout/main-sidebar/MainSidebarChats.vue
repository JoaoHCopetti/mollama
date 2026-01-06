<script setup lang="ts">
import { db } from '@/database/db'
import type { SessionData } from '@/database/Session'
import { useRouter } from 'vue-router'
import MainSidebarChatsTitle from './MainSidebarChatsTitle.vue'
import MainSidebarItem, { type DeleteEventArgs } from './MainSidebarItem.vue'

const router = useRouter()

defineProps<{
  sessions: SessionData[]
}>()

const deleteSession = async ({ session }: DeleteEventArgs) => {
  await db.sessions.delete(session.id)
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="h-full overflow-auto">
    <MainSidebarChatsTitle class="px-5 pb-3" />

    <div
      v-if="sessions.length"
      class="flex flex-col pl-0 ml-3 pr-2 mt-0"
    >
      <MainSidebarItem
        v-for="session in sessions"
        :key="session.id"
        :session="session"
        @delete="deleteSession"
      />
    </div>

    <div
      v-else
      class="mt-20 text-center text-white/30"
    >
      Nothing here
    </div>
  </div>
</template>
