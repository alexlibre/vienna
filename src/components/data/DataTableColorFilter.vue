<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline"
        size="sm"
        class="h-8 border-dashed cursor-pointer"
        :class="{ 'border-red-500 dark:border-red-500': selectedValues.size > 0 }">
        <PlusCircleIcon class="mr-2 h-4 w-4" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical"
            class="mx-2 h-4" />
          <Badge variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden">
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <Badge v-if="selectedValues.size > 3"
              variant="secondary"
              class="rounded-sm px-1 font-normal">
              выбрано: {{ selectedValues.size }}
            </Badge>
            <template v-else>
              <Badge v-for="option in options
                .filter((option) => checkSelected(option.value))"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal flex items-center gap-1">
                <div :class="getColorClass(option.value as string)"
                  class="w-3 h-3 rounded border border-gray-300" />
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[280px] p-0"
      align="start">
      <Command :filter-function="filterFunc">
        <CommandInput :placeholder="title" />
        <CommandList>
          <CommandEmpty>Нет результатов.</CommandEmpty>
          <CommandGroup>
            <CommandItem v-for="option in options"
              :key="option.value"
              :value="option"
              @select="() => {
                const isSelected = checkSelected(option.value)
                if (isSelected) {
                  deleteSelected(option.value)
                }
                else {
                  addSelected(option.value)
                }
                const filterValues = Array.from(selectedValues)
                column?.setFilterValue(
                  filterValues.length ? filterValues : undefined,
                )
              }">
              <div :class="cn(
                'mr-2 flex rounded-[4px] items-center justify-center border border-primary',
                checkSelected(option.value)
                  ? 'bg-red-500 text-white border-red-500'
                  : 'opacity-50 [&_svg]:invisible',
              )">
                <CheckIcon :class="cn('size-3.5 text-white')" />
              </div>
              <div :class="getColorClass(option.value as string)"
                class="mr-2 w-5 h-5 rounded border border-gray-300 flex-shrink-0" />
              <span>{{ option.label }}</span>
              <span v-if="facets?.get(option.value)"
                class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                {{ facets.get(option.value) }}
              </span>
            </CommandItem>
          </CommandGroup>
          <template v-if="selectedValues.size > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem :value="{ label: 'Очистить' }"
                class="justify-center text-center"
                @select="column?.setFilterValue(undefined)">
                Очистить
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { Column } from '@tanstack/vue-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { CheckIcon, PlusCircleIcon } from 'lucide-vue-next'
import { computed } from 'vue'

interface DataTableColorFilter {
  column?: Column<any, any>
  title?: string
  options: {
    label: string | number
    value: string | number
  }[]
}

const props = defineProps<DataTableColorFilter>()

const facets = computed(() => props.column?.getFacetedUniqueValues())
const selectedValues = computed(() => new Set(props.column?.getFilterValue() as unknown[]))

const checkSelected = (val: string | number) => {
  return selectedValues.value.has(val)
}
const deleteSelected = (val: string | number) => {
  selectedValues.value.delete(val)
}
const addSelected = (val: string | number) => {
  selectedValues.value.add(val)
}

// Маппинг цветов на CSS классы или стили
const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    'transparent': 'bg-transparent border-dashed',
    'white': 'bg-white',
    'green': 'bg-green-500',
    'blue': 'bg-blue-500',
    'red': 'bg-red-500',
    'yellow': 'bg-yellow-400',
    'orange': 'bg-orange-500',
    'purple': 'bg-purple-500',
    'pink': 'bg-pink-500',
    'black': 'bg-black',
    'brown': 'bg-amber-800',
    'gray': 'bg-gray-500',
    'grey': 'bg-gray-500',
    'cyan': 'bg-cyan-500',
    'lime': 'bg-lime-400',
    'teal': 'bg-teal-500',
    'indigo': 'bg-indigo-500',
    'violet': 'bg-violet-500',
    'fuchsia': 'bg-fuchsia-500',
    'rose': 'bg-rose-500',
    'emerald': 'bg-emerald-500',
    'sky': 'bg-sky-500',
    'amber': 'bg-amber-500',
  }
  
  const normalizedColor = color.toLowerCase().trim()
  return colorMap[normalizedColor] || 'bg-gray-300'
}

const filterFunc = (list: DataTableColorFilter['options'], term: string | number) => {
  if (typeof term === 'string') {
    return list.filter(i => {
      if (typeof i.label === 'string') {
        return i.label.toLowerCase().includes(term)
      } else {
        return i.label.toString().includes(term)
      }
    })
  } else {
    return list.filter(i => i.label === term)
  }
}
</script>

