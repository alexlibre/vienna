<template>
    <div class="space-y-2"
        v-if="sliderValue">
        <div class="flex justify-between items-center">
            <Label v-if="label.length">{{ label }}</Label>
            <Button v-if="isTouched"
                @click="setRangeDefaults"
                class="p-0 h-[14px] text-red-500"
                size="sm"
                variant="link">
                Сбросить
                <!-- <XCircle class="h-2 w-2" /> -->
            </Button>
        </div>
        <div class="flex items-center gap-2">
            <NumberFieldRoot v-model="sliderValue[0]"
                :max="sliderValue[1]">
                <NumberFieldInput
                    class="min-w-16 w-20 text-center placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 srounded-md border bg-primary-foreground px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
            </NumberFieldRoot>
            <SliderRoot v-model="sliderValue"
                class="relative flex min-w-32 w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
                :min="range[0]"
                :max="range[1]"
                :step="step">
                <SliderTrack
                    class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
                    <SliderRange
                        class="bg-red-500 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
                </SliderTrack>
                <SliderThumb v-for="thumb in sliderValue.length"
                    :key="thumb"
                    class="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Volume" />
            </SliderRoot>
            <NumberFieldRoot v-model="sliderValue[1]"
                :min="sliderValue[0]">
                <NumberFieldInput
                    class="min-w-16 w-20 text-center placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 srounded-md border bg-primary-foreground px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
            </NumberFieldRoot>

        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, nextTick, onMounted, watch } from 'vue'
import { NumberFieldInput, NumberFieldRoot, SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
// import { XCircle } from 'lucide-vue-next'

const props = defineProps({
    modelValue: {
        type: Array as PropType<number[]>
    },
    range: {
        type: Array as PropType<number[]>,
        required: true
    },
    step: {
        type: Number,
        default: 1
    },
    label: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:modelValue'])

const sliderValue = computed({
    get() {
        return props.modelValue
    }, set(val) {
        emit('update:modelValue', val)
    }
})

const isTouched = computed(() => sliderValue.value && sliderValue.value[0] > props.range[0] || sliderValue.value && sliderValue.value[1] < props.range[1])

watch(() => props.range, async (val: number[]) => {
    if (!sliderValue.value || !sliderValue.value[0]) {
        sliderValue.value = [...val]
    }

    if (val[0] > sliderValue.value[0] || val[1] < sliderValue.value[1]) {
        await nextTick()
        sliderValue.value = [Math.min(val[0], val[1]), Math.max(val[0], val[1])]
    }
}, {
    deep: true
})

const setRangeDefaults = () => {
    sliderValue.value = [...props.range]
}

onMounted(() => {
    if (!sliderValue.value || !sliderValue.value[0]) {
        setRangeDefaults()
    }
})
</script>