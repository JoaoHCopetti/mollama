<script setup lang="ts">
import { useLocalStorage } from '@/composables/use-local-storage'
import type { AssistantMessage } from '@/database/Message'
import { useShortcutsStore } from '@/stores/shortcuts-store'
import { LocalStorageEnum } from '@/utils/enums'
import { PhBrain } from '@phosphor-icons/vue'
import { computed, onMounted, ref } from 'vue'
import ChatInputModelsDropdown from './ChatInputModelsDropdown.vue'
import ChatInputSendButton from './ChatInputSendButton.vue'
import ChatInputTextarea from './ChatInputTextarea.vue'
import ChatInputToggle from './ChatInputToggle.vue'

const emit = defineEmits(['send', 'stop'])

const props = defineProps<{
  currentAssistMessage?: AssistantMessage
}>()

const storage = useLocalStorage()
const shortcutsStore = useShortcutsStore()

const input = defineModel<string>('input', { default: '' })
const think = defineModel<boolean>('think', { default: false })

const isTextareaFocused = ref<boolean>(false)

const state = computed(() => props.currentAssistMessage?.state)

onMounted(() => {
  shortcutsStore.onPress('toggle-think', () => {
    changeThink(!think.value)
  })
})

const onThinkChange = (e: Event) => {
  changeThink((e.target as HTMLInputElement).checked)
}

const changeThink = (value: boolean) => {
  think.value = value
  storage.setItem(LocalStorageEnum.Think, value)
}

const onSend = () => {
  emit('send')
}

const onStop = () => {
  emit('stop')
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
      v-model:input="input"
      :current-message-state="state"
      @focus-change="isTextareaFocused = $event"
      @send="onSend"
    />

    <div class="flex justify-between">
      <div class="flex items-end gap-2">
        <ChatInputModelsDropdown />

        <ChatInputToggle
          v-model="think"
          label="Think"
          :icon="PhBrain"
          @input="onThinkChange"
        />
      </div>

      <ChatInputSendButton
        :input="input"
        :current-message-state="currentAssistMessage?.state"
        @send="onSend"
        @stop="onStop"
      />
    </div>
  </div>
</template>
