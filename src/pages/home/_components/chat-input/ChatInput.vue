<script setup lang="ts">
import { useLocalStorage } from '@/composables/use-local-storage'
import type { AssistantMessage } from '@/database/Message'
import type { SystemPromptData } from '@/database/SystemPrompt'
import type { InputConfig, Model } from '@/types'
import { LocalStorageEnum } from '@/utils/enums'
import { PhBrain } from '@phosphor-icons/vue'
import { computed, inject, onMounted, ref } from 'vue'
import { inputConfigKey } from '../../injection-keys'
import ChatInputModelsDropdown from './ChatInputModelsDropdown.vue'
import ChatInputPromptsDropdown from './ChatInputPromptsDropdown.vue'
import ChatInputSendButton from './ChatInputSendButton.vue'
import ChatInputTextarea from './ChatInputTextarea.vue'
import ChatInputToggle from './ChatInputToggle.vue'

export type InputConfigPayload = { type: keyof InputConfig; inputConfig: InputConfig }

const storage = useLocalStorage()

const props = defineProps<{
  currentAssistMessage?: AssistantMessage
}>()

const emit = defineEmits<{
  send: [args: void]
  stop: [args: void]
  'update:input-config': [args: InputConfigPayload]
}>()

const inputConfig = inject(inputConfigKey, { message: '', think: false })

const callbacks = ref<{ [P in keyof InputConfig]: CallableFunction }>()
const isTextareaFocused = ref<boolean>(false)

const state = computed(() => props.currentAssistMessage?.state)

onMounted(() => {
  callbacks.value = {
    message: onMessageChange,
    think: onThinkChange,
    model: onModelChange,
    prompt: onPromptChange,
  }
})

const onInputConfigChange = (prop: keyof InputConfig, payload: any) => {
  if (callbacks.value && callbacks.value[prop]) {
    callbacks.value[prop](payload)
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
  inputConfig.prompt = newVal.id !== inputConfig.prompt?.id ? newVal : undefined

  storage.setItem(LocalStorageEnum.SelectedPromptId, inputConfig.prompt?.id)
}

const onThinkChange = (newVal: boolean) => {
  inputConfig.think = newVal

  storage.setItem(LocalStorageEnum.Think, newVal)
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
    class="mx-auto rounded-3xl bg-base-300 p-4 shadow-2xl"
    :class="{
      'outline-2 outline-gray-400': isTextareaFocused,
    }"
  >
    <ChatInputTextarea
      :message="inputConfig.message"
      :current-message-state="state"
      @input="onInputConfigChange('message', $event)"
      @focus-change="isTextareaFocused = $event"
      @send="onSend"
    />

    <div class="flex justify-between">
      <div class="flex items-end gap-2">
        <ChatInputModelsDropdown
          :selected-model="inputConfig.model"
          @change="onInputConfigChange('model', $event)"
        />

        <ChatInputToggle
          :value="inputConfig.think"
          label="Think"
          :icon="PhBrain"
          tabindex="0"
          @change="onInputConfigChange('think', $event)"
        />

        <ChatInputPromptsDropdown
          :prompt="inputConfig.prompt"
          @change="onInputConfigChange('prompt', $event)"
        />
      </div>

      <ChatInputSendButton
        :message="inputConfig.message"
        :assist-message-state="currentAssistMessage?.state"
        @send="onSend"
        @stop="$emit('stop')"
      />
    </div>
  </div>
</template>
