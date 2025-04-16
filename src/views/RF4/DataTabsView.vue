<template>
    <Tabs :default-value="componentToRender"
        v-model:model-value="componentToRender"
        class="w-full h-dvh p-4">
        <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="spinreels">
                БК
            </TabsTrigger>
            <TabsTrigger value="feeders">
                ДУ
            </TabsTrigger>
            <!-- <TabsTrigger value="spinnings">
                СУ
            </TabsTrigger> -->
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
