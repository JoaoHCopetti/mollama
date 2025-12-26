<script setup lang="ts" generic="T">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const props = withDefaults(
  defineProps<{
    idField: keyof T
    items: T[]
    activeItem?: T
    itemExtendClass?: string
    containerExtendClass?: any
  }>(),
  {
    activeItem: undefined,
    itemExtendClass: '',
    containerExtendClass: '',
  },
)
defineEmits(['select'])

const getItemKey = (item: T) => item[props.idField] as PropertyKey
</script>

<template>
  <Menu
    as="div"
    class="d-dropdown"
  >
    <MenuButton
      as="template"
      :disabled="!items.length"
    >
      <slot name="trigger" />
    </MenuButton>

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
  </Menu>
</template>
