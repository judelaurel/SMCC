<script setup lang="ts">
const variantMap: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-gray-100 text-gray-800',
  purple: 'bg-purple-100 text-purple-800',
  amber: 'bg-amber-100 text-amber-800',
}

const props = withDefaults(
  defineProps<{
    variant?: keyof typeof variantMap
  }>(),
  { variant: 'neutral' },
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
      variantMap[variant],
    ]"
  >
    <slot />
  </span>
</template>
