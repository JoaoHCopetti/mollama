<script setup lang="ts">
import type { Model } from '@/types'
import { PhCloud, PhDesktop } from '@phosphor-icons/vue'

defineProps<{
  model: Model
}>()
</script>

<template>
  <div class="flex justify-between gap-2 w-52">
    <div class="flex items-center gap-2">
      <Component
        :is="model.isCloud ? PhCloud : PhDesktop"
        weight="fill"
      />

      <span class="truncate">{{ model.prettyName }}</span>
    </div>

    <span
      v-if="model.parameterSize"
      class="dui-badge dui-badge-sm bg-primary/10 border-0 font-bold opacity-50"
    >
      {{ model.parameterSize }}
    </span>
  </div>
</template>
