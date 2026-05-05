<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    maxWidth?: 'sm' | 'md' | 'lg'
  }>(),
  { maxWidth: 'md' },
)

const show = defineModel<boolean>({ default: false })

function close() {
  show.value = false
}

const widthMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="close" />

      <div
        :class="[
          'relative bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] w-full',
          widthMap[maxWidth],
        ]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <slot name="header-extra" />
          <button
            @click="close"
            class="size-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors ml-auto"
          >
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer?.()?.length" class="px-6 py-4 border-t border-gray-100 shrink-0">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
