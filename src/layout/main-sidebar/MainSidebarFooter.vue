<script setup lang="ts">
import { PhGear, PhGithubLogo } from '@phosphor-icons/vue'
import MainSidebarFooterItem from './MainSidebarFooterItem.vue'

defineEmits(['settings-click'])
</script>

<template>
  <div class="px-5 py-3 flex justify-between gap-3 bg-base-200">
    <div>
      <MainSidebarFooterItem
        label="GitHub"
        :icon="PhGithubLogo"
        href="https://github.com/JoaoHCopetti/mollama"
        target="_blank"
      />
    </div>

    <div>
      <MainSidebarFooterItem
        label="Settings"
        :icon="PhGear"
        @click.prevent="$emit('settings-click')"
      />
    </div>
  </div>
</template>
