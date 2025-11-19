<script setup lang="ts">
import { onBeforeMount } from 'vue'
import MainSidebar from './layout/main-sidebar/MainSidebar.vue'
import { useAppStore } from './stores/app-store'

const appStore = useAppStore()

onBeforeMount(() => {
  appStore.init()
})
</script>

<template>
  <main class="h-full flex">
    <MainSidebar class="min-w-3/12 max-w-3/12" />

    <div class="max-w-3/4 min-w-3/4">
      <RouterView />
    </div>
  </main>
</template>
