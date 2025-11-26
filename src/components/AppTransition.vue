<script setup lang="ts">
withDefaults(
  defineProps<{
    fromClass?: string
    toClass?: string
    activeClass?: string
  }>(),
  {
    fromClass: '',
    toClass: '',
    activeClass: 'transition-all',
  },
)
</script>

<template>
  <Transition
    mode="out-in"
    :enter-active-class="activeClass"
    :enter-from-class="fromClass"
    :enter-to-class="toClass"
    :leave-from-class="toClass"
    :leave-to-class="fromClass"
    :leave-active-class="activeClass"
  >
    <slot />
  </Transition>
</template>
