<template>
    <div class="space-y-2"
        v-if="localValue">
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
            <NumberFieldRoot v-model="localValue[0]"
                :max="localValue[1]">
                <NumberFieldInput
                    class="min-w-16 w-20 text-center placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 srounded-md border bg-primary-foreground px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
            </NumberFieldRoot>
            <SliderRoot v-model="localValue"
                class="relative flex min-w-32 w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
                :min="range[0]"
                :max="range[1]"
                :step="step">
                <SliderTrack
                    class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
                    <SliderRange
                        class="bg-red-500 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
                </SliderTrack>
                <SliderThumb v-for="thumb in localValue.length"
                    :key="thumb"
                    class="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                    aria-label="Volume" />
            </SliderRoot>
            <NumberFieldRoot v-model="localValue[1]"
                :min="localValue[0]">
                <NumberFieldInput
                    class="min-w-16 w-20 text-center placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 srounded-md border bg-primary-foreground px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" />
            </NumberFieldRoot>

        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, nextTick, onMounted, ref, watch } from 'vue'
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

const getInitialValue = (): number[] => {
    if (props.modelValue && Array.isArray(props.modelValue) && props.modelValue.length === 2) {
        return [...props.modelValue]
    }
    if (props.range && Array.isArray(props.range) && props.range.length === 2) {
        return [...props.range]
    }
    return props.range && Array.isArray(props.range) && props.range.length === 2 ? [...props.range] : [0, 0]
}

const localValue = ref<number[]>(getInitialValue())

watch(() => props.modelValue, (newVal) => {
    if (newVal && Array.isArray(newVal) && newVal.length === 2) {
        // Предотвращаем бесконечный цикл - обновляем только если значения изменились
        if (localValue.value[0] !== newVal[0] || localValue.value[1] !== newVal[1]) {
            localValue.value = [...newVal]
        }
    }
}, { immediate: true })

watch(localValue, (newVal, oldVal) => {
    if (Array.isArray(newVal) && newVal.length === 2) {
        // Предотвращаем бесконечный цикл - эмитим только если значения изменились
        const currentProp = props.modelValue
        if (!currentProp || currentProp[0] !== newVal[0] || currentProp[1] !== newVal[1]) {
            emit('update:modelValue', [...newVal])
        }
    }
}, { deep: true })

const isTouched = computed(() => localValue.value && localValue.value[0] > props.range[0] || localValue.value && localValue.value[1] < props.range[1])

watch(() => props.range, async (val: number[]) => {
    if (!localValue.value || localValue.value.length !== 2 || !localValue.value[0]) {
        localValue.value = [...val]
        if (!props.modelValue || props.modelValue[0] !== val[0] || props.modelValue[1] !== val[1]) {
            emit('update:modelValue', [...val])
        }
        return
    }

    // Обновляем значения, если они выходят за пределы нового диапазона
    if (val[0] > localValue.value[0] || val[1] < localValue.value[1]) {
        const newMin = Math.max(val[0], Math.min(localValue.value[0], val[1]))
        const newMax = Math.min(val[1], Math.max(localValue.value[1], val[0]))
        
        if (localValue.value[0] !== newMin || localValue.value[1] !== newMax) {
            await nextTick()
            localValue.value = [newMin, newMax]
            emit('update:modelValue', [...localValue.value])
        }
    }
}, {
    deep: true
})

const setRangeDefaults = () => {
    localValue.value = [...props.range]
    emit('update:modelValue', [...props.range])
}

onMounted(() => {
    if (!localValue.value || localValue.value.length !== 2 || !localValue.value[0]) {
        setRangeDefaults()
    }
})
</script>