<script setup lang="ts">
import type { SystemPromptData } from '@/database/SystemPrompt'
import { PhPlus } from '@phosphor-icons/vue'
import { nextTick, ref, useTemplateRef } from 'vue'
import SystemPromptsSettingsForm from './SystemPromptsSettingsForm.vue'
import SystemPromptsSettingsList from './SystemPromptsSettingsList.vue'

const showForm = ref<boolean>(false)
const settingsFormEl = useTemplateRef('systemPromptsSettingsFormRef')

const systemPromptEdit = ref<SystemPromptData>()

const onSubmit = async () => {
  showForm.value = false
}

const onNewPromptClick = async () => {
  showForm.value = !showForm.value

  nextTick(() => {
    if (settingsFormEl.value) {
      settingsFormEl.value.focusTitleInput()
    }
  })
}

const onSystemPromptEdit = ({ systemPrompt }: { systemPrompt: SystemPromptData }) => {
  showForm.value = true
  systemPromptEdit.value = systemPrompt
}
</script>

<template>
  <div>
    <div class="mb-5">
      <button
        class="d-btn d-btn-xs uppercase d-btn-success"
        @click="onNewPromptClick"
      >
        <PhPlus weight="bold" />
        New prompt
      </button>
    </div>

    <div class="relative">
      <SystemPromptsSettingsForm
        v-if="showForm"
        ref="systemPromptsSettingsFormRef"
        :system-prompt="systemPromptEdit"
        @submit="onSubmit"
        @close="showForm = false"
      />

      <SystemPromptsSettingsList @edit="onSystemPromptEdit" />
    </div>
  </div>
</template>
