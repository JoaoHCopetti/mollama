<script setup lang="ts">
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { onMounted, ref, type Component } from 'vue'

const emit = defineEmits(['change'])

const shortcuts = useShortcutsStore()

const props = defineProps<{
  label?: string
  icon: Component
  value: boolean
}>()

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
    class="chat-pill"
    :class="{
      'bg-primary/90 hover:bg-primary/80': checked,
    }"
    @click="toggleValue"
  >
    <Component
      :is="icon"
      :weight="checked ? 'fill' : 'bold'"
    />

    <span v-if="label">{{ label }}</span>
  </label>
</template>
