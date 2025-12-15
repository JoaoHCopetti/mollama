<script setup lang="ts">
import { ref } from 'vue'

const showForm = ref<boolean>(false)

const onSubmit = () => {
  //
}
</script>

<template>
  <div>
    <div>
      <button
        class="dui-btn dui-btn-sm uppercase dui-btn-primary"
        @click="showForm = !showForm"
      >
        New system prompt
      </button>
    </div>

    <form
      v-if="showForm"
      action=""
      class="mt-5"
      @submit.prevent="onSubmit"
    >
      <div class="flex flex-col gap-5">
        <input
          type="text"
          class="dui-input"
          placeholder="Title"
          required
        />

        <textarea
          id="system-prompt"
          class="dui-textarea resize-none"
          name="system-prompt"
          placeholder="Type your instructions"
          required
        />

        <button
          class="dui-btn dui-btn-sm dui-btn-ghost w-fit ml-auto"
          type="submit"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>
