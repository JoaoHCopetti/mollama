<script setup lang="ts">
import { useForm } from '@/composables/use-form'
import { createSystemPrompt } from '@/services/system-prompt-service'
import { PhPlus } from '@phosphor-icons/vue'
import { ref } from 'vue'
import SystemPromptsSettingsForm from './SystemPromptsSettingsForm.vue'
import SystemPromptsSettingsList from './SystemPromptsSettingsList.vue'

export type SystemPromptForm = typeof form

const showForm = ref<boolean>(false)

const form = useForm({
  title: '',
  instruction: '',
})

const onSubmit = async () => {
  await createSystemPrompt({
    title: form.title.value,
    content: form.instruction.value,
  })

  form.resetForm()
}

const onNewPromptClick = async () => {
  showForm.value = !showForm.value
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
      v-model:form="form"
      @submit="onSubmit"
      @cancel="showForm = false"
    />

    <SystemPromptsSettingsList class="max-h-56 overflow-auto" />
  </div>
</template>
