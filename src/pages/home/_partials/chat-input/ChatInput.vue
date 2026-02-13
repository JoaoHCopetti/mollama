<script setup lang="ts">
import type { AssistantMessage } from '@/database/Message'
import type { SystemPromptData } from '@/database/SystemPrompt'
import { useChatInputStore } from '@/stores/chat-input-store'
import type { InputConfig, Model } from '@/types'
import { PhBrain } from '@phosphor-icons/vue'
import { computed, ref } from 'vue'
import ChatInputModelsDropdown from './ChatInputModelsDropdown.vue'
import ChatInputPromptsDropdown from './ChatInputPromptsDropdown.vue'
import ChatInputSendButton from './ChatInputSendButton.vue'
import ChatInputTextarea from './ChatInputTextarea.vue'
import ChatInputToggle from './ChatInputToggle.vue'

export type InputConfigPayload = { type: keyof InputConfig; config: InputConfig }

const chatInputStore = useChatInputStore()

const props = defineProps<{
  currentAssistMessage?: AssistantMessage
}>()

const emit = defineEmits<{
  send: [args: void]
  stop: [args: void]
  'update:input-config': [args: InputConfigPayload]
}>()

const isTextareaFocused = ref<boolean>(false)

const state = computed(() => props.currentAssistMessage?.state)

const onMessageChange = (e: Event) => {
  chatInputStore.setMessage((e.target as HTMLTextAreaElement).value)
}

const onPromptChange = (prompt: SystemPromptData) => {
  chatInputStore.setPrompt(prompt)
}

const onThinkChange = (think: boolean) => {
  chatInputStore.setThink(think)
}

const onModelChange = (model: Model) => {
  chatInputStore.setModel(model)
}

const onSend = () => {
  emit('send')
}
</script>

<template>
  <div
    class="mx-auto rounded-3xl bg-base-300 p-4 pb-2 shadow-2xl sm:pb-4"
    :class="{
      'outline-2 outline-gray-400': isTextareaFocused,
    }"
  >
    <ChatInputTextarea
      :current-message-state="state"
      @input="onMessageChange"
      @focus-change="isTextareaFocused = $event"
      @send="onSend"
    />

    <div class="flex justify-between">
      <div class="flex items-end gap-2 pb-2 sm:overflow-visible sm:pb-0">
        <ChatInputModelsDropdown
          :selected-model="chatInputStore.config.model"
          @change="onModelChange"
        />

        <ChatInputToggle
          :checked="chatInputStore.config.think"
          label="Think"
          :icon="PhBrain"
          tabindex="0"
          @change="onThinkChange"
        />

        <ChatInputPromptsDropdown
          :selected-prompt="chatInputStore.config.prompt"
          @change="onPromptChange"
        />
      </div>

      <ChatInputSendButton
        :message="chatInputStore.config.message"
        :assist-message-state="currentAssistMessage?.state"
        @send="onSend"
        @stop="$emit('stop')"
      />
    </div>
  </div>
</template>
