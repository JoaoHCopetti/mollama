<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { FADE_TRANSITION, SCALE_TRANSITION } from './constants'

withDefaults(
  defineProps<{
    panelClass?: string
  }>(),
  {
    panelClass: 'max-w-md',
  },
)

const isOpen = defineModel<boolean>('is-open', { default: false })

const closeModal = () => {
  isOpen.value = false
}
</script>

<template>
  <TransitionRoot
    appear
    :show="isOpen"
    as="template"
  >
    <Dialog
      as="div"
      class="relative z-40 h-full"
      @close="closeModal"
    >
      <TransitionChild
        as="template"
        v-bind="FADE_TRANSITION"
      >
        <div class="fixed inset-0 bg-black/50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-hidden">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            v-bind="SCALE_TRANSITION"
          >
            <DialogPanel
              class="w-full transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all"
              :class="panelClass"
            >
              <DialogTitle
                v-if="$slots['title']"
                as="h3"
                class="mt-0 text-lg leading-6 font-semibold text-base-content"
              >
                <slot name="title" />
              </DialogTitle>

              <div>
                <slot
                  name="body"
                  v-bind="{
                    closeModal,
                  }"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
