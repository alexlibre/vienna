<template>
    <TabsContent value="feeders">
        <div class="flex gap-2 items-center py-4">
            <Input class="max-w-sm"
                placeholder="Поиск по названию"
                :model-value="table.getColumn('name')?.getFilterValue() as string"
                @update:model-value=" table.getColumn('name')?.setFilterValue($event)" />
            <DataTableFacetedFilter v-if="table.getColumn('actions')"
                :column="table.getColumn('actions')"
                :title="keyDict.actions"
                :options="actions" />
            <DataTableFacetedFilter v-if="table.getColumn('type')"
                :column="table.getColumn('type')"
                :title="keyDict.type"
                :options="types" />

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
                        :checked="column.getIsVisible()"
                        @update:checked="(value) => {
                            column.toggleVisibility(!!value)
                        }">
                        {{ keyDict[column.id] }}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div class="relative">
            <ScrollArea :data-sidebar-opened="sidebarOpened"
                class="w-[calc(100vw-64px)] data-[sidebar-opened=true]:w-[calc(100vw-64px-256px)] h-[600px] rounded-md border">
                <div class="">
                    <Table class="text-xs leading-3">
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
                    <!-- из
                    {{ table.getFilteredRowModel().rows.length }} -->
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
                            <SelectItem v-for="pageSize in [10, 25, 50, 100]"
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

        <!-- <ComparisonTable :items="table.getSelectedRowModel().rows.map(item => item.original)" />
        {{ rowSelection }} -->
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from '@/components/ui/label'

import { valueUpdater } from '@/composables/valueUpdater'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { computed, h, ref, shallowRef, toRaw, watch, onMounted } from 'vue'

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
    RowSelectionState,
    SortingState,
    VisibilityState,
} from '@tanstack/vue-table'

import * as feeders from '@/assets/mock/RF4-feeders.json'
const rowSelection = ref<RowSelectionState>({})

import DataTableFacetedFilter from "@/components/datatable/DataTableFacetedFilter.vue"
import { useUIStore } from '@/store/ui'

import ComparisonTable from './ComparisonTable.vue'
import { useResourcesStore } from '@/store/resources'

export interface IFeeder {
    name: string,
    type: string,
    testMin: number,
    testMax: number,
    length: number,
    sensitivity: number,
    rigidity: number,
    actions: string,
    exp: string,
    buff: string,
    skills: string,
    cast: string,
    strength: number,
    level: number,
    silver: number,
}

const uiStore = useUIStore()
const resourcesStore = useResourcesStore()
const sidebarOpened = computed(() => uiStore.sidebarOpened)
const defaultPageSize = computed(() => uiStore.defaultPageSize)

type KeysEnum<T> = { [P in keyof Required<T>]: string };

const keyDict: KeysEnum<IFeeder> = {
    name: "Название",
    type: "Тип",
    testMin: "Тест min.",
    testMax: "Тест max.",
    length: "Длина",
    sensitivity: "Чувств.",
    rigidity: "Жёст.",
    actions: "Строй",
    exp: "Опыт",
    buff: "Бонус",
    skills: "Навыки",
    cast: "Дальность заброса",
    strength: "Прочность, кг.",
    level: "Уровень",
    silver: "Цена, сер.",
}

const data = toRaw(shallowRef<IFeeder[]>(feeders)).value.default

const actions = computed(() => data.reduce((acc: string[], item: IFeeder) => {
    if (!acc.includes(item.actions)) acc.push(item.actions)
    return acc
}, []).sort().map((item: string) => {
    return {
        label: item,
        value: item
    }
}))

const types = computed(() => data.reduce((acc: string[], item: IFeeder) => {
    if (!acc.includes(item.type)) acc.push(item.type)
    return acc
}, []).sort().map((item: number) => {
    return {
        label: item,
        value: item
    }
}))

const columns: ColumnDef<IFeeder>[] = [
    {
        id: 'select',
        header: ({ table }) => h(Checkbox, {
            'checked': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
            'ariaLabel': 'Select all',
        }),
        cell: ({ row }) => h(Checkbox, {
            'checked': row.getIsSelected(),
            'onUpdate:checked': value => row.toggleSelected(!!value),
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
    initialState: {
        pagination: {
            pageSize: defaultPageSize.value,
        }
    },
})

const updatePageSize = (newPageSize: string) => {
    table.setPageSize(newPageSize)
    // uiStore.setDefaultPageSize(newPageSize)
}

watch(() => rowSelection.value, (newVal) => {
    console.log('newVal', newVal)
    resourcesStore.updateResources({ key: 'feeders', resources: newVal, details: table.getSelectedRowModel().rows.map(item => item.original) })
})

onMounted(() => {
    rowSelection.value = resourcesStore.selectedResources['feeders'] || []
})
</script>
