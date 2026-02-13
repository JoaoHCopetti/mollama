<script setup lang="ts">
import { useForm } from '@/composables/use-form'
import { useLocalStorage } from '@/composables/use-local-storage'
import router from '@/router'
import { useAppStore } from '@/stores/app-store'
import { LocalStorageEnum, ProvidersEnum } from '@/utils/enums'
import { PhCheck } from '@phosphor-icons/vue'
import { ref } from 'vue'
import MollamaLogo from '../home/_partials/MollamaLogo.vue'

export type ProviderConnectionEvents = {
  confirmed: { provider: ProvidersEnum; host: string }
}

const isConnectionOk = ref<boolean>()
const feedbackMessage = ref<string>('')

const appStore = useAppStore()
const storage = useLocalStorage()

const form = useForm<{ provider: ProvidersEnum; host: string }>({
  provider: ProvidersEnum.Ollama,
  host: '',
})

const checkConnection = async () => {
  try {
    const provider = appStore.getProvider(form.provider.value, {
      host: form.host.value,
    })

    await provider!.checkConnection(new URL(form.host.value).href)

    isConnectionOk.value = true
    feedbackMessage.value = 'Everything seems ok!'
  } catch (error) {
    isConnectionOk.value = false
    feedbackMessage.value =
      form.host.value === '' ? 'Provide an endpoint' : (error as Error).message
  }
}

const onSubmit = async () => {
  const host = form.host.value
  const provider = form.provider.value

  await appStore.init(provider, host)
  await appStore.fetchModels()

  storage.setItem(LocalStorageEnum.LastConnection, { provider, host })

  router.push({ name: 'home' })
}
</script>

<template>
  <form
    class="flex h-full w-full flex-col items-center justify-center gap-2 px-10 sm:mx-auto sm:w-1/2"
    @submit.prevent="onSubmit"
  >
    <div class="mb-10">
      <MollamaLogo />
    </div>

    <label class="d-select">
      <span class="d-label">Provider</span>

      <select
        id="provider"
        v-model="form.provider.value"
        name="provider"
      >
        <option :value="ProvidersEnum.Ollama">Ollama</option>
      </select>
    </label>

    <div
      class="d-join w-full"
      @focus.capture="feedbackMessage = ''"
    >
      <label class="d-input d-join-item rounded-r-none!">
        <span class="d-label">Endpoint</span>

        <input
          v-model="form.host.value"
          type="text"
          placeholder="http://"
          @keypress.enter.prevent="checkConnection"
        />
      </label>

      <button
        class="d-btn d-join-item rounded-md! rounded-l-none! d-btn-ghost d-btn-soft d-btn-success"
        type="button"
        @click="checkConnection"
      >
        Check
      </button>
    </div>

    <div
      class="my-3 text-sm"
      :class="{
        'text-error': !isConnectionOk,
        'text-success': isConnectionOk,
      }"
    >
      {{ feedbackMessage || '&nbsp;' }}
    </div>

    <div>
      <button
        class="d-btn d-btn-success"
        :disabled="!isConnectionOk"
        type="submit"
      >
        <PhCheck />
        Confirm
      </button>
    </div>
  </form>
</template>
