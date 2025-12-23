<script setup lang="ts">
import { useForm } from '@/composables/use-form'
import { db } from '@/database/db'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { createSystemPrompt } from '@/services/system-prompt-service'
import { computed, onMounted, useTemplateRef } from 'vue'

export type SystemPromptForm = typeof form
export type SystemPromptSubmitPayload = { action: 'created' | 'updated' }

const emit = defineEmits<{
  submit: [args: SystemPromptSubmitPayload]
  close: [args: void]
}>()

const props = defineProps<{
  systemPrompt?: SystemPromptData
}>()

onMounted(() => {
  const systemPrompt = props.systemPrompt

  if (systemPrompt) {
    form.title.value = systemPrompt?.title || ''
    form.instruction.value = systemPrompt?.content || ''
  }
})

const form = useForm({
  title: '',
  instruction: '',
})

const titleEl = useTemplateRef('titleRef')

const isEdit = computed(() => props.systemPrompt)

const onSubmit = async () => {
  if (!isEdit.value) {
    await create()
  } else {
    await update()
  }
}

const create = async () => {
  await createSystemPrompt({
    title: form.title.value,
    content: form.instruction.value,
  })

  emit('submit', { action: 'created' })
}

const update = async () => {
  if (!props.systemPrompt) {
    throw new Error(`No system prompt is selected for update`)
  }

  await db.systemPrompts.update(props.systemPrompt?.id, {
    title: form.title.value,
    content: form.instruction.value,
  })

  emit('submit', { action: 'updated' })
}

const onCloseClick = () => {
  form.resetForm()
  emit('close')
}

const focusTitleInput = () => {
  if (titleEl.value) {
    titleEl.value.focus()
  }
}

defineExpose({ focusTitleInput })
</script>

<template>
  <form
    class="m-0 p-0"
    @submit.prevent="onSubmit"
  >
    <div class="flex flex-col gap-5">
      <input
        ref="titleRef"
        v-model="form.title.value"
        type="text"
        class="d-input"
        placeholder="Title"
        required
      />

      <textarea
        id="system-prompt"
        v-model="form.instruction.value"
        class="d-textarea resize-none whitespace-pre"
        name="system-prompt"
        placeholder="Instructions"
        required
        @keypress.enter="
          (e) => {
            e.preventDefault()
            form.instruction.value += '\n'
          }
        "
      />

      <div class="ml-auto">
        <button
          class="d-btn d-btn-ghost"
          type="button"
          @click="onCloseClick"
        >
          Close
        </button>

        <button
          class="d-btn d-btn-ghost w-fit"
          type="submit"
        >
          Save
        </button>
      </div>
    </div>
  </form>
</template>
