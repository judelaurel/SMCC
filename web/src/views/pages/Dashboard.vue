<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useBrandStore } from '@/stores/brand.ts'
import { usePostStore } from '@/stores/post.ts'
import { useRouter } from 'vue-router'

const brandStore = useBrandStore()
const postStore = usePostStore()
const router = useRouter()

const stats = computed(() => {
  const all = postStore.posts
  return {
    total: all.length,
    drafts: all.filter((p) => p.state === 'draft').length,
    scheduled: all.filter((p) => p.state === 'scheduled').length,
    completed: all.filter((p) => p.state === 'completed').length,
  }
})

const recentPosts = computed(() =>
  [...postStore.posts].slice(0, 5),
)

async function loadData() {
  if (brandStore.currentBrand) {
    await postStore.loadPosts(brandStore.currentBrand.id)
  }
}

onMounted(loadData)

watch(() => brandStore.currentBrand?.id, loadData)

const statCards = computed(() => [
  {
    label: 'Total Posts',
    value: stats.value.total,
    color: 'bg-indigo-50 text-indigo-700',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h10',
  },
  {
    label: 'Drafts',
    value: stats.value.drafts,
    color: 'bg-yellow-50 text-yellow-700',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  },
  {
    label: 'Scheduled',
    value: stats.value.scheduled,
    color: 'bg-blue-50 text-blue-700',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    label: 'Completed',
    value: stats.value.completed,
    color: 'bg-green-50 text-green-700',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
])

function stateClass(state: string) {
  const map: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  }
  return map[state] ?? 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    </div>

    <!-- No brand selected -->
    <div
      v-if="!brandStore.currentBrand"
      class="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500"
    >
      <p class="text-lg font-medium text-gray-700 mb-2">No brand selected</p>
      <p class="mb-4">Create or select a brand to see your dashboard.</p>
      <router-link
        to="/brands/create"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
      >
        Create Brand
      </router-link>
    </div>

    <template v-else>
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="bg-white rounded-lg border border-gray-200 p-5"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[card.color, 'rounded-lg p-2.5']"
            >
              <svg
                class="size-5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="card.icon"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ card.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ card.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="bg-white rounded-lg border border-gray-200">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Recent Posts</h2>
          <router-link
            to="/posts"
            class="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View all
          </router-link>
        </div>

        <div v-if="postStore.loading" class="p-8 text-center text-gray-400">
          Loading...
        </div>

        <div
          v-else-if="!recentPosts.length"
          class="p-8 text-center text-gray-400"
        >
          No posts yet. Create your first post!
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="post in recentPosts"
            :key="post.id"
            class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ post.title }}
              </p>
            </div>
            <div class="flex items-center gap-2 ml-4 shrink-0">
              <span
                v-if="post.isAiGenerated"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
              >
                AI
              </span>
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
                  stateClass(post.state),
                ]"
              >
                {{ post.state }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>