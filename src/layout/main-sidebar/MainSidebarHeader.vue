<script setup lang="ts">
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { PhPlus } from '@phosphor-icons/vue'
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const shortcutStore = useShortcutsStore()
const router = useRouter()

onMounted(() => {
  shortcutStore.onPress('new-chat', () => {
    router.push({ name: 'home' }).then(() => {
      shortcutStore.trigger('chat-focus')
    })
  })
})
</script>

<template>
  <RouterLink
    to="/"
    class="dui-btn dui-btn-primary w-full px-0 mb-5 no-underline flex items-center gap-2 uppercase"
  >
    <PhPlus
      class="text-lg"
      weight="bold"
    />

    <span class="text-xs">New chat</span>
  </RouterLink>
</template>
