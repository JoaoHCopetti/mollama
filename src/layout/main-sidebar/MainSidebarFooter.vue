<script setup lang="ts">
import { PhGear, PhGithubLogo } from '@phosphor-icons/vue'
import MainSidebarFooterItem from './MainSidebarFooterItem.vue'

//
</script>

<template>
  <div class="px-5 py-3 flex justify-between gap-3 bg-base-200">
    <div>
      <MainSidebarFooterItem
        label="GitHub"
        :icon="PhGithubLogo"
      />
    </div>

    <div>
      <MainSidebarFooterItem
        label="Settings"
        :icon="PhGear"
      />
    </div>
  </div>
</template>
