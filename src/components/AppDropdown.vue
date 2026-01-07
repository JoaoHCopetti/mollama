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
    class="d-dropdown transition-none!"
  >
    <MenuButton
      as="template"
      :disabled="!items.length"
    >
      <slot name="trigger" />
    </MenuButton>

    <MenuItems
      class="d-dropdown-content w-72 rounded-lg bg-base-200 p-2"
      :class="containerExtendClass"
      as="ul"
      style="list-style: none; animation: none"
    >
      <MenuItem
        v-for="item in items"
        :key="getItemKey(item)"
        v-slot="{ active }"
        as="li"
        @click="$emit('select', item)"
      >
        <a
          class="dropdown-item"
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
