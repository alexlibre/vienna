<script lang="ts">
import { PropType, defineComponent } from "vue";

type Size = number[];

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: "spinner",
    },
    size: {
      type: Array as PropType<Size>,
      default: () => [24],
    },
  },
});
</script>

<template>
  <div class="spinner">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      preserveAspectRatio="xMidYMid"
      :width="size[0]"
      :height="size[1] ? size[1] : size[0]"
    >
      <path
        d="M 21.4602 3.24138 C 21.9213 2.16389 21.4235 0.901656 20.2945 0.587073 C 17.2899 -0.25013 14.0893 -0.194787 11.0913 0.771568 C 7.41649 1.9561 4.29392 4.42955 2.29961 7.73566 C 0.305293 11.0418 -0.42623 14.9576 0.239968 18.7607 C 0.906167 22.5638 2.92515 25.9978 5.9245 28.4292 C 8.92385 30.8605 12.7012 32.1253 16.5599 31.9902 C 20.4186 31.8551 24.0983 30.3292 26.9202 27.694 C 29.7422 25.0587 31.516 21.492 31.9145 17.6515 C 32.2397 14.5185 31.6316 11.3757 30.1908 8.60934 C 29.6494 7.56986 28.3115 7.34403 27.3528 8.01811 C 26.394 8.69219 26.1835 10.0109 26.6745 11.0751 C 27.5537 12.9809 27.9123 15.1002 27.693 17.2134 C 27.4002 20.0351 26.0969 22.6558 24.0235 24.592 C 21.9501 26.5282 19.2465 27.6493 16.4114 27.7486 C 13.5763 27.8479 10.8009 26.9186 8.59716 25.1322 C 6.39342 23.3457 4.91001 20.8227 4.42053 18.0284 C 3.93105 15.2341 4.46852 12.357 5.93382 9.92789 C 7.39911 7.49876 9.69338 5.68143 12.3934 4.81111 C 14.4156 4.1593 16.5632 4.0716 18.6097 4.53751 C 19.7524 4.79767 20.9991 4.31886 21.4602 3.24138 Z"
      >
        <animateTransform
          attributeName="transform"
          attributeType="auto"
          type="rotate"
          values="0 16 16;360 16 16"
          dur="2s"
          begin="0s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.spinner {
  & svg path {
    fill: currentColor;
  }
}
</style>
