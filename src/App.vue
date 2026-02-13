<script setup lang="ts">
import { PhList } from '@phosphor-icons/vue'
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import ToastContainer from './components/toast/ToastContainer.vue'
import { useLocalStorage } from './composables/use-local-storage'
import MainSidebar from './layout/main-sidebar/MainSidebar.vue'
import SetupProviderPage from './pages/setup-provider/SetupProviderPage.vue'
import router from './router'
import { useAppStore } from './stores/app-store'
import { useShortcutsStore } from './stores/shortcuts-store'
import { useToastStore } from './stores/toast-store'
import { LocalStorageEnum } from './utils/enums'

const appStore = useAppStore()
const storage = useLocalStorage()
const route = useRoute()
const shortcutsStore = useShortcutsStore()

const isSidebarOpen = ref<boolean>(false)
const isInitialized = ref<boolean>(false)

const showSetupProviderPage = computed(() => !appStore.isReady && route.name === 'home')
const showRouterPage = computed(
  () => (!appStore.isReady && route.name !== 'home') || appStore.isReady,
)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

router.beforeEach(() => {
  if (isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
})

onBeforeMount(async () => {
  shortcutsStore.init()

  if (!appStore.isReady) {
    const lastConnection = storage.getItem(LocalStorageEnum.LastConnection)

    if (!lastConnection) {
      return
    }

    try {
      await appStore.init(lastConnection.provider, lastConnection.host)
      await appStore.fetchModels()
    } catch (error) {
      console.error(error)
      useToastStore().error(`Couldn't restore your previous connection`, { timeout: 5000 })
    }
  }

  isInitialized.value = true
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
      class="w-full transition-all sm:ml-0 sm:w-[300px] md:max-w-[370px] md:min-w-[370px]"
      :class="{
        'z-30 ml-0': isSidebarOpen,
        '-ml-[100%]': !isSidebarOpen,
      }"
    />

    <div
      class="w-full"
      :class="{
        hidden: isSidebarOpen,
      }"
    >
      <RouterView v-slot="{ Component }">
        <Component
          :is="Component"
          v-if="showRouterPage"
        />

        <SetupProviderPage v-else-if="showSetupProviderPage" />
      </RouterView>
    </div>
  </main>
</template>
