<template>
    <div class="flex items-center gap-2">
        <Input v-model="rangeModel[0]"
            class="w-16" />
        <Slider class="w-32"
            v-model="rangeModel"
            :default-value="[range[0], range[1]]"
            :max="range[1]"
            :step="0.1" />
        <Input v-model="rangeModel[1]"
            class="w-16" />
    </div>
</template>

<script setup lang="ts">
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input';
import { computed } from 'vue';

interface IRange {
    modelValue: number[],
    range: number[],
}
const emit = defineEmits(['update:modelValue'])
const props = defineProps<IRange>()

const rangeModel = computed({
    get() {
        return props.range
    }, set(val) {
        emit('update:modelValue', [+val[0], +val[1]])
    }
})

</script>
