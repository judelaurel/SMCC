<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import { useBrandStore } from '@/stores/brand.ts'
import Sidebar from '@/components/common/Sidebar.vue'
import BrandSelector from '@/components/common/BrandSelector.vue'

const authStore = useAuthStore()
const brandStore = useBrandStore()
const router = useRouter()
const userMenuOpen = ref(false)

onMounted(async () => {
  await brandStore.loadBrands()
})

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'LoginPage' })
}
</script>

<template>
  <div class="bg-gray-50 flex flex-col h-screen">
    <!-- App Bar -->
    <header
      class="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0"
    >
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold text-indigo-600">SMCC</h1>
        <BrandSelector />
      </div>

      <div class="relative">
        <button
          @click="userMenuOpen = !userMenuOpen"
          class="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <div
            class="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm"
          >
            {{ authStore.user?.firstName?.[0] ?? authStore.user?.username?.[0] ?? '?' }}
          </div>
          <span class="hidden sm:inline">{{ authStore.user?.username }}</span>
        </button>

        <div
          v-if="userMenuOpen"
          class="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
        >
          <div class="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
            {{ authStore.user?.email }}
          </div>
          <RouterLink
            to="/settings"
            @click="userMenuOpen = false"
            class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Settings
          </RouterLink>
          <div class="border-t border-gray-100" />
          <button
            @click="handleLogout"
            class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Log out
          </button>
        </div>
        <div
          v-if="userMenuOpen"
          class="fixed inset-0 z-40"
          @click="userMenuOpen = false"
        />
      </div>
    </header>

    <!-- Body -->
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>