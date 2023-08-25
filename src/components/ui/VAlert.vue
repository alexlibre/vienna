<script lang="ts">
import { defineComponent, computed, PropType } from "vue";

type Type = "plain" | "accent" | "success" | "error" | "warning";
type Layout = "simple" | "multiline";

export default defineComponent({
  props: {
    hasActions: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String as PropType<Type>,
      default: "plain",
    },
    icon: {
      type: String,
      default: "",
    },
    layout: {
      type: String as PropType<Layout>,
      default: "simple",
    },
  },
  setup(props) {
    const classes = computed(() => {
      const classList: string[] = [];
      // if (props.hasActions) {
      //   classList.push("alert_has_actions");
      // }

      // if (props.icon.length) {
      //   classList.push("alert_has_icon");
      // }

      classList.push(`alert_type_${props.type}`);
      classList.push(`alert_layout_${props.layout}`);

      return classList.join(" ");
    });

    const hasIcon = computed(() => props.icon.length > 0);

    return {
      classes,
      hasIcon,
    };
  },
});
</script>

<template>
  <div class="alert" :class="classes">
    <div class="alert__icon" v-if="hasIcon"></div>
    <div class="alert__inner">
      <slot v-if="hasActions" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.alert {
  $c: &;

  padding: 16px;
  border-radius: $radius;
  display: flex;
  gap: 1rem;

  // &_has {
  //   &_actions {
  //   }

  //   &_icon {
  //   }
  // }

  &_type {
    &_plain {
      background: $brand-wild-sand;
      color: $brand-primary;
    }

    &_error {
      background: $moscow-10;
      color: $moscow-100;
    }

    &_success {
      background: $geneva-10;
      color: $geneva-100;
    }

    &_warning {
      background: $osaka-10;
      color: $osaka-100;
    }
  }

  &_layout {
    &_simple {
      #{$c} {
        &__inner {
          flex-direction: row;
        }
      }
    }

    &_multiline {
      #{$c} {
        &__inner {
          flex-direction: column;
        }
      }
    }
  }

  &__inner {
    display: flex;
  }
}
</style>
