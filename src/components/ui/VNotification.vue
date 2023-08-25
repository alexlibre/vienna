<script lang="ts">
import { defineComponent, computed, PropType, ref } from "vue";

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
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const show = ref(true);

    const classes = computed(() => {
      const classList: string[] = [];
      // if (props.hasActions) {
      //   classList.push("notification_has_actions");
      // }

      // if (props.icon.length) {
      //   classList.push("notification_has_icon");
      // }

      classList.push(`notification_type_${props.type}`);
      classList.push(`notification_layout_${props.layout}`);

      return classList.join(" ");
    });

    const hasIcon = computed(() => props.icon.length > 0);

    const close = () => {
      show.value = false;
    };

    return {
      show,
      classes,
      hasIcon,
      close,
    };
  },
});
</script>

<template>
  <div class="notification" v-if="show" :class="classes">
    <div class="notification__icon" v-if="hasIcon"></div>
    <div class="notification__inner">
      <span class="notification__text">{{ text }}</span>
      <slot v-if="hasActions" />
    </div>
    <div class="notification__close" @click="close">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path
          d="M10.0001 11.1785L15.2441 16.4226L16.4226 15.2441L11.1786 10L16.4226 4.75598L15.2441 3.57747L10.0001 8.82151L4.75596 3.57739L3.57745 4.7559L8.82157 10L3.57745 15.2441L4.75596 16.4226L10.0001 11.1785Z"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  $c: &;

  padding: 16px;
  border-radius: $radius;
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  // &_has {
  //   &_actions {
  //   }

  //   &_icon {
  //   }
  // }

  &_type {
    &_plain {
      background: $brand-primary;
      color: $seattle-60;
    }

    &_error {
      background: $moscow-100;
      color: $moscow-10;
    }

    &_success {
      background: $geneva-100;
      color: $geneva-10;
    }

    &_warning {
      background: $osaka-100;
      color: $osaka-10;
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

  &__text {
    color: #fff;
  }

  &__close {
    width: 20px;
    height: 20px;
    cursor: pointer;

    & svg path {
      fill: currentColor;
    }

    &:hover {
      & svg path {
        fill: $white;
      }
    }
  }
}
</style>
