<script lang="ts" setup>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'

interface OptionsItem {
  label: string
  value: string
}

const props = defineProps < {
  options: OptionsItem[]
} > ()

const optionsMap = computed(() => props.options.reduce((acc, item) => {
  acc[item.value] = item.label
  return acc
}, {} as Record<string, string>))

const modelValue = defineModel < string > ()
</script>

<template>
  <Listbox v-model="modelValue" as="div" class="relative h-10">
    <ListboxButton>
      <span class="inline-flex items-center justify-center px-3 h-[31px] select-none rounded-lg text-sm shadow-sm border-[rgba(0,0,0,.2)] border-x-[1.5px] border-t-[1.5px] border-b-4 active:border-b-[1.5px] active:h-[26px] active:translate-y-1 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1">
        {{ optionsMap[modelValue!] }}
      </span>
    </ListboxButton>

    <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <ListboxOptions
        class="absolute top-9 right-0 max-h-60 min-w-20 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
      >
        <ListboxOption v-for="option in options" v-slot="{ active, selected }" :key="option.value" :value="option.value" as="template">
          <li
            class="relative cursor-default select-none px-2 py-1.5 text-center truncate [&+&]:mt-0.5"
            :class="[
              active ? 'bg-gray-50' : '',
              selected ? '!bg-gray-100' : '',
            ]"
          >
            {{ option.label }}
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>
