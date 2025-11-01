<template>
    <Tabs :default-value="currentConfig.id"
        v-model:model-value="currentConfigId"
        class="w-full p-4 relative">
        <TabsList class="flex w-full gap-1 sticky top-0 z-10 flex-wrap px-4">
            <template v-for="(config, idx) in allDataSources" :key="config.id">
                <Separator v-if="idx > 0 && config.groupType !== allDataSources[idx - 1]?.groupType"
                    orientation="vertical"
                    class="h-8 mx-1" />
                <div v-if="config.groupType !== allDataSources[idx - 1]?.groupType" class="text-sm text-muted-foreground px-2">
                    {{ config.groupType }}
                </div>
                <TabsTrigger :value="config.id"
                    class="bg-primary-foreground">
                    {{ config.label }}
                </TabsTrigger>
            </template>
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
import { Separator } from '@/components/ui/separator';

const currentConfigId = ref(allDataSources[0].id)
const currentConfig = computed(() => {
    return allDataSources.find(config => config.id === currentConfigId.value) || allDataSources[0]
})
</script>
