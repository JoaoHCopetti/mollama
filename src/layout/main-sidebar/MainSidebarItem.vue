<script setup lang="ts">
import type { SessionData } from '@/database/Session'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { PhDotsThreeVertical, PhTrash } from '@phosphor-icons/vue'

export type DeleteEventArgs = { session: SessionData }

const emit = defineEmits<{
  delete: [args: { session: SessionData }]
}>()

const props = defineProps<{
  session: SessionData
}>()

const onDeleteClick = () => {
  emit('delete', { session: props.session })
}
</script>

<template>
  <div class="relative w-full group">
    <Menu
      ref="dropdown"
      as="div"
    >
      <MenuButton
        as="button"
        class="absolute z-10 group-active:scale-[0.9] ease-out transition-all cursor-pointer bg-transparent group-hover:opacity-100 opacity-0 right-0 top-0 h-full border-0"
      >
        <div class="w-full text-white/80 right-0 top-0 flex items-center px-4 h-full">
          <PhDotsThreeVertical
            weight="bold"
            size="1.3rem"
          />
        </div>
      </MenuButton>

      <MenuItems
        as="ul"
        class="w-46 p-2 bg-base-300 z-30 rounded-lg absolute right-2 h-fit top-10 drop-shadow-md"
        style="list-style: none"
      >
        <MenuItem
          v-slot="{ active }"
          as="li"
        >
          <a
            class="dropdown-item flex items-center gap-2 text-sm py-1"
            :class="{ 'bg-white/10': active }"
            @click="onDeleteClick"
          >
            <PhTrash />

            <span>Delete</span>
          </a>
        </MenuItem>
      </MenuItems>
    </Menu>

    <RouterLink
      is="li"
      v-slot="{ isActive }"
      :to="`/sessions/${session.id}`"
      class="relative bg-white/2 no-underline group-active:scale-[0.98] transition-all flex flex-col p-4 m-1 rounded-xl ease-out hover:bg-white/5"
      active-class="bg-white/10 hover:bg-white/15"
    >
      <div
        class="text-sm font-medium tracking-wide truncate pr-8"
        :class="{
          'text-white drop-shadow-md': isActive,
          'text-white/80 group-hover:text-white': !isActive,
        }"
      >
        {{ session.title }}
      </div>
    </RouterLink>
  </div>
</template>
