<script setup lang="ts">
import { PhChatCircleText } from '@phosphor-icons/vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink
    to="/"
    class="dui-btn dui-btn-primary w-full px-0 mb-5 no-underline flex items-center gap-2 uppercase"
  >
    <PhChatCircleText
      class="text-lg"
      weight="fill"
    />

    <span class="text-xs">New chat</span>
  </RouterLink>
</template>
