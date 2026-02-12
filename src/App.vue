<script setup lang="ts">
import { PhList } from '@phosphor-icons/vue'
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import ToastContainer from './components/toast/ToastContainer.vue'
import { useLocalStorage } from './composables/use-local-storage'
import MainSidebar from './layout/main-sidebar/MainSidebar.vue'
import ProviderConnection, {
  type ProviderConnectionEvents,
} from './pages/_partials/ProviderConnection.vue'
import router from './router'
import { useAppStore } from './stores/app-store'
import { useShortcutsStore } from './stores/shortcuts-store'
import { useToastStore } from './stores/toast-store'
import { LocalStorageEnum } from './utils/enums'

const isReady = ref<boolean>(false)
const isSidebarOpen = ref<boolean>(false)

const appStore = useAppStore()
const shortcutsStore = useShortcutsStore()
const storage = useLocalStorage()
const toastStore = useToastStore()

const storage = useLocalStorage()
const route = useRoute()

const showProviderConnection = computed(() => !appStore.provider && route.name === 'home')

const onConnectionConfirmed = async ({ provider, host }: ProviderConnectionEvents['confirmed']) => {
  await appStore.init(provider, host)

  storage.setItem(LocalStorageEnum.LastConnection, { provider, host })
  isReady.value = true
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

router.beforeEach(() => {
  if (isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
})

onBeforeMount(async () => {
  const lastConnection = storage.getItem(LocalStorageEnum.LastConnection)

  shortcutsStore.init()

  if (lastConnection) {
    try {
      await appStore.init(lastConnection.provider, lastConnection.host)
      isReady.value = true
    } catch (error) {
      console.error(error)
      toastStore.error("Couldn't restore your last provider connection", { timeout: 5000 })
    }
  }
})

onBeforeUnmount(() => {
  shortcutsStore.destroy()
})
</script>

<template>
  <main class="relative flex h-full">
    <ToastContainer />

    <button
      class="d-btn absolute top-0 right-0 z-50 m-2 d-btn-circle d-btn-ghost sm:hidden"
      @click="toggleSidebar"
    >
      <PhList class="text-2xl" />
    </button>

    <MainSidebar
      class="w-full transition-all sm:ml-0 sm:w-[300px] md:w-[400px]"
      :class="{
        'z-30 ml-0': isSidebarOpen,
        '-ml-[100%]': !isSidebarOpen,
      }"
    />

    <div
      class="relative w-full"
      :class="{
        hidden: isSidebarOpen,
      }"
    >
      <RouterView v-if="appStore.provider && isReady" />

      <ProviderConnection
        v-else-if="!appStore.provider"
        @confirmed="onConnectionConfirmed"
      />
    </div>
  </main>
</template>
