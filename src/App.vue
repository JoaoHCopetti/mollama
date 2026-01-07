<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import ToastContainer from './components/toast/ToastContainer.vue'
import MainSidebar from './layout/main-sidebar/MainSidebar.vue'
import { useAppStore } from './stores/app-store'
import { useShortcutsStore } from './stores/shortcuts-store'
import { ProvidersEnum } from './utils/enums'

const isBooted = ref(false)

const appStore = useAppStore()
const shortcutsStore = useShortcutsStore()

onBeforeMount(async () => {
  await appStore.init(ProvidersEnum.Ollama)
  shortcutsStore.init()

  isBooted.value = true
})

onBeforeUnmount(() => {
  shortcutsStore.destroy()
})
</script>

<template>
  <main class="relative flex h-full">
    <MainSidebar class="-ml-[100%] w-full sm:ml-0 sm:w-[300px] md:w-[400px]" />

    <div class="relative w-full">
      <ToastContainer />

      <RouterView v-if="isBooted" />
    </div>
  </main>
</template>
