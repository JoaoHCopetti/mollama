<script setup lang="ts">
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { onMounted, type Component } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    icon: Component
    checked?: boolean
  }>(),
  {
    checked: false,
    label: undefined,
  },
)

const emit = defineEmits(['change'])

const shortcuts = useShortcutsStore()

const toggleChecked = () => {
  emit('change', !props.checked)
}

onMounted(() => {
  shortcuts.onPress('toggle-think', () => {
    toggleChecked()
  })
})
</script>

<template>
  <label
    class="input-chat-pill ring-white/20 focus:ring-2"
    :class="{
      'bg-primary/90 hover:bg-primary/80': checked,
    }"
    @click="toggleChecked"
    @keypress.space="toggleChecked"
    @keypress.enter="toggleChecked"
  >
    <Component
      :is="icon"
      :weight="checked ? 'fill' : 'bold'"
    />

    <span
      v-if="label"
      class="hidden sm:block"
    >
      {{ label }}
    </span>
  </label>
</template>
