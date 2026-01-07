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
  <div class="group relative w-full">
    <Menu
      ref="dropdown"
      as="div"
    >
      <MenuButton
        as="button"
        class="absolute top-0 right-0 z-10 h-full cursor-pointer border-0 bg-transparent opacity-0 transition-all ease-out group-hover:opacity-100 group-active:scale-[0.9]"
      >
        <div class="top-0 right-0 flex h-full w-full items-center px-4 text-white/80">
          <PhDotsThreeVertical
            weight="bold"
            size="1.3rem"
          />
        </div>
      </MenuButton>

      <MenuItems
        as="ul"
        class="absolute top-10 right-2 z-30 h-fit w-46 rounded-lg bg-base-300 p-2 drop-shadow-md"
        style="list-style: none"
      >
        <MenuItem
          v-slot="{ active }"
          as="li"
        >
          <a
            class="dropdown-item flex items-center gap-2 py-1 text-sm"
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
      class="relative m-1 flex flex-col rounded-xl bg-white/2 p-4 no-underline transition-all ease-out group-active:scale-[0.98] hover:bg-white/5"
      active-class="bg-white/10 hover:bg-white/15"
    >
      <div
        class="truncate pr-8 text-sm font-medium tracking-wide"
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
