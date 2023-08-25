<script lang="ts">
import { PropType, computed, defineComponent } from "vue";
import vSpinner from "./VSpinner.vue";

export type Size = "xxl" | "xl" | "l" | "m" | "s" | "xs";
export type View =
  | "accent"
  | "primary"
  | "outlined"
  | "critical"
  | "ghost"
  | "white";

export default defineComponent({
  components: {
    vSpinner,
  },
  props: {
    size: {
      type: String as PropType<Size>,
      default: "l",
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    view: {
      type: String as PropType<View>,
      default: "accent",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const classes = computed(() => {
      const classList = [];

      if (props.isLoading) classList.push("button_is_loading");
      if (props.disabled) classList.push("button_is_disabled");

      classList.push(`button_size_${props.size}`);
      classList.push(`button_view_${props.view}`);

      return classList;
    });

    return { classes };
  },
});
</script>

<template>
  <button class="button" :class="classes" :disabled="disabled">
    <div class="button__inner">
      <v-spinner v-if="isLoading" />
      <span class="button__text">{{ text }}</span>
      <slot />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.button {
  $c: &;

  border: 0;
  background: none;

  font-family: inherit;
  font-weight: 500;

  &:not(:disabled) {
    cursor: pointer;
  }

  &_is {
    &_disabled {
      cursor: not-allowed;
    }
  }

  &_size {
    &_xs {
      #{$c} {
        &__inner {
          height: 24px;
          padding: 3px 12px;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
    &_s {
      #{$c} {
        &__inner {
          height: 32px;
          padding: 5px 17px;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
    &_m {
      #{$c} {
        &__inner {
          height: 36px;
          padding: 7px 20px;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
    &_l {
      #{$c} {
        &__inner {
          height: 40px;
          padding: 9px 20px;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
    &_xl {
      #{$c} {
        &__inner {
          height: 48px;
          padding: 11px 24px;
          font-size: 16px;
          line-height: 26px;
        }
      }
    }
    &_xxl {
      #{$c} {
        &__inner {
          height: 52px;
          padding: 13px 24px;
          font-size: 16px;
          line-height: 26px;
        }
      }
    }
  }

  &_view {
    &_accent {
      #{$c} {
        &__inner {
          background: $brand-accent;
          color: $brand-primary;

          &:hover {
            background: $brand-accent-hover;
          }
        }
      }

      &:disabled {
        #{$c} {
          &__inner {
            background: $seattle-10;
            color: $london-120;
          }
        }
      }
    }

    &_primary {
      #{$c} {
        &__inner {
          background: $brand-primary;
          color: $white;

          &:hover {
            background: $brand-primary-hover;
          }
        }
      }

      &:disabled {
        #{$c} {
          &__inner {
            background: $seattle-10;
            color: $london-120;
          }
        }
      }
    }

    &_outlined {
      #{$c} {
        &__inner {
          color: $brand-primary;

          box-shadow: inset 0 0 0 2px $seattle-30;

          &:hover {
            box-shadow: inset 0 0 0 2px $brand-primary;
          }
        }
      }

      &:disabled {
        #{$c} {
          &__inner {
            box-shadow: inset 0 0 0 2px $london-120;
            color: $london-120;
          }
        }
      }
    }

    &_critical {
      #{$c} {
        &__inner {
          background: $moscow-100;
          color: $white;

          &:hover {
            background: $moscow-120;
          }
        }
      }

      &:disabled {
        #{$c} {
          &__inner {
            background: $seattle-10;
            color: $london-120;
          }
        }
      }
    }

    &_ghost {
      &#{$c} {
        &_size {
          &_xs,
          &_s,
          &_m,
          &_l,
          &_xl,
          &_xxl {
            #{$c} {
              &__inner {
                padding: 0;
                height: auto;
              }
            }
          }
        }
      }

      #{$c} {
        &__inner {
          color: $brand-primary;

          &:hover {
            color: $oslo-120;
          }
        }
      }

      &:disabled {
        #{$c} {
          &__inner {
            color: $london-120;
          }
        }
      }
    }

    &_white {
      background: $white;
      color: $brand-primary;

      &:hover {
        background: $brand-wild-sand;
      }
    }
  }

  &__inner {
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: $radius;
  }

  &__text {
    white-space: nowrap;
  }
}
</style>
