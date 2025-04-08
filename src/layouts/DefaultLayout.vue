<!-- https://www.shadcn-vue.com/blocks.html#Sidebar01 -->
<template>
    <SidebarProvider :default-open="false"
        v-model:open="sidebarOpened">
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div class="flex items-center gap-1 p-2 h-12 leading-none text-sm">
                            <span class="font-semibold"></span>
                            <span>ver. 0.0.1</span>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>

                <form @submit.prevent>
                    <SidebarGroup class="py-0">
                        <SidebarGroupContent class="relative">
                            <Label for="search"
                                class="sr-only">Поиск</Label>
                            <SidebarInput id="search"
                                v-model="search"
                                placeholder="Поиск"
                                class="pl-8" />
                            <Search
                                class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </form>
            </SidebarHeader>

            <ScrollArea>
                <SidebarContent class="pb-8">
                    <!-- <SidebarGroup v-for="item in data.navMain"
                        :key="item.title">
                        <SidebarGroupLabel>{{ item.title }}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem v-for="subItem in item.items"
                                    :key="subItem.title">
                                    <SidebarMenuButton :class="{ 'is-active': subItem.isActive }"
                                        as-child>
                                        <RouterLink :to="subItem.url">{{ subItem.title }}</RouterLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup> -->

                    <!-- <SidebarGroup v-for="item in filteredNav"
                        :key="item.title">
                        <SidebarGroupLabel>{{ item.title }}</SidebarGroupLabel>
                        <SidebarMenu>
                            <template v-for="subItem in item.items"
                                :key="subItem.title">
                                <Collapsible v-if="subItem.items"
                                    as-child
                                    :default-open="true"
                                    class="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger as-child>
                                            <SidebarMenuButton :tooltip="subItem.title">
                                                <span>{{ subItem.title }}</span>
                                                <ChevronRight
                                                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem v-for="subSubItem in subItem.items"
                                                    :key="subSubItem.title">
                                                    <SidebarMenuSubButton>
                                                        <RouterLink :to="`${item.url}/${subItem.id}/${subSubItem.url}`">
                                                            <span class="text-sm">{{ subSubItem.title }}</span>
                                                        </RouterLink>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                                <SidebarMenuItem v-else>
                                    <SidebarMenuButton as-child>
                                        <a :href="subItem.url">
                                            <span>{{ subItem.title }}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </template>
                        </SidebarMenu>
                    </SidebarGroup> -->
                </SidebarContent>
            </ScrollArea>
            <SidebarRail />
        </Sidebar>

        <SidebarInset class="h-screen">
            <header class="flex h-16 shrink-0 items-center justify-between border-b px-4">
                <div class="flex items-center gap-2">
                    <!-- TODO: хранить состояние бокового меню -->
                    <SidebarTrigger class="-ml-1" />
                    <Separator orientation="vertical"
                        class="mr-2 h-4" />
                    <div v-if="user?.name.length">
                        Привет, {{ user?.name }}
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <!-- <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="secondary"
                                size="icon"
                                class="rounded-full">
                                <CircleUser class="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{{ user.name }}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem as="child">
                                <RouterLink to="/profile">Профиль</RouterLink>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="logout">Выход</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> -->
                    <Button variant="ghost"
                        size="icon"
                        class="rounded-full"
                        @click="switchThemeMode">
                        <Moon
                            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Sun
                            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                </div>
            </header>
            <ScrollArea>
                <main class="px-8 py-4 pb-8 flex flex-col gap-4">
                    <h1 class="text-2xl font-medium">{{ documentTitle }}</h1>
                    <slot></slot>
                </main>
            </ScrollArea>
        </SidebarInset>
    </SidebarProvider>
</template>

<script setup lang="ts">
import { Search, CircleUser, ChevronRight, Moon, Sun } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useColorMode } from '@vueuse/core'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
// import {
//     DropdownMenu,
//     DropdownMenuLabel,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
// import { useAuthStore } from '@/store/auth'
import { useRoute, useRouter } from 'vue-router'
import { arrayDeepFilter } from '@/composables/helpers'
import { useUIStore } from '@/store/ui'
import { storeToRefs } from 'pinia'

const router = useRouter()
const route = useRoute()
// const authStore = useAuthStore()
const uiStore = useUIStore()
// const user = computed(() => authStore.user)
const { sidebarOpened } = storeToRefs(uiStore)

const documentTitle = computed(() => route.meta.title || '')

const logout = async () => {
    // await authStore.logout()
    // router.push('/auth')
}

const mode = useColorMode()
const switchThemeMode = () => {
    if (mode.value === 'dark') mode.value = 'light'
    else mode.value = 'dark'
}

const data = {
    versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
    navMain: [
        {
            title: 'Система',
            items: [
                { title: 'Начало работы', url: '/about' },
            ],
        },
        {
            title: 'Проекты',
            url: '/projects',
            items: [
                {
                    title: 'Диспетчерская', url: '#', id: 'dispatcher', items: [
                        { title: 'О проекте', url: 'about' },
                        { title: 'Документация', url: 'docs' },
                        { title: 'Дизайн', url: 'design' },
                        { title: 'Доски', url: 'board' },
                    ]
                },
                {
                    title: 'Основной сайт', url: '#', id: 'main-site', items: [
                        { title: 'О проекте', url: 'about' },
                        { title: 'Документация', url: 'docs' },
                    ]
                },
                {
                    title: 'Агентский портал', url: '#', id: 'agency', items: [
                        { title: 'О проекте', url: 'about' },
                        { title: 'Документация', url: 'docs' },
                    ]
                },
                {
                    title: 'CRM 2.0', url: '#', id: 'crm', items: [
                        { title: 'О проекте', url: 'about' },
                        { title: 'Документация', url: 'docs' },
                    ]
                },
            ],
        },
        {
            title: 'Процессы',
            items: [
                { title: 'Онбординг', url: '#' },
                { title: 'Код-ревью', url: '#' },
            ],
        },
        {
            title: 'Компания',
            url: '/company',
            items: [
                {
                    title: 'Сотрудники', url: '/employees', id: 'employees', items: [
                        { title: 'Пользователи', url: '' },
                        { title: 'Отделы', url: 'places' },
                        { title: 'Права и доступы', url: 'rights' },
                    ]
                },
                { title: 'Оборудование', url: '#' },
                { title: 'Техподдержка', url: '#' },
            ],
        },
        {
            title: 'Разработка',
            url: '/playground',
            items: [
                {
                    title: 'Ресурсы',
                    url: '/playground/resources',
                },
                {
                    title: 'UI-кит',
                    url: '/ui-kit',
                }
            ]
        }
    ],
}

const search = ref('')

const filteredNav = computed(() => {
    return search.value.length > 2 ? arrayDeepFilter(data.navMain, ({ title }) => title.toLowerCase().includes(search.value.toLowerCase()), 'items') : data.navMain
})
</script>