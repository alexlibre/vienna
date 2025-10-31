<template>
    <TabsContent :value="config.id"
        class="relative">
        <div class="space-y-8 py-4 sticky top-9 z-10 bg-primary-foreground">
            <!-- Faceted Filters -->
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
                    <TableHeader class="sticky top-[240px] bg-primary-foreground">
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

import { valueUpdater, uniqueOptions, computeRange } from '@/helpers'
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

// Генерация фильтров
const facetedFilters = computed(() => {
    return props.config.columns
        .filter(col => col.filterType === 'faceted')
        .map(col => ({
            key: col.key,
            title: col.label,
            options: uniqueOptions(data.value, (item: any) => item[col.key])
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
            const range = computeRange(data.value, (item: any) => item[col.key] as number)
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
                return h(Button, {
                    variant: 'ghost',
                    class: 'self-center',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                }, () => [colConfig.label, h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
            } : colConfig.label,
            enableHiding: colConfig.hidden !== true,
            cell: ({ row }) => {
                const value = row.getValue(colConfig.key)
                const formatted = colConfig.cellFormatter 
                    ? colConfig.cellFormatter(value, row.original)
                    : value
                const displayValue = formatted !== null && formatted !== undefined ? String(formatted) : '—'
                return h('div', { 
                    class: colConfig.key === 'name' ? 'capitalize text-nowrap' : 'pl-4' 
                }, displayValue)
            },
        }

        // FilterFn в зависимости от типа фильтра
        if (colConfig.filterType === 'faceted') {
            col.filterFn = (row, id, value) => {
                return value.includes(row.getValue(id))
            }
        } else if (colConfig.filterType === 'range') {
            col.filterFn = (row, id, value) => {
                if (!value || !Array.isArray(value) || value.length !== 2) return true
                const val = row.getValue(id) as number
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
        .filter(col => col.hidden)
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
</script>

