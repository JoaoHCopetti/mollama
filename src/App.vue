<script setup lang="ts">
import { PhList } from '@phosphor-icons/vue'
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import AppTransition from './components/AppTransition.vue'
import ToastContainer from './components/toast/ToastContainer.vue'
import { useLocalStorage } from './composables/use-local-storage'
import MainSidebar from './layout/main-sidebar/MainSidebar.vue'
import router from './router'
import { useAppStore } from './stores/app-store'
import { useShortcutsStore } from './stores/shortcuts-store'
import { useToastStore } from './stores/toast-store'
import { LocalStorageEnum } from './utils/enums'

const isSidebarOpen = ref<boolean>(false)
const appStore = useAppStore()
const storage = useLocalStorage()

const shortcutsStore = useShortcutsStore()

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

router.beforeEach(() => {
  if (isSidebarOpen.value) {
    isSidebarOpen.value = false
  }
})

onBeforeMount(async () => {
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
})

onBeforeMount(() => {
  shortcutsStore.init()
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

    <RouterView v-slot="{ Component }">
      <AppTransition
        active-class="transition-all"
        from-class="opacity-0"
        to-class="opacity-100"
        class="hello-world relative w-full"
        :class="{
          hidden: isSidebarOpen,
        }"
      >
        <Component :is="Component" />
      </AppTransition>
    </RouterView>
  </main>
</template>
