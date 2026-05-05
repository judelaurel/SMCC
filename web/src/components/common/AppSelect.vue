<script setup lang="ts">
defineProps<{
  label?: string
  error?: string
  required?: boolean
  placeholder?: string
  options: Array<{ value: string | number; label: string; disabled?: boolean }>
}>()

const model = defineModel<string | number | null>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      v-model="model"
      :class="[
        'rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition w-full py-2.5 px-3',
        error ? 'border-red-300 bg-red-50' : 'border-gray-300',
      ]"
    >
      <option v-if="placeholder" :value="null" disabled>{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
