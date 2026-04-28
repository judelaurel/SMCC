<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBrandStore } from '@/stores/brand.ts'

const brandStore = useBrandStore()
const open = ref(false)

function toggle() {
  open.value = !open.value
}

function select(id: number) {
  brandStore.selectBrand(id)
  open.value = false
}
</script>

<template>
  <div class="relative">
    <button
      @click="toggle"
      class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <span
        v-if="brandStore.currentBrand?.primaryColor"
        class="size-3 rounded-full shrink-0"
        :style="{ backgroundColor: brandStore.currentBrand.primaryColor }"
      />
      <span class="truncate max-w-[160px]">
        {{ brandStore.currentBrand?.name ?? 'Select Brand' }}
      </span>
      <svg
        class="size-4 shrink-0 text-gray-400"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
    >
      <button
        v-for="brand in brandStore.brands"
        :key="brand.id"
        @click="select(brand.id)"
        :class="[
          'flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors',
          brand.id === brandStore.currentBrand?.id
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-700 hover:bg-gray-50',
        ]"
      >
        <span
          v-if="brand.primaryColor"
          class="size-3 rounded-full shrink-0"
          :style="{ backgroundColor: brand.primaryColor }"
        />
        <span class="truncate">{{ brand.name }}</span>
      </button>

      <div
        v-if="!brandStore.brands.length"
        class="px-3 py-2 text-sm text-gray-400"
      >
        No brands yet
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="open"
      class="fixed inset-0 z-40"
      @click="open = false"
    />
  </div>
</template>
