<script lang="ts">
import { defineComponent, PropType } from "vue";

type Size = "s" | "m" | "l";

export default defineComponent({
  props: {
    size: {
      type: String as PropType<Size>,
      default: "m",
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <header class="header" :class="`header_size_${size}`">
    <div class="header__inner">
      <slot />
    </div>
  </header>
</template>

<styles lang="scss" scoped>
.header {
  $c: &;

  @include shadow-l;
  background: $white;
  padding: 24px 32px;

  &_size {
    &_s {
      padding: 8px 16px;
      height: 48px;

      #{$c} {
        &__inner {
          gap: 24px;
        }
      }
    }
    &_m {
      height: 80px;

      #{$c} {
        &__inner {
          gap: 24px;
        }
      }
    }
    &_l {
      height: 88px;

      #{$c} {
        &__inner {
          gap: 24px;
        }
      }
    }
  }

  &__inner {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</styles>
