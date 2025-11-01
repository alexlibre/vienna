<template>
    <TabsContent :value="config.id"
        class="relative">
        <div class="space-y-8 py-4 sticky top-9 z-10 bg-primary-foreground">
            <!-- Faceted Filters -->
            <div class="flex gap-4 items-center">
                <div v-if="facetedFilters.length > 0 && table"
                    class="flex gap-8 px-4 h-9 items-center">
                    <template v-for="filter in facetedFilters"
                        :key="filter.key">
                        <DataTableFacetedFilter v-if="table?.getColumn(filter.key)"
                            :column="table.getColumn(filter.key)!"
                            :title="filter.title"
                            :options="filter.options" />
                    </template>
                </div>
                <!-- Switch Filters -->
                <div v-if="switchFilters.length > 0 && table"
                    class="flex gap-8 px-4 h-9 items-center">
                    <div v-for="filter in switchFilters"
                        :key="filter.key"
                        class="flex gap-2 items-center">
                        <Label :for="filter.key"
                            class="cursor-pointer">{{ filter.title }}</Label>
                        <Switch :id="filter.key"
                            class="cursor-pointer"
                            :model-value="filter.model.value"
                            @update:modelValue="(value) => {
                                filter.model.value = !!value
                                table?.getColumn(filter.key)?.setFilterValue(value)
                            }" />
                    </div>
                </div>
                <!-- Color Multi Filters -->
                <div v-if="colorFilters.length > 0 && table"
                    class="flex gap-8 px-4 h-9 items-center">
                    <template v-for="filter in colorFilters"
                        :key="filter.key">
                        <DataTableColorFilter v-if="table?.getColumn(filter.key)"
                            :column="table.getColumn(filter.key)!"
                            :title="filter.title"
                            :options="filter.options" />
                    </template>
                </div>
            </div>

            <!-- Range Filters -->
            <div v-if="rangeFilters.length > 0 && table"
                class="flex gap-8 px-4 h-9 items-center">
                <template v-for="filter in rangeFilters"
                    :key="filter.key">
                    <SliderInput v-if="filter.type === 'rangeMinMax'"
                        :range="filter.range"
                        :label="filter.label"
                        :model-value="filter.model.value"
                        @update:model-value="($event) => {
                            filter.model.value = $event
                            table?.getColumn(filter.minMaxPair.minKey)?.setFilterValue($event[0])
                            table?.getColumn(filter.minMaxPair.maxKey)?.setFilterValue($event[1])
                        }"
                        :step="filter.step || 1" />
                    <SliderInput v-else
                        :range="filter.range"
                        :label="filter.label"
                        :model-value="filter.model.value"
                        @update:model-value="($event) => {
                            filter.model.value = $event
                            table?.getColumn(filter.key)?.setFilterValue($event)
                        }"
                        :step="filter.step || 1" />
                </template>
            </div>

            <!-- Search and Column Visibility -->
            <div class="flex justify-between px-4">
                <Input v-if="nameColumn && table"
                    class="max-w-sm bg-primary-foreground"
                    placeholder="Поиск по названию"
                    :model-value="table.getColumn('name')?.getFilterValue() as string"
                    @update:model-value="table.getColumn('name')?.setFilterValue($event)" />
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline"
                            class="ml-auto">
                            Поля
                            <ChevronDown class="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                            v-for="column in table?.getAllColumns().filter((column) => column.getCanHide()) || []"
                            :key="column.id"
                            :modelValue="column.getIsVisible()"
                            @update:modelValue="(value: any) => {
                                column.toggleVisibility(!!value)
                            }">
                            {{ getColumnLabel(column.id) }}
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div class="relative px-4 mt-4">
            <div class="relative rounded-md border">
                <Table class="text-xs">
                    <TableHeader class="sticky top-[240px] z-[9] bg-primary-foreground">
                        <TableRow v-for="headerGroup in table?.getHeaderGroups() || []"
                            :key="headerGroup.id">
                            <TableHead v-for="header in headerGroup.headers"
                                :key="header.id">
                                <FlexRender v-if="!header.isPlaceholder"
                                    :render="header.column.columnDef.header"
                                    :props="header.getContext()" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <template v-if="table && table.getRowModel().rows?.length">
                            <template v-for="row in table.getRowModel().rows"
                                :key="row.id">
                                <TableRow :data-state="row.getIsSelected() && 'selected'">
                                    <TableCell v-for="cell in row.getVisibleCells()"
                                        :key="cell.id">
                                        <FlexRender :render="cell.column.columnDef.cell"
                                            :props="cell.getContext()" />
                                    </TableCell>
                                </TableRow>
                                <TableRow v-if="row.getIsExpanded()">
                                    <TableCell :colspan="row.getAllCells().length">
                                        {{ JSON.stringify(row.original) }}
                                    </TableCell>
                                </TableRow>
                            </template>
                        </template>
                        <TableRow v-else>
                            <TableCell :colspan="columns.length"
                                class="h-24 ">
                                Нет данных.
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>

        <!-- Таблица сравнения выбранных строк -->
        <div v-if="table && selectedRowsForComparison.length > 0"
            class="px-4 mt-8">
            <h3 class="text-lg font-semibold mb-4">
                Сравнение ({{ selectedRowsForComparison.length }})
            </h3>
            <div class="rounded-md border overflow-x-auto">
                <Table class="text-xs">
                    <TableHeader>
                        <TableRow>
                            <TableHead class="sticky left-0 bg-primary-foreground z-[9] min-w-[150px]">
                                {{ config.groupType }}
                            </TableHead>
                            <TableHead v-for="row in selectedRowsForComparison"
                                :key="row.id"
                                class="min-w-[120px]">
                                {{ getRowName(row) }}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="columnConfig in visibleColumnsForComparison"
                            :key="columnConfig.key">
                            <TableCell class="sticky left-0 bg-primary-foreground z-[9] font-medium">
                                {{ columnConfig.label }}
                            </TableCell>
                            <TableCell v-for="row in selectedRowsForComparison"
                                :key="`${row.id}-${columnConfig.key}`">
                                <ComparisonCell :value="row.original[columnConfig.key]"
                                    :config="columnConfig"
                                    :all-values="selectedRowsForComparison.map(r => r.original[columnConfig.key])" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>

        <div class="flex items-center justify-end space-x-2 p-4">
            <div class="flex-1 text-sm text-muted-foreground">
                <p>
                    Результатов: {{ table?.getFilteredRowModel().rows?.length || 0 }}
                </p>
                <p>
                    Выбрано:
                    {{ table?.getFilteredSelectedRowModel().rows.length || 0 }}
                    из
                    {{ table?.getFilteredRowModel().rows.length || 0 }}
                </p>
            </div>
            <div class="space-x-2 inline-flex items-center gap-4">
                <Label class="flex items-center gap-2">
                    <span class="text-sm text-muted-foreground">Показывать по</span>
                    <Select :model-value="`${table?.getState().pagination.pageSize || 50}`"
                        @update:model-value="updatePageSize">
                        <SelectTrigger class="h-8 w-[70px]">
                            <SelectValue :placeholder="`${table?.getState().pagination.pageSize || 50}`" />
                        </SelectTrigger>
                        <SelectContent side="top">
                            <SelectItem v-for="pageSize in [10, 25, 50]"
                                :key="pageSize"
                                :value="`${pageSize}`">
                                {{ pageSize }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </Label>
                <div>
                    <Button variant="outline"
                        size="sm"
                        :disabled="!table?.getCanPreviousPage()"
                        @click="table?.previousPage()">
                        Назад
                    </Button>
                    <Button variant="outline"
                        size="sm"
                        :disabled="!table?.getCanNextPage()"
                        @click="table?.nextPage()">
                        Вперед
                    </Button>
                </div>
            </div>
        </div>
    </TabsContent>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { TabsContent } from '../ui/tabs'

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import SliderInput from '@/components/ui/slider-input/SliderInput.vue'

import { valueUpdater, uniqueOptions, computeRange, uniqueOptionsFromArray, computeRangeFromArray } from '@/helpers'
import { ArrowUpDown, ChevronDown, Droplet, DropletOff } from 'lucide-vue-next'
import { computed, h, ref, shallowRef, toRaw, type Ref } from 'vue'

import {
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table'

import type {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    SortingState,
    VisibilityState,
} from '@tanstack/vue-table'

import DataTableFacetedFilter from "@/components/data/DataTableFacetedFilter.vue"
import DataTableColorFilter from "@/components/data/DataTableColorFilter.vue"
import ComparisonCell from "@/components/data/ComparisonCell.vue"
import { AcceptableValue } from 'reka-ui'
import type { DataSourceConfig } from '@/composables/data/tableConfig'

const props = defineProps<{
    config: DataSourceConfig
}>()

const data = computed(() => props.config.data)

// Helper для получения label колонки
const getColumnLabel = (id: string): string => {
    const column = props.config.columns.find(col => col.key === id)
    return column?.label || id
}

// Проверка наличия колонки name для поиска
const nameColumn = computed(() => props.config.columns.some(col => col.key === 'name'))

// Получение inline стиля для цвета
const getColorStyle = (color: string): Record<string, string> => {
    const normalizedColor = color.toLowerCase().trim()
    
    // Для transparent - специальная обработка
    if (normalizedColor === 'transparent') {
        return { backgroundColor: 'transparent', backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '4px 4px', backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px' }
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

// Генерация фильтров
const facetedFilters = computed(() => {
    return props.config.columns
        .filter(col => col.filterType === 'faceted')
        .map(col => ({
            key: col.key,
            title: col.label,
            options: col.isArray 
                ? uniqueOptionsFromArray(data.value, (item: any) => item[col.key])
                : uniqueOptions(data.value, (item: any) => item[col.key])
        }))
})

// Генерация colorMulti фильтров
const colorFilters = computed(() => {
    return props.config.columns
        .filter(col => col.filterType === 'colorMulti')
        .map(col => ({
            key: col.key,
            title: col.label,
            options: uniqueOptionsFromArray(data.value, (item: any) => item[col.key])
        }))
})

// Создаем ref для switch фильтров (один раз при инициализации)
const switchFilterModels = new Map<string, Ref<boolean>>()
const switchFilters = computed(() => {
    return props.config.columns
        .filter(col => col.filterType === 'switch')
        .map(col => {
            if (!switchFilterModels.has(col.key)) {
                switchFilterModels.set(col.key, ref(false))
            }
            return {
                key: col.key,
                title: col.label,
                model: switchFilterModels.get(col.key)!
            }
        })
})

// Создаем ref для range фильтров (один раз при инициализации)
const rangeFilterModels = new Map<string, Ref<number[]>>()
const rangeFilters = computed(() => {
    const filters: any[] = []
    
    props.config.columns.forEach(col => {
        if (col.filterType === 'range') {
            const range = col.isArray
                ? computeRangeFromArray(data.value, (item: any) => item[col.key])
                : computeRange(data.value, (item: any) => item[col.key] as number)
            if (!rangeFilterModels.has(col.key)) {
                rangeFilterModels.set(col.key, ref<number[]>([...range]))
            } else {
                // Обновляем диапазон если изменился
                const currentRange = [...range]
                const model = rangeFilterModels.get(col.key)!
                if (model.value[0] !== currentRange[0] || model.value[1] !== currentRange[1]) {
                    // Сбрасываем значение если оно вне нового диапазона
                    if (model.value[0] < currentRange[0] || model.value[1] > currentRange[1]) {
                        model.value = [...currentRange]
                    }
                }
            }
            filters.push({
                key: col.key,
                label: col.label,
                type: 'range',
                step: col.step || 1,
                range: range,
                model: rangeFilterModels.get(col.key)!
            })
        } else if (col.filterType === 'rangeMinMax' && col.minMaxPair) {
            const [min] = computeRange(data.value, (item: any) => item[col.minMaxPair!.minKey] as number)
            const [, max] = computeRange(data.value, (item: any) => item[col.minMaxPair!.maxKey] as number)
            if (!rangeFilterModels.has(col.key)) {
                rangeFilterModels.set(col.key, ref<number[]>([min, max]))
            } else {
                // Обновляем диапазон если изменился
                const model = rangeFilterModels.get(col.key)!
                if (model.value[0] !== min || model.value[1] !== max) {
                    // Сбрасываем значение если оно вне нового диапазона
                    if (model.value[0] < min || model.value[1] > max) {
                        model.value = [min, max]
                    }
                }
            }
            filters.push({
                key: col.key,
                label: col.label,
                type: 'rangeMinMax',
                step: col.step || 1,
                range: [min, max],
                minMaxPair: col.minMaxPair,
                model: rangeFilterModels.get(col.key)!
            })
        }
    })
    
    return filters
})

// Генерация колонок
const columns = computed<ColumnDef<any>[]>(() => {
    const cols: ColumnDef<any>[] = [
        // Select column
        {
            id: 'select',
            header: ({ table }) => h(Checkbox, {
                // @ts-ignore
                'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
                'onUpdate:modelValue': (value: any) => table.toggleAllPageRowsSelected(!!value),
                'ariaLabel': 'Select all',
            }),
            cell: ({ row }) => h(Checkbox, {
                'modelValue': row.getIsSelected(),
                'onUpdate:modelValue': (value: any) => row.toggleSelected(!!value),
                'ariaLabel': 'Select row',
            }),
            enableSorting: false,
            enableHiding: false,
        },
    ]

    // Генерируем колонки из конфигурации (пропускаем rangeMinMax - это только фильтр)
    props.config.columns
        .filter(colConfig => colConfig.filterType !== 'rangeMinMax')
        .forEach(colConfig => {
        const col: ColumnDef<any> = {
            accessorKey: colConfig.key,
            header: colConfig.sortable !== false ? ({ column }) => {
                const isSorted = column.getIsSorted()
                return h(Button, {
                    variant: 'ghost',
                    class: `self-center ${isSorted ? 'font-bold text-red-500' : ''}`,
                    onClick: () => column.toggleSorting(isSorted === 'asc'),
                }, () => [colConfig.label, h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
            } : colConfig.label,
            enableHiding: true, // Все колонки можно скрывать/показывать через UI
            cell: ({ row }) => {
                const value = row.getValue(colConfig.key)
                
                // Специальное отображение для colors - цветные круги
                if (colConfig.key === 'colors' && colConfig.filterType === 'colorMulti' && Array.isArray(value)) {
                    return h('div', { 
                        class: 'pl-4 flex gap-1 flex-wrap items-center' 
                    }, value.map((color: string) => {
                        return h('div', {
                            class: 'rounded-full size-4 border border-gray-300 flex-shrink-0',
                            style: getColorStyle(color)
                        })
                    }))
                }
                
                let formatted = value
                if (colConfig.isArray && Array.isArray(value)) {
                    formatted = value.join(', ')
                } else if (colConfig.cellFormatter) {
                    formatted = colConfig.cellFormatter(value, row.original)
                }
                const displayValue = formatted !== null && formatted !== undefined ? String(formatted) : '—'
                return h('div', { 
                    class: colConfig.key === 'name' ? 'capitalize text-nowrap' : 'pl-4' 
                }, displayValue)
            },
        }

        // Кастомная сортировка для массивов
        if (colConfig.isArray && colConfig.sortable !== false) {
            col.sortingFn = (rowA, rowB, columnId) => {
                const valueA = rowA.getValue(columnId)
                const valueB = rowB.getValue(columnId)
                
                // Если значение не массив, обрабатываем как обычно
                if (!Array.isArray(valueA) && !Array.isArray(valueB)) {
                    if (valueA == null) return valueB == null ? 0 : -1
                    if (valueB == null) return 1
                    if (typeof valueA === 'number' && typeof valueB === 'number') {
                        return valueA - valueB
                    }
                    return String(valueA).localeCompare(String(valueB))
                }
                
                // Если один из них не массив
                if (!Array.isArray(valueA)) {
                    return -1 // массивы идут после одиночных значений
                }
                if (!Array.isArray(valueB)) {
                    return 1
                }
                
                // Если оба массивы
                if (valueA.length === 0) return valueB.length === 0 ? 0 : -1
                if (valueB.length === 0) return 1
                
                // Для числовых массивов (sizes, prices) - сортируем по минимальному значению
                if (typeof valueA[0] === 'number' && typeof valueB[0] === 'number') {
                    const minA = Math.min(...valueA.filter((v: any) => v != null))
                    const minB = Math.min(...valueB.filter((v: any) => v != null))
                    if (isNaN(minA)) return isNaN(minB) ? 0 : -1
                    if (isNaN(minB)) return 1
                    return minA - minB
                }
                
                // Для строковых массивов (colors) - сортируем по первому элементу
                const firstA = valueA[0]?.toString() || ''
                const firstB = valueB[0]?.toString() || ''
                return firstA.localeCompare(firstB)
            }
        }

        // FilterFn в зависимости от типа фильтра
        if (colConfig.filterType === 'faceted') {
            col.filterFn = (row, id, value) => {
                if (!value || !Array.isArray(value)) return true
                const rowValue = row.getValue(id)
                if (colConfig.isArray && Array.isArray(rowValue)) {
                    // Для массивов проверяем, есть ли пересечение
                    return rowValue.some((v: any) => value.includes(v))
                }
                return value.includes(rowValue)
            }
        } else if (colConfig.filterType === 'colorMulti') {
            col.filterFn = (row, id, value) => {
                if (!value || !Array.isArray(value)) return true
                const rowValue = row.getValue(id)
                if (Array.isArray(rowValue)) {
                    // Для массивов цветов проверяем, есть ли пересечение
                    return rowValue.some((v: any) => value.includes(v))
                }
                return value.includes(rowValue)
            }
        } else if (colConfig.filterType === 'range') {
            col.filterFn = (row, id, value) => {
                if (!value || !Array.isArray(value) || value.length !== 2) return true
                const rowValue = row.getValue(id)
                if (colConfig.isArray && Array.isArray(rowValue)) {
                    // Для массивов проверяем, есть ли значение в диапазоне
                    return rowValue.some((v: number) => v != null && v >= value[0] && v <= value[1])
                }
                const val = rowValue as number
                if (val == null) return false
                return val >= value[0] && val <= value[1]
            }
        } else if (colConfig.filterType === 'rangeMinMax') {
            if (colConfig.minMaxPair?.minKey === colConfig.key) {
                col.filterFn = (row, id, value) => {
                    return (row.getValue(id) as number) >= value
                }
            } else if (colConfig.minMaxPair?.maxKey === colConfig.key) {
                col.filterFn = (row, id, value) => {
                    return (row.getValue(id) as number) <= value
                }
            }
        } else if (colConfig.filterType === 'switch') {
            col.filterFn = (row, id, value: boolean): boolean => {
                const val: boolean = row.getValue(id)
                return value ? val : true
            }
            col.cell = ({ row }) => {
                const value = row.getValue(colConfig.key) as boolean
                return h('div', { class: 'flex justify-center' }, 
                    value ? h(Droplet, { class: 'size-4 text-blue-500' }) : h(DropletOff, { class: 'size-4 text-red-500' }))
            }
        }

        cols.push(col)
    })

    return cols
})

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>(
    props.config.columns
        .filter(col => {
            // Скрываем колонку если: hidden === true или visible === false
            // Приоритет у visible, если указан оба параметра
            if (col.visible !== undefined) {
                return !col.visible
            }
            return col.hidden === true
        })
        .reduce((acc, col) => {
            acc[col.key] = false
            return acc
        }, {} as Record<string, boolean>)
)
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = computed(() => {
    if (!data.value || !columns.value || columns.value.length === 0) {
        return undefined
    }
    return useVueTable({
        data: data.value,
        columns: columns.value,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
        onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
        onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
        onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
        onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
        state: {
            get sorting() { return sorting.value },
            get columnFilters() { return columnFilters.value },
            get columnVisibility() { return columnVisibility.value },
            get rowSelection() { return rowSelection.value },
            get expanded() { return expanded.value },
        },
        enableRowSelection: true,
        initialState: {
            pagination: {
                pageSize: props.config.defaultPageSize || 50,
            }
        },
    })
})

const updatePageSize = (newPageSize: AcceptableValue) => {
    if (newPageSize === null || !table.value) return;
    table.value.setPageSize(+newPageSize)
}

// Получение выбранных строк для сравнения
const selectedRowsForComparison = computed(() => {
    if (!table.value) return []
    return table.value.getSelectedRowModel().rows || []
})

// Видимые колонки для сравнения (исключаем select и скрытые)
const visibleColumnsForComparison = computed(() => {
    return props.config.columns
        .filter(col => {
            // Исключаем rangeMinMax фильтры (они только для фильтрации)
            if (col.filterType === 'rangeMinMax') return false
            // Исключаем скрытые колонки
            if (col.visible === false || col.hidden === true) return false
            return true
        })
})

// Получение имени строки для заголовка
const getRowName = (row: any): string => {
    const value = row.original.name || row.original.id || `Позиция ${row.id}`
    return String(value)
}
</script>

