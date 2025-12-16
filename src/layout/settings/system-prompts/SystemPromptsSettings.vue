<script setup lang="ts">
import { useForm } from '@/composables/use-form'
import { createSystemPrompt } from '@/services/system-prompt-service'
import { PhPlus } from '@phosphor-icons/vue'
import { nextTick, ref, useTemplateRef } from 'vue'
import SystemPromptsSettingsForm from './SystemPromptsSettingsForm.vue'
import SystemPromptsSettingsList from './SystemPromptsSettingsList.vue'

export type SystemPromptForm = typeof form

const showForm = ref<boolean>(false)
const settingsFormEl = useTemplateRef('systemPromptsSettingsFormRef')

const form = useForm({
  title: '',
  instruction: '',
})

const onSubmit = async () => {
  await createSystemPrompt({
    title: form.title.value,
    content: form.instruction.value,
  })

  showForm.value = false
  form.resetForm()
}

const onNewPromptClick = async () => {
  showForm.value = !showForm.value

  nextTick(() => {
    if (settingsFormEl.value) {
      settingsFormEl.value.focusTitleInput()
    }
  })
}
</script>

<template>
  <div>
    <div>
      <button
        class="dui-btn dui-btn-xs uppercase dui-btn-success"
        @click="onNewPromptClick"
      >
        <PhPlus weight="bold" />
        New prompt
      </button>
    </div>

    <SystemPromptsSettingsForm
      v-if="showForm"
      ref="systemPromptsSettingsFormRef"
      v-model:form="form"
      @submit="onSubmit"
      @close="showForm = false"
    />

    <SystemPromptsSettingsList />
  </div>
</template>
