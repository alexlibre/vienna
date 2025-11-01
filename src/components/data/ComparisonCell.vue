<template>
    <div :class="cellClasses"
        class="px-2">
        <template v-if="isColorsArray">
            <div class="flex gap-1 flex-wrap items-center">
                <div v-for="(color, idx) in (value as string[])" 
                    :key="idx"
                    class="rounded-full size-4 border border-gray-300 flex-shrink-0"
                    :style="getColorStyle(color)" />
            </div>
        </template>
        <template v-else-if="value !== null && value !== undefined">
            <div class="text-center">
                {{ formattedValue }}
            </div>
        </template>
        <template v-else>
            —
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ColumnConfig } from '@/composables/data/tableConfig'

interface Props {
    value: any
    config: ColumnConfig
    allValues?: any[]  // Все значения в строке для сравнения
}

const props = defineProps<Props>()

// Получение inline стиля для цвета
const getColorStyle = (color: string): Record<string, string> => {
    const normalizedColor = color.toLowerCase().trim()
    
    // Для transparent - специальная обработка
    if (normalizedColor === 'transparent') {
        return { 
            backgroundColor: 'transparent', 
            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', 
            backgroundSize: '4px 4px', 
            backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px' 
        }
    }
    
    // Маппинг цветов на hex значения
    const colorMap: Record<string, string> = {
        'white': '#ffffff',
        'green': '#22c55e',
        'blue': '#3b82f6',
        'red': '#ef4444',
        'yellow': '#facc15',
        'orange': '#f97316',
        'purple': '#a855f7',
        'pink': '#ec4899',
        'black': '#000000',
        'brown': '#92400e',
        'gray': '#6b7280',
        'grey': '#6b7280',
        'cyan': '#06b6d4',
        'lime': '#84cc16',
        'teal': '#14b8a6',
        'indigo': '#6366f1',
        'violet': '#8b5cf6',
        'fuchsia': '#d946ef',
        'rose': '#f43f5e',
        'emerald': '#10b981',
        'sky': '#0ea5e9',
        'amber': '#f59e0b',
    }
    
    const hexColor = colorMap[normalizedColor] || '#d1d5db'
    return { backgroundColor: hexColor }
}

const isColorsArray = computed(() => {
    return props.config.key === 'colors' && 
           props.config.filterType === 'colorMulti' && 
           Array.isArray(props.value)
})

const formattedValue = computed(() => {
    if (props.config.cellFormatter) {
        return props.config.cellFormatter(props.value)
    }
    if (props.config.isArray && Array.isArray(props.value)) {
        return props.value.join(', ')
    }
    return String(props.value)
})

// Определение, является ли это значение лучшим для сравнения
const isBestValue = computed(() => {
    if (!props.config.comparisonType || 
        props.config.comparisonType === 'none' ||
        !props.allValues ||
        props.allValues.length < 2) {
        return false
    }

    // Фильтруем валидные числовые значения
    const numericValues = props.allValues
        .filter((v): v is number => {
            if (typeof v === 'number' && !isNaN(v) && v !== null && v !== undefined) {
                return true
            }
            return false
        })

    if (numericValues.length === 0) return false

    // Проверяем, есть ли различия между значениями
    const uniqueValues = new Set(numericValues)
    if (uniqueValues.size <= 1) {
        // Все значения одинаковые - не выделяем
        return false
    }

    const currentNumericValue = typeof props.value === 'number' && !isNaN(props.value) 
        ? props.value 
        : null

    if (currentNumericValue === null) return false

    if (props.config.comparisonType === 'more-is-better') {
        // Больше = лучше, но только если есть различия
        return currentNumericValue === Math.max(...numericValues)
    } else if (props.config.comparisonType === 'less-is-better') {
        // Меньше = лучше, но только если есть различия
        return currentNumericValue === Math.min(...numericValues)
    }

    return false
})

// Классы для выделения лучшего значения
const cellClasses = computed(() => {
    if (isBestValue.value) {
        return 'flex items-center justify-center text-green-600 dark:text-green-400 font-bold'
    }
    return 'flex items-center justify-center'
})
</script>

