<script setup lang="ts" generic="T">
import AppTransition from '@/components/AppTransition.vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

defineEmits(['select'])

const props = withDefaults(
  defineProps<{
    idField: keyof T
    items: T[]
    activeItem?: T
    itemClassExtend?: string
    triggerClass?: any
    triggerClassExtend?: string
    containerClassExtend?: any
  }>(),
  {
    activeItem: undefined,
    triggerClass: 'dui-btn focus-visible:ring-2 focus-visible:ring-white/75',
    itemClassExtend: '',
    triggerClassExtend: '',
    containerClassExtend: '',
  },
)

const getItemKey = (item: T) => item[props.idField] as PropertyKey
</script>

<template>
  <Menu
    as="div"
    class="dui-dropdown"
  >
    <MenuButton
      :class="[triggerClass, triggerClassExtend]"
      as="button"
    >
      <slot name="trigger" />
    </MenuButton>

    <AppTransition
      v-if="items.length"
      from-class="scale-95 opacity-0"
      to-class="scale-100 opacity-100"
    >
      <MenuItems
        class="top-auto bottom-full absolute w-72 p-2 rounded-lg bg-base-200"
        :class="containerClassExtend"
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
              itemClassExtend,
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
    </AppTransition>
  </Menu>
</template>
