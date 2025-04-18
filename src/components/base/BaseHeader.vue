<template>
    <div class="flex p-4 justify-end gap-8 items-center">
        <a class="hover:text-red-500 transition-colors text-xs"
            href="https://github.com/alexlibre"
            target="_blank">GitHub</a>
        <Button variant="ghost"
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
