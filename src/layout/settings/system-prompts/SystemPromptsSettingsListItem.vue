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
    class="px-3 py-2 first:rounded-t-lg last:rounded-b-lg group bg-base-200 hover:bg-white/5 transition-all rounded-0 w-full cursor-pointer active:bg-white/10 [&:active:has(button:active)]:bg-white/5"
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

      <div class="group-hover:opacity-100 opacity- transition-all">
        <button
          class="d-btn d-btn-sm d-btn-ghost d-btn-circle hover:bg-white/10 border-0"
          data-tip="Edit"
          @click.stop="onEditClick"
        >
          <PhPencilSimple size="1.4em" />
        </button>

        <button
          class="d-btn d-btn-sm d-btn-ghost d-btn-circle hover:bg-white/10 border-0"
          @click.stop="onDeleteClick"
        >
          <PhTrash size="1.4em" />
        </button>
      </div>
    </div>

    <div
      v-if="isActive"
      class="text-white/70 whitespace-pre-line"
    >
      <div v-html="systemPrompt.content" />
    </div>
  </li>
</template>
