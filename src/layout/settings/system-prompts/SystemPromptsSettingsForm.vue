<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { SystemPromptForm } from './SystemPromptsSettings.vue'

const emit = defineEmits(['submit', 'cancel'])

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
    class="mt-5"
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
        class="dui-textarea resize-none"
        name="system-prompt"
        placeholder="Instructions"
        required
      />

      <div class="ml-auto">
        <button
          class="dui-btn dui-btn-ghost"
          @click="$emit('cancel')"
        >
          Cancel
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
