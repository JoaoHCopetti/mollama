<script setup lang="ts">
import type { Model } from '@/types'
import { PhCloud, PhDesktop } from '@phosphor-icons/vue'

withDefaults(
  defineProps<{
    model: Model
    displayProp?: keyof Model
  }>(),
  { displayProp: 'prettyName' },
)
</script>

<template>
  <div class="flex items-center gap-2">
    <PhCloud
      v-if="model.isCloud"
      weight="fill"
    />

    <PhDesktop
      v-else
      weight="fill"
    />

    <span>{{ model[displayProp] }}</span>

    <span class="dui-badge dui-badge-sm bg-primary/10 border-0 font-bold opacity-50">
      {{ model.parameterSize }}
    </span>
  </div>
</template>
