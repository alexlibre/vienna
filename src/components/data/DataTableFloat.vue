<template>
    <TabsContent value="float"
        class="relative">
        <div class="space-y-2 py-4 sticky top-8 z-10 bg-primary-foreground">
            <div class="flex gap-4 px-4 h-9 items-center">
                <DataTableFacetedFilter v-if="table.getColumn('type')"
                    :column="table.getColumn('type')"
                    title="Тип"
                    :options="types" />
                <Separator orientation="vertical"
                    class="mx-2 h-4" />
                <DataTableFacetedFilter v-if="table.getColumn('actions')"
                    :column="table.getColumn('actions')"
                    title="Строй"
                    :options="actions" />
                <Separator orientation="vertical"
                    class="mx-2 h-4" />
                <SliderInput :range="lengthRange"
                    label="Длина"
                    v-model="lengthModel"
                    @update:model-value="table.getColumn('length')?.setFilterValue($event)"
                    :step="0.1" />
                <Separator orientation="vertical"
                    class="mx-2 h-4" />
                <SliderInput :range="strengthRange"
                    label="Прочность"
                    v-model="strengthModel"
                    @update:model-value="table.getColumn('strength')?.setFilterValue($event)"
                    :step="0.1" />
                <Separator orientation="vertical"
                    class="mx-2 h-4" />
                <SliderInput :range="silverRange"
                    label="Цена"
                    v-model="silverModel"
                    @update:model-value="table.getColumn('silver')?.setFilterValue($event)"
                    :step="1" />
                <!-- 
                <SliderInput :range="frictionRange"
                    label="Тест"
                    v-model="frictionModel"
                    @update:model-value="table.getColumn('test')?.setFilterValue($event)"
                    :step="0.1" />
                <SliderInput :range="mechRange"
                    label="Механизм"
                    v-model="mechModel"
                    @update:model-value="table.getColumn('mech')?.setFilterValue($event)"
                    :step="0.1" /> -->

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
// import SliderInput from '@/components/ui/slider-input/SliderInput.vue'

import { valueUpdater } from '@/helpers'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
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
import * as float from '../../assets/mock/RF4-float.json'

import DataTableFacetedFilter from "@/components/data/DataTableFacetedFilter.vue"
import SliderInput from '@/components/ui/slider-input/SliderInput.vue'
import { AcceptableValue } from 'reka-ui'

import { type IFloat, keyDict } from '@/composables/data/float'
// import DataTableRangeFilter from './DataTableRangeFilter.vue'

const getName = (id: string): string => {
    // @ts-ignore
    return keyDict[id]
}

// @ts-ignore
const data = toRaw(shallowRef(float)).value.default as IFloat[]

const types = computed(() => data.reduce((acc: string[], item: IFloat) => {
    if (!acc.includes(item.type)) acc.push(item.type)
    return acc
}, []).sort().map((item) => {
    return {
        label: item,
        value: item
    }
}))

const actions = computed(() => data.reduce((acc: string[], item: IFloat) => {
    if (!acc.includes(item.actions)) acc.push(item.actions)
    return acc
}, []).sort().map((item) => {
    return {
        label: item,
        value: item
    }
}))

const lengthRange = computed(() => {
    const lengths = data.map((r: IFloat) => r.length)
    return [Math.min(...lengths), Math.max(...lengths)]
})
const lengthModel = ref([])

const silverRange = computed(() => {
    const silvers = data.map((r: IFloat) => r.silver)
    return [Math.min(...silvers), Math.max(...silvers)]
})
const silverModel = ref([])

const strengthRange = computed(() => {
    const strengths = data.map((r: IFloat) => r.strength)
    return [Math.min(...strengths), Math.max(...strengths)]
})
const strengthModel = ref([])

// const mechRange = computed(() => {
//     const mechs = data.map((r: IFloat) => r.mech)
//     return [Math.min(...mechs), Math.max(...mechs)]
// })
// const mechModel = ref([])

// const inRange = (x: number, arr: number[]) => {
//     return ((x - arr[0]) * (x - arr[1]) <= 0);
// }


const columns: ColumnDef<IFloat>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            // @ts-ignore
            'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'modelValue': row.getIsSelected(),
            'onUpdate:modelValue': value => row.toggleSelected(!!value),
            'ariaLabel': 'Select row',
            'class': 'j'
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: keyDict.name,
        enableHiding: false,
        cell: ({ row }) => h('div', { class: 'capitalize text-nowrap' }, row.getValue('name')),
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.type, h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
        },
        cell: ({ row }) => h('div', { class: 'capitalize pl-4' }, row.getValue('type')),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'testMin',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.testMin, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('testMin'))
    },
    {
        accessorKey: 'testMax',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.testMax, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('testMax'))
    },
    {
        accessorKey: 'length',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.length, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('length')),
    },
    {
        accessorKey: 'sensitivity',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.sensitivity, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('sensitivity')),
    },
    {
        accessorKey: 'rigidity',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.rigidity, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, `${row.getValue('rigidity')} / 10` || '—'),
    },
    {
        accessorKey: 'actions',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.actions, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('actions')),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'exp',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.exp, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('exp')),
        // filterFn: (row, id, value) => {
        //     return value.includes(row.getValue(id))
        // },
    },
    {
        accessorKey: 'buff',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.buff, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('buff')),
        // filterFn: (row, id, value) => {
        //     return value.includes(row.getValue(id))
        // },
    },
    {
        accessorKey: 'skills',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.skills, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('skills')),
        // filterFn: (row, id, value) => {
        //     return value.includes(row.getValue(id))
        // },
    },
    {
        accessorKey: 'cast',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.cast, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('cast')),
        enableHiding: true
        // filterFn: (row, id, value) => {
        //     return value.includes(row.getValue(id))
        // },
    },
    // {
    //     accessorKey: 'sealed',
    //     header: 'Защита',
    //     cell: ({ row }) => h('div', { class: 'flex justify-center' }, row.getValue('sealed') ? h(Droplet, { class: 'size-4 text-blue-500' }) : h(DropletOff, { class: 'size-4 text-red-500' })),
    // },
    {
        accessorKey: 'strength',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.strength, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('strength') || '—'),
    },
    {
        accessorKey: 'level',
        header: ({ column }) => {
            return h(Button, {
                variant: 'ghost',
                class: 'self-center',
                onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
            }, () => [keyDict.level, h(ArrowUpDown, { class: 'ml-2 h-4 w-4 ' })])
        },
        cell: ({ row }) => h('div', { class: 'pl-4' }, row.getValue('level') || '—'),
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
const columnVisibility = ref<VisibilityState>({
    sensitivity: false,
    cast: false
})
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
