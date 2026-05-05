<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    error?: string
    required?: boolean
    type?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    autocomplete?: string
  }>(),
  { type: 'text', rows: 4 },
)

const model = defineModel<string | number>()

const inputClass = computed(() => [
  'rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition w-full py-2.5 px-3',
  props.error ? 'border-red-300 bg-red-50' : 'border-gray-300',
  props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : '',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      v-if="type === 'textarea'"
      v-model="model as string"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
    />
    <input
      v-else
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :class="inputClass"
    />
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
