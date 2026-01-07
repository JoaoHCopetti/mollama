<script setup lang="ts">
import type { SystemPromptData } from '@/database/SystemPrompt'
import { deleteSystemPrompt } from '@/services/system-prompt-service'
import { PhBookBookmark, PhPencilSimple, PhTrash } from '@phosphor-icons/vue'

const emit = defineEmits<{
  edit: [args: { systemPrompt: SystemPromptData }]
}>()

const props = defineProps<{
  systemPrompt: SystemPromptData
  isActive: boolean
}>()

const onEditClick = () => {
  emit('edit', { systemPrompt: props.systemPrompt })
}

const onDeleteClick = () => {
  deleteSystemPrompt(props.systemPrompt.id)
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <li
    class="group rounded-0 w-full cursor-pointer bg-base-200 px-3 py-2 transition-all first:rounded-t-lg last:rounded-b-lg hover:bg-white/5 active:bg-white/10 [&:active:has(button:active)]:bg-white/5"
    :class="{
      'bg-white/10': isActive,
    }"
    style="list-style: none"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <PhBookBookmark weight="fill" />

        <span>{{ systemPrompt.title }}</span>
      </div>

      <div class="opacity- transition-all group-hover:opacity-100">
        <button
          class="d-btn d-btn-circle border-0 d-btn-ghost d-btn-sm hover:bg-white/10"
          data-tip="Edit"
          @click.stop="onEditClick"
        >
          <PhPencilSimple size="1.4em" />
        </button>

        <button
          class="d-btn d-btn-circle border-0 d-btn-ghost d-btn-sm hover:bg-white/10"
          @click.stop="onDeleteClick"
        >
          <PhTrash size="1.4em" />
        </button>
      </div>
    </div>

    <div
      v-if="isActive"
      class="whitespace-pre-line text-white/70"
    >
      <div v-html="systemPrompt.content" />
    </div>
  </li>
</template>
