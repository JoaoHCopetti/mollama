<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import MainSidebar from './layout/main-sidebar/MainSidebar.vue'
import { ProvidersEnum, useAppStore } from './stores/app-store'

const appStore = useAppStore()

const isBooted = ref(false)

onBeforeMount(async () => {
  await appStore.init(ProvidersEnum.Ollama)
  isBooted.value = true
})
</script>

<template>
  <main class="h-full flex">
    <MainSidebar class="min-w-3/12 max-w-3/12" />

    <div class="max-w-3/4 min-w-3/4">
      <RouterView v-if="isBooted" />
    </div>
  </main>
</template>
