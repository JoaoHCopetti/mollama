<script setup lang="ts">
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { onMounted, ref, type Component } from 'vue'

const props = defineProps<{
  label?: string
  icon: Component
  value: boolean
}>()

const emit = defineEmits(['change'])

const shortcuts = useShortcutsStore()

const checked = ref<boolean>(props.value)

onMounted(() => {
  shortcuts.onPress('toggle-think', () => {
    toggleValue()
  })
})

const toggleValue = () => {
  checked.value = !checked.value
  emit('change', checked.value)
}
</script>

<template>
  <label
    class="input-chat-pill ring-white/20 focus:ring-2"
    :class="{
      'bg-primary/90 hover:bg-primary/80': checked,
    }"
    @click="toggleValue"
    @keypress.space="toggleValue"
    @keypress.enter="toggleValue"
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
