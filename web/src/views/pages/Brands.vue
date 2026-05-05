<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBrandStore } from '@/stores/brand.ts'
import { useAuthStore } from '@/stores/auth'
import type { IBrand } from '@/types/brand/BrandTypes'

const brandStore = useBrandStore()
const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // Always reload to get up-to-date member roles (15 per page for the full brands list)
  await brandStore.loadBrands(15)
})

async function handleDelete(id: number) {
  if (!confirm('Are you sure you want to delete this brand?')) return
  await brandStore.removeBrand(id)
}

function roleForBrand(brand: IBrand): string {
  return brand.members?.[0]?.role ?? 'member'
}

function toneVariant(tone: string): string {
  const map: Record<string, string> = {
    professional: 'info',
    casual: 'success',
    witty: 'purple',
    formal: 'neutral',
  }
  return map[tone] ?? 'neutral'
}
</script>

<template>
  <div>
    <PageHeader title="Brands">
      <template #actions>
        <router-link
          to="/brands/create"
          class="inline-flex items-center justify-center w-36 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          <svg class="size-4 mr-1.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Brand
        </router-link>
      </template>
    </PageHeader>

    <div v-if="brandStore.loading" class="text-gray-400">Loading...</div>

    <div
      v-else-if="!brandStore.brands.length"
      class="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500"
    >
      <p class="text-lg font-medium text-gray-700 mb-2">No brands yet</p>
      <p>Create your first brand to get started.</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="brand in brandStore.brands"
        :key="brand.id"
        class="bg-white rounded-lg border border-gray-200 p-5 flex flex-col"
      >
        <div class="flex items-start gap-3 mb-3">
          <div
            class="size-10 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-lg"
            :style="{
              backgroundColor: brand.primaryColor ?? '#6366f1',
            }"
          >
            {{ brand.name[0] }}
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-sm font-semibold text-gray-900 truncate">
              {{ brand.name }}
            </h3>
            <p class="text-xs text-gray-500 line-clamp-2 mt-0.5">
              {{ brand.description || 'No description' }}
            </p>
          </div>
        </div>

        <div class="mb-4">
          <AppBadge :variant="toneVariant(brand.toneOfVoice)">
            {{ brand.toneOfVoice }}
          </AppBadge>
        </div>

        <div class="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100">
          <router-link
            v-if="['owner', 'admin'].includes(roleForBrand(brand))"
            :to="`/brands/${brand.id}/edit`"
            class="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </router-link>
          <router-link
            :to="`/brands/${brand.id}/members`"
            class="text-sm text-gray-600 hover:text-gray-800"
          >
            Members
          </router-link>
          <button
            v-if="roleForBrand(brand) === 'owner'"
            @click="handleDelete(brand.id)"
            class="text-sm text-red-600 hover:text-red-800 ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
      </div>

      <!-- Load more -->
      <div class="mt-6 flex justify-center" v-if="brandStore.brandsMeta?.hasMore || brandStore.loadingMore">
        <button
          @click="brandStore.loadMoreBrands()"
          :disabled="brandStore.loadingMore"
          class="px-5 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {{ brandStore.loadingMore ? 'Loading...' : 'Load more' }}
        </button>
      </div>
    </div>
  </div>
</template>
