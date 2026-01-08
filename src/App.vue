<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref } from 'vue'
import AppTransition from './components/AppTransition.vue'
import ToastContainer from './components/toast/ToastContainer.vue'
import { useLocalStorage } from './composables/use-local-storage'
import MainSidebar from './layout/main-sidebar/MainSidebar.vue'
import ProviderConnection, {
  type ProviderConnectionEvents,
} from './pages/_partials/ProviderConnection.vue'
import { useAppStore } from './stores/app-store'
import { useShortcutsStore } from './stores/shortcuts-store'
import { useToastStore } from './stores/toast-store'
import { LocalStorageEnum } from './utils/enums'

const isBooted = ref<boolean>(false)

const appStore = useAppStore()
const shortcutsStore = useShortcutsStore()
const storage = useLocalStorage()
const toastStore = useToastStore()

onBeforeMount(async () => {
  const lastConnection = storage.getItem(LocalStorageEnum.LastConnection)

  shortcutsStore.init()

  if (lastConnection) {
    try {
      await appStore.init(lastConnection.provider, lastConnection.host)
    } catch (error) {
      console.error(error)
      toastStore.error("Couldn't restore your last provider connection", { timeout: 5000 })
    }
  }

  isBooted.value = true
})

const initApp = async ({ provider, host }: ProviderConnectionEvents['confirmed']) => {
  await appStore.init(provider, host)
  storage.setItem(LocalStorageEnum.LastConnection, { provider, host })
}

onUnmounted(() => {
  shortcutsStore.destroy()
})
</script>

<template>
  <main class="relative flex h-full">
    <ToastContainer />

    <MainSidebar class="-ml-[100%] w-full sm:ml-0 sm:w-[300px] md:w-[400px]" />

    <AppTransition
      from-class="opacity-0"
      to-class="opacity-100"
      active-class="transition-all duration-1000 ease-out"
    >
      <div
        v-if="isBooted"
        class="relative w-full"
      >
        <RouterView v-if="appStore.provider" />

        <ProviderConnection
          v-else
          @confirmed="initApp"
        />
      </div>
    </AppTransition>
  </main>
</template>
