<script lang="ts">
import vButton, { Size, View } from "@/components/ui/VButton.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    vButton,
  },
  setup() {
    const data = ref({
      sizes: ["xs", "s", "m", "l", "xl", "xxl"] as Size[],
      views: ["accent", "primary", "outlined", "critical", "ghost"] as View[],
    });
    return {
      data,
    };
  },
});
</script>

<template>
  <h2>Buttons</h2>

  <div v-for="size in data.sizes" :key="size">
    <h3>{{ size }}</h3>
    <div class="grid gap-1">
      <div v-for="view in data.views" :key="view">
        <v-button
          :view="(view as View)"
          :text="`Button ${view}`"
          :size="(size as Size)"
        ></v-button>
      </div>
    </div>
  </div>

  <h3>Disabled</h3>
  <div v-for="size in data.sizes" :key="size">
    <div class="grid gap-1">
      <div v-for="view in data.views" :key="view">
        <v-button
          :view="(view as View)"
          :text="`Button ${view}`"
          :size="(size as Size)"
          disabled
        ></v-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
}
.gap {
  &-1 {
    gap: 1rem;
  }
}
h3 {
  margin-bottom: 1rem;
}
</style>
