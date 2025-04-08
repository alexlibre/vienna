<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { RouterView } from 'vue-router'

import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const layout = computed(() => {
  const layout = route?.meta?.layout
  return layout ? `${layout}Layout` : 'DefaultLayout'
})

onMounted(async () => { })
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>
  <Toaster />
</template>
