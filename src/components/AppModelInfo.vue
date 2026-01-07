<script setup lang="ts">
import type { Model } from '@/types'
import { PhCloud, PhDesktop } from '@phosphor-icons/vue'

defineProps<{
  model: Model
  parameterExtendClass?: string
}>()
</script>

<template>
  <div class="flex justify-between gap-2 truncate">
    <div class="flex items-center gap-2 truncate">
      <Component
        :is="model.isCloud ? PhCloud : PhDesktop"
        weight="fill"
        class="min-w-fit"
      />

      <span class="truncate">{{ model.prettyName }}</span>
    </div>

    <span
      v-if="model.parameterSize"
      class="d-badge border-0 bg-primary/10 d-badge-sm font-bold opacity-50"
      :class="parameterExtendClass"
    >
      {{ model.parameterSize }}
    </span>
  </div>
</template>
