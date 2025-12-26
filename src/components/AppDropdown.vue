<script setup lang="ts" generic="T">
import { Menu, MenuButton, MenuItem, MenuItems, TransitionRoot } from '@headlessui/vue'
import { FADE_TRANSITION } from './constants'

const props = withDefaults(
  defineProps<{
    idField: keyof T
    items: T[]
    activeItem?: T
    itemExtendClass?: string
    triggerClass?: any
    triggerExtendClass?: string
    containerExtendClass?: any
  }>(),
  {
    activeItem: undefined,
    triggerClass: 'd-btn focus-visible:ring-2 focus-visible:ring-white/75',
    itemExtendClass: '',
    triggerExtendClass: '',
    containerExtendClass: '',
  },
)

defineEmits(['select'])

const getItemKey = (item: T) => item[props.idField] as PropertyKey
</script>

<template>
  <Menu
    v-slot="{ open }"
    as="div"
    class="d-dropdown"
  >
    <MenuButton
      :class="[triggerClass, triggerExtendClass]"
      as="button"
      :disabled="!items.length"
    >
      <slot name="trigger" />
    </MenuButton>

    <TransitionRoot
      :show="open"
      v-bind="FADE_TRANSITION"
    >
      <MenuItems
        class="d-dropdown-content w-72 p-2 rounded-lg bg-base-200"
        :class="containerExtendClass"
        as="ul"
        style="list-style: none"
      >
        <MenuItem
          v-for="item in items"
          :key="getItemKey(item)"
          v-slot="{ active }"
          as="li"
          class="group"
          @click="$emit('select', item)"
        >
          <a
            class="p-2 block rounded cursor-pointer active:scale-[0.98] transition-all"
            :class="[
              itemExtendClass,
              {
                'bg-white/10':
                  active || (activeItem && activeItem[props.idField] === item[props.idField]),
              },
            ]"
          >
            <slot
              name="item"
              v-bind="{ item }"
            />
          </a>
        </MenuItem>
      </MenuItems>
    </TransitionRoot>
  </Menu>
</template>
