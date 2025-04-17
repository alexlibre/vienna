<template>
    <div class="flex p-4">
        <Button class="ml-auto"
            variant="ghost"
            @click="toggleMode">
            <Moon class="size-5"
                v-if="mode === 'light'" />
            <Sun class="size-5"
                v-else />
        </Button>
    </div>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Moon, Sun } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'

const mode = useColorMode()
const toggleMode = () => {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
}
</script>
