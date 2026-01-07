<script setup lang="ts">
import type { SystemPromptData } from '@/database/SystemPrompt'
import { PhPlus } from '@phosphor-icons/vue'
import { nextTick, ref, useTemplateRef } from 'vue'
import SystemPromptsSettingsForm, {
  type SystemPromptSubmitPayload,
} from './SystemPromptsSettingsForm.vue'
import SystemPromptsSettingsList from './SystemPromptsSettingsList.vue'

const showForm = ref<boolean>(false)
const settingsFormEl = useTemplateRef('systemPromptsSettingsFormRef')

const systemPromptEdit = ref<SystemPromptData>()

const onSubmit = async ({ action }: SystemPromptSubmitPayload) => {
  showForm.value = false

  if (action === 'updated') {
    systemPromptEdit.value = undefined
  }
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

const onCloseClick = () => {
  showForm.value = false

  if (systemPromptEdit.value) {
    systemPromptEdit.value = undefined
  }
}
</script>

<template>
  <div>
    <div class="mb-5">
      <button
        class="d-btn uppercase d-btn-soft d-btn-xs d-btn-success"
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
        @close="onCloseClick"
      />

      <SystemPromptsSettingsList @edit="onSystemPromptEdit" />
    </div>
  </div>
</template>
