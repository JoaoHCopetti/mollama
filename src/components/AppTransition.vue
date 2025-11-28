<script setup lang="ts">
withDefaults(
  defineProps<{
    fromClass?: string
    toClass?: string
    mirror?: boolean
    activeClass?: string
  }>(),
  {
    fromClass: '',
    toClass: '',
    mirror: true,
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
    :leave-from-class="mirror ? toClass : ''"
    :leave-to-class="mirror ? fromClass : ''"
    :leave-active-class="mirror ? activeClass : ''"
  >
    <slot />
  </Transition>
</template>
