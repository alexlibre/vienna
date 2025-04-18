<template>
    <TabsContent value="spinreels"
        class="relative">
        <div class="space-y-2 py-4 sticky top-8 z-10 bg-primary-foreground">
            <div class="flex gap-4 px-4 h-9 items-center">
                <DataTableFacetedFilter v-if="table.getColumn('size')"
                    :column="table.getColumn('size')"
                    title="Размер"
                    :options="sizes" />
                <Separator orientation="vertical"
                    class="mx-2 h-4" />
                <DataTableFacetedFilter v-if="table.getColumn('brand')"
                    :column="table.getColumn('brand')"
                    title="Бренд"
                    :options="brands" />
                <Separator orientation="vertical"
                    class="mx-2 h-4" />
                <SliderInput :range="frictionRange"
                    label="Фрикцион"
                    v-model="frictionModel"
                    @update:model-value="table.getColumn('friction')?.setFilterValue($event)"
                    :step="0.1" />
                <Separator orientation="vertical"
                    class="mx-2 h-4" />
                <SliderInput :range="mechRange"
                    label="Механизм"
                    v-model="mechModel"
                    @update:model-value="table.getColumn('mech')?.setFilterValue($event)"
                    :step="0.1" />
                <Separator orientation="vertical"
                    class="mx-2 h-4" />
                <SliderInput :range="silverRange"
                    label="Цена"
                    v-model="silverModel"
                    @update:model-value="table.getColumn('silver')?.setFilterValue($event)"
                    :step="1" />
            </div>
            <div class="flex justify-between px-4">
                <Input class="max-w-sm bg-primary-foreground"
                    placeholder="Поиск по названию"
                    :model-value="table.getColumn('name')?.getFilterValue() as string"
                    @update:model-value=" table.getColumn('name')?.setFilterValue($event)" />
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
                            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
                            :key="column.id"
                            :modelValue="column.getIsVisible()"
                            @update:modelValue="(value: any) => {
                                column.toggleVisibility(!!value)
                            }">
                            {{ getName(column.id) }}
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div class="relative px-4">
            <ScrollArea class="w-full h-full rounded-md border">
                <div>
                    <Table class="text-xs">
                        <TableHeader>
                            <TableRow v-for="headerGroup in table.getHeaderGroups()"
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
                            <template v-if="table.getRowModel().rows?.length">
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
            </ScrollArea>
        </div>

        <div class="flex items-center justify-end space-x-2 py-4">
            <div class="flex-1 text-sm text-muted-foreground">
                <p>
                    Результатов: {{ table.getFilteredRowModel().rows?.length || 0 }}
                </p>
                <p>
                    Выбрано:
                    {{ table.getFilteredSelectedRowModel().rows.length }}
                    из
                    {{ table.getFilteredRowModel().rows.length }}
                </p>
            </div>
            <div class="space-x-2 inline-flex items-center gap-4">
                <Label class="flex items-center gap-2">
                    <span class="text-sm text-muted-foreground">Показывать по</span>
                    <Select :model-value="`${table.getState().pagination.pageSize}`"
                        @update:model-value="updatePageSize">
                        <SelectTrigger class="h-8 w-[70px]">
                            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
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
                        :disabled="!table.getCanPreviousPage()"
                        @click="table.previousPage()">
                        Назад
                    </Button>
                    <Button variant="outline"
                        size="sm"
                        :disabled="!table.getCanNextPage()"
                        @click="table.nextPage()">
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
import { Separator } from '@/components/ui/separator'
// import { Switch } from '@/components/ui/switch'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from '@/components/ui/label'
import SliderInput from '@/components/ui/slider-input/SliderInput.vue'

import { valueUpdater } from '@/helpers'
import { ArrowUpDown, ChevronDown, Droplet, DropletOff } from 'lucide-vue-next'
import { computed, h, ref, shallowRef, toRaw } from 'vue'

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

// @ts-ignore
import * as reels from '../../assets/mock/RF4-spinreels.json'

import DataTableFacetedFilter from "@/components/data/DataTableFacetedFilter.vue"
import { AcceptableValue } from 'reka-ui'

import { type IReel, keyDict } from '@/composables/data/reels'
// import DataTableRangeFilter from './DataTableRangeFilter.vue'

const getName = (id: string): string => {
    // @ts-ignore
    return keyDict[id]
}

// @ts-ignore
const data = toRaw(shallowRef(reels)).value.default as IReel[]

const sizes = computed(() => data.reduce((acc: number[], item: IReel) => {
    if (!acc.includes(item.size)) acc.push(item.size)
    return acc
}, []).sort((a: number, b: number) => a > b ? 1 : -1).map((item: number) => {
    return {
        label: item,
        value: item
    }
}))

const brands = computed(() => data.reduce((acc: string[], item: IReel) => {
    if (!acc.includes(item.brand)) acc.push(item.brand)
    return acc
}, []).sort().map((item) => {
    return {
        label: item,
        value: item
    }
}))

const frictionRange = computed(() => {
    const frictions = data.map((r: IReel) => r.friction)
    return [Math.min(...frictions), Math.max(...frictions)]
})
const frictionModel = ref([])

const mechRange = computed(() => {
    const mechs = data.map((r: IReel) => r.mech)
    return [Math.min(...mechs), Math.max(...mechs)]
})
const mechModel = ref([])

const inRange = (x: number, arr: number[]) => {
    return ((x - arr[0]) * (x - arr[1]) <= 0);
}

const silverRange = computed(() => {
    const silvers = data.map((r: IReel) => r.silver)
    return [Math.min(...silvers), Math.max(...silvers)]
})
const silverModel = ref([])

const columns: ColumnDef<IReel>[] = [
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
    {
        accessorKey: 'name',
        header: 'Название',
        enableHiding: false,
        cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
    },
    {
        accessorKey: 'brand',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Бренд', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize pl-4' }, row.getValue('brand')),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'size',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Размер', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('size')),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'ratio',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Пер.число', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('ratio')),
    },
    {
        accessorKey: 'friction',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Фрикцион', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('friction')),
        filterFn: (row, id, value) => {
            const val = row.getValue(id) as number
            return inRange(val, value)
        },
    },
    {
        accessorKey: 'frictionUp',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Фрикцион улучш.', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('frictionUp') || '—'),
    },
    {
        accessorKey: 'mech',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Механизм', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('mech')),
    },
    {
        accessorKey: 'sealed',
        header: () => {
            return h('p', {
                class: 'text-sm font-medium',
            }, 'Защита')
        },
        cell: ({ row }) => h('div', { class: 'flex justify-center' }, row.getValue('sealed') ? h(Droplet, { class: 'size-4 text-blue-500' }) : h(DropletOff, { class: 'size-4 text-red-500' })),
    },
    {
        accessorKey: 'silver',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Цена, сер.', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('silver') || '—'),
    },
    {
        accessorKey: 'gold',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => ['Цена, зол.', h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('gold') || '—'),
    },

    //   {
    //     id: 'actions',
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //       const payment = row.original

    //       return h('div', { class: 'relative' }, h(DropdownAction, {
    //         payment,
    //         onExpand: row.toggleExpanded,
    //       }))
    //     },
    //   },
]



const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const expanded = ref<ExpandedState>({})
const table = useVueTable({
    data,
    columns,
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
            pageSize: 50,
        }
    },
})

const updatePageSize = (newPageSize: AcceptableValue) => {
    if (newPageSize === null) return;
    table.setPageSize(+newPageSize)
}
</script>
