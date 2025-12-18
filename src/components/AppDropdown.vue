<script setup lang="ts" generic="T">
import AppTransition from '@/components/AppTransition.vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

defineEmits(['select'])

const props = withDefaults(
  defineProps<{
    idField: keyof T
    items: T[]
    itemClassExtend?: string
    triggerClass?: string
    triggerClassExtend?: string
  }>(),
  {
    triggerClass: 'dui-btn focus-visible:ring-2 focus-visible:ring-white/75',
    itemClassExtend: '',
    triggerClassExtend: '',
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
      from-class="scale-95 opacity-0"
      to-class="scale-100 opacity-100"
    >
      <MenuItems
        class="top-auto bottom-full absolute w-72 p-2 rounded-lg bg-base-200"
        as="ul"
        style="list-style: none"
      >
        <MenuItem
          v-for="item in items"
          :key="getItemKey(item)"
          v-slot="{ active }"
          as="li"
          @click="$emit('select', item)"
        >
          <a
            class="p-2 block rounded-lg cursor-pointer active:scale-[0.98] transition-all"
            :class="[{ 'bg-white/10': active }, itemClassExtend]"
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
