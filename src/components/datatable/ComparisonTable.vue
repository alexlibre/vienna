<template>
    <div>
        <div v-for="item in items"
            :key="item.id">
            <div>{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps({
    items: Array,
    default: () => []
})
</script>