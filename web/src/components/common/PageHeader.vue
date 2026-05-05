<script setup lang="ts">
defineProps<{
  title: string
  backTo?: string
}>()
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-3">
      <router-link
        v-if="backTo"
        :to="backTo"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
    </div>
    <div v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>
