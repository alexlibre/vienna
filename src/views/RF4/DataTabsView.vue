<template>
    <Tabs :default-value="componentToRender"
        v-model:model-value="componentToRender"
        class="w-full p-4 relative">
        <TabsList class="grid w-full gap-1 grid-cols-3 sticky top-0 z-10">
            <TabsTrigger value="spinreels"
                class="bg-primary-foreground">
                Безынерционные катушки
            </TabsTrigger>
            <TabsTrigger value="feeders"
                class="bg-primary-foreground">
                Донные удилища
            </TabsTrigger>
            <!-- <TabsTrigger value="spinnings">
                СУ
            </TabsTrigger> -->
            <TabsTrigger value="float"
                class="bg-primary-foreground">
                Поплавочные удилища
            </TabsTrigger>
        </TabsList>

        <Transition mode="in-out">
            <KeepAlive>
                <Component :is="currentComponent"
                    v-bind="propsObject" />
            </KeepAlive>
        </Transition>
    </Tabs>

</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';

import {
    Tabs,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import LoadingComponent from '@/components/base/LoadingComponent.vue';

const asyncComponents = {
    spinreels: defineAsyncComponent({
        loader: () => import('@/components/data/DataTableSpinReels.vue'),
        loadingComponent: LoadingComponent,
    }),
    feeders: defineAsyncComponent({
        loader: () => import('@/components/data/DataTableFeeders.vue'),
        loadingComponent: LoadingComponent,
    }),
    spinnings: defineAsyncComponent({
        loader: () => import('@/components/data/DataTableSpinReels.vue'),
        loadingComponent: LoadingComponent,
    }),
    float: defineAsyncComponent({
        loader: () => import('@/components/data/DataTableFloat.vue'),
        loadingComponent: LoadingComponent,
    })
}

const componentToRender = ref<keyof typeof asyncComponents>('spinreels')
const currentComponent = computed(() => {
    return asyncComponents[componentToRender.value]
})

const propsObject = ref({
    data: []
})
</script>
