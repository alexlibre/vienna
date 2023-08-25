<script lang="ts">
import vHeader from "@/components/global/VHeader.vue";

import { ref, onMounted, computed } from "vue";

export default {
  components: {
    vHeader,
  },
  setup() {
    const data = ref({
      isMobile: false,
    });

    const mobile = computed(() => screen.width <= 760);

    onMounted(() => {
      data.value.isMobile = screen.width <= 760;
    });

    return {
      data,
      mobile,
    };
  },
};
</script>

<template>
  <v-header>
    <nav class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/components">Components</router-link>
    </nav>
  </v-header>
  <main class="main">
    <router-view />
  </main>
</template>

<style lang="scss">
.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main {
  padding: 24px;
}
</style>
