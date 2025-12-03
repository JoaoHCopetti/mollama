<script setup lang="ts">
import type { SessionData } from '@/database/Session'

defineProps<{
  session: SessionData
}>()
</script>

<template>
  <RouterLink
    is="li"
    v-slot="{ isActive }"
    :to="`/sessions/${session.id}`"
    class="group bg-white/2 no-underline flex flex-col p-4 m-1 rounded-xl transition-all ease-out hover:bg-white/5 active:scale-[0.98]"
    active-class="bg-white/10 hover:bg-white/15"
  >
    <div
      class="text-sm font-medium tracking-wide truncate"
      :class="{
        'text-white drop-shadow-md': isActive,
        'text-white/80 group-hover:text-white': !isActive,
      }"
    >
      {{ session.title }}
    </div>
  </RouterLink>
</template>
