<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { SystemPromptForm } from './SystemPromptsSettings.vue'

const emit = defineEmits(['submit', 'close'])

const form = defineModel<SystemPromptForm>('form', { required: true })

const titleEl = useTemplateRef('titleRef')

const onSubmit = () => {
  emit('submit', form.value)
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
        class="dui-input"
        placeholder="Title"
        required
      />

      <textarea
        id="system-prompt"
        v-model="form.instruction.value"
        class="dui-textarea resize-none whitespace-pre"
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
          class="dui-btn dui-btn-ghost"
          type="button"
          @click="$emit('close')"
        >
          Close
        </button>

        <button
          class="dui-btn dui-btn-ghost w-fit"
          type="submit"
        >
          Save
        </button>
      </div>
    </div>
  </form>
</template>
