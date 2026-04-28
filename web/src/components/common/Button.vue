<script setup>
  const props = defineProps({
    leftIcon: Function,
    loading: Boolean,
  });
</script>
<template>
  <button
    :disabled="loading"
    class="inline-flex relative transition px-4 py-2 h-[40px] rounded-sm justify-center items-center font-semibold hover:opacity-90 active:scale-98"
  >
    <svg
      v-if="props.loading"
      class="size-5 animate-spin absolute"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <component
      :is="props?.leftIcon"
      :class="['h-5.5 w-5.5 mr-1', props.loading && 'invisible']"
    />
    <span :class="[props.loading && 'invisible']">
      <slot />
    </span>
  </button>
</template>