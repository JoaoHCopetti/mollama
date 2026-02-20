<script setup lang="ts">
import { useBreakpoints } from '@/composables/use-breakpoints'
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { PhNotePencil } from '@phosphor-icons/vue'
import { nextTick, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const shortcutStore = useShortcutsStore()
const { screenGreaterThan } = useBreakpoints()

const router = useRouter()

const focusInputOnNextTick = () => {
  nextTick(() => {
    shortcutStore.trigger('chat-focus')
  })
}

onMounted(() => {
  shortcutStore.onPress('new-chat', () => {
    router.push({ name: 'home' }).then(() => {
      if (screenGreaterThan('sm')) {
        nextTick(() => {
          shortcutStore.trigger('chat-focus')
        })
      }
    })
  })
})
</script>

<template>
  <div class="mx-4 mb-10">
    <RouterLink
      is="button"
      to="/"
      class="d-btn d-btn-block px-0 uppercase no-underline d-btn-soft d-btn-primary"
      @click="focusInputOnNextTick"
    >
      <PhNotePencil
        class="text-lg"
        weight="fill"
      />

      <span class="text-xs">New chat</span>
    </RouterLink>
  </div>
</template>
