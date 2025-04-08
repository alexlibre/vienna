<template>
  <div>
    <Tabs :default-value="componentToRender"
      v-model:model-value="componentToRender"
      class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="spinreels"
          class="cursor-pointer">
          БК
        </TabsTrigger>
        <TabsTrigger value="feeders"
          class="cursor-pointer">
          ДУ
        </TabsTrigger>
        <TabsTrigger value="spinnings"
          class="cursor-pointer">
          СУ
        </TabsTrigger>
      </TabsList>

      <Transition mode="in-out">
        <KeepAlive>
          <Component :is="currentComponent" />
        </KeepAlive>
      </Transition>
    </Tabs>

    <!-- <SelectedResources /> -->
  </div>
</template>

<script setup lang="ts">
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"

import LoadingComponent from "@/components/base/LoadingComponent.vue"
import SelectedResources from "@/components/datatable/SelectedResources.vue";

import { computed, defineAsyncComponent, ref } from "vue";

const asyncComponents = {
  spinreels: defineAsyncComponent({
    loader: () => import('@/components/datatable/DataTableRF4Reels.vue'),
    loadingComponent: LoadingComponent,
  }),
  feeders: defineAsyncComponent({
    loader: () => import('@/components//datatable/DataTableRF4Feeders.vue'),
    loadingComponent: LoadingComponent,
  }),
  spinnings: defineAsyncComponent({
    loader: () => import('@/components//datatable/DataTableRF4Spinnings.vue'),
    loadingComponent: LoadingComponent,
  })
}


const componentToRender = ref<keyof typeof asyncComponents>('spinreels')


const currentComponent = computed(() => {
  return asyncComponents[componentToRender.value]
})
</script>
