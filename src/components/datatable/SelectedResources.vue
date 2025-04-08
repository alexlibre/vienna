<template>
    <div v-if="selectedResourcesDetails">
        <h1>Выбранные ресурсы</h1>
        <div class="grid grid-cols-3">
            <div v-for="(item, i) in selectedResourcesDetails"
                :key="item?.name">
                <!-- <div>{{ item.name }}</div> -->
                <div v-for="[key, value] in Object.entries(item)"
                    :key="key"
                    class="grid grid-cols-2 w-[200px]">
                    <div v-if="i === 0">{{ key }}</div>
                    <div>{{ value }}</div>
                </div>
            </div>
        </div>
        <!-- {{ resources.selectedResourcesDetails }} -->
    </div>
</template>

<script setup lang="ts">
import { useResourcesStore } from '@/store/resources';

const resourcesStore = useResourcesStore();
const { selectedResourcesDetails } = resourcesStore
</script>
