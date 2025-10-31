<template>
    <Tabs :default-value="currentConfig.id"
        v-model:model-value="currentConfigId"
        class="w-full p-4 relative">
        <TabsList class="flex w-full gap-1 sticky top-0 z-10">
            <TabsTrigger v-for="config in allDataSources"
                :key="config.id"
                :value="config.id"
                class="bg-primary-foreground">
                {{ config.label }}
            </TabsTrigger>
        </TabsList>

        <DataTable v-for="config in allDataSources"
            :key="config.id"
            :config="config" />
    </Tabs>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import {
    Tabs,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import DataTable from '@/components/data/DataTable.vue';
import { allDataSources } from '@/composables/data/configs';

const currentConfigId = ref(allDataSources[0].id)
const currentConfig = computed(() => {
    return allDataSources.find(config => config.id === currentConfigId.value) || allDataSources[0]
})
</script>
