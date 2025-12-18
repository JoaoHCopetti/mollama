<script setup lang="ts">
import type { AssistantMessage } from '@/database/Message'
import type { SystemPromptData } from '@/database/SystemPrompt'
import type { InputConfig, Model } from '@/types'
import { PhBrain } from '@phosphor-icons/vue'
import { computed, inject, ref } from 'vue'
import { inputConfigKey } from '../../injection-keys'
import ChatInputModelsDropdown from './ChatInputModelsDropdown.vue'
import ChatInputPromptsDropdown from './ChatInputPromptsDropdown.vue'
import ChatInputSendButton from './ChatInputSendButton.vue'
import ChatInputTextarea from './ChatInputTextarea.vue'
import ChatInputToggle from './ChatInputToggle.vue'

export type InputConfigPayload = { type: keyof InputConfig; inputConfig: InputConfig }
const emit = defineEmits<{
  send: [args: void]
  stop: [args: void]
  'update:input-config': [args: InputConfigPayload]
}>()

const props = defineProps<{
  currentAssistMessage?: AssistantMessage
}>()

const inputConfig = inject(inputConfigKey, { message: '', think: false })

const isTextareaFocused = ref<boolean>(false)

const state = computed(() => props.currentAssistMessage?.state)

const onInputConfigChange = (prop: keyof InputConfig, payload: any) => {
  const callbacks: { [P in keyof InputConfig]: CallableFunction } = {
    message: onMessageChange,
    think: onThinkChange,
    model: onModelChange,
    prompt: onPromptChange,
  }

  if (callbacks[prop]) {
    callbacks[prop](payload)
    emit('update:input-config', { type: prop, inputConfig })
    return
  }

  throw new Error(`Callback for "${prop}" prop isn't registered`)
}

const onMessageChange = (e: Event) => {
  const target = e.target as HTMLTextAreaElement

  inputConfig.message = target.value
}

const onPromptChange = (newVal: SystemPromptData) => {
  inputConfig.prompt = newVal
}

const onThinkChange = (newVal: boolean) => {
  inputConfig.think = newVal
}

const onModelChange = (newVal: Model) => {
  inputConfig.model = newVal
}

const onSend = () => {
  emit('send')
}
</script>

<template>
  <div
    class="bg-base-300 p-4 rounded-3xl mx-auto shadow-2xl"
    :class="{
      'outline-gray-400 outline-2': isTextareaFocused,
    }"
  >
    <ChatInputTextarea
      :input="inputConfig.message"
      :current-message-state="state"
      @input="onInputConfigChange('message', $event)"
      @focus-change="isTextareaFocused = $event"
      @send="onSend"
    />

    <div class="flex justify-between">
      <div class="flex items-end gap-2">
        <ChatInputModelsDropdown @change="onInputConfigChange('model', $event)" />

        <ChatInputToggle
          label="Think"
          :icon="PhBrain"
          @change="onInputConfigChange('think', $event)"
        />

        <ChatInputPromptsDropdown @change="onInputConfigChange('prompt', $event)" />
      </div>

      <ChatInputSendButton
        :input="inputConfig.message"
        :current-message-state="currentAssistMessage?.state"
        @send="onSend"
        @stop="$emit('stop')"
      />
    </div>
  </div>
</template>
