<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBrandStore } from '@/stores/brand.ts'
import { usePostStore } from '@/stores/post.ts'
import { useAuthStore } from '@/stores/auth'
import type { IPost } from '@/types/post/PostTypes'

const brandStore = useBrandStore()
const postStore = usePostStore()
const authStore = useAuthStore()
const router = useRouter()

const stateFilter = ref<string>('')
const tabs = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
]

const currentUserRole = computed(
  () => brandStore.currentBrand?.members?.[0]?.role ?? 'member',
)

async function load() {
  if (brandStore.currentBrand) {
    await postStore.loadPosts(
      brandStore.currentBrand.id,
      stateFilter.value || undefined,
    )
  }
}

onMounted(load)
watch(() => brandStore.currentBrand?.id, load)
watch(stateFilter, load)

async function handleDelete(id: number) {
  if (!confirm('Are you sure you want to delete this post?')) return
  await postStore.removePost(id)
}

function canEditPost(post: IPost): boolean {
  if (currentUserRole.value === 'owner' || currentUserRole.value === 'admin') return true
  return post.createdBy === authStore.user?.id
}

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
      <h1 class="text-2xl font-bold text-gray-900">Posts</h1>
      <router-link
        to="/posts/create"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <svg
          class="size-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Post
      </router-link>
    </div>

    <!-- No brand -->
    <div
      v-if="!brandStore.currentBrand"
      class="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500"
    >
      <p>Select a brand to view posts.</p>
    </div>

    <template v-else>
      <!-- Tabs -->
      <div class="flex gap-1 mb-4 bg-white rounded-lg border border-gray-200 p-1 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="stateFilter = tab.value"
          :class="[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            stateFilter === tab.value
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading -->
      <div
        v-if="postStore.loading"
        class="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400"
      >
        Loading...
      </div>

      <!-- Empty -->
      <div
        v-else-if="!postStore.posts.length"
        class="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500"
      >
        <p class="text-lg font-medium text-gray-700 mb-2">No posts found</p>
        <p>Create your first post to get started.</p>
      </div>

      <!-- Posts Table -->
      <div
        v-else
        class="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th
                class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3"
              >
                Title
              </th>
              <th
                class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3"
              >
                State
              </th>
              <th
                class="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="post in postStore.posts"
              :key="post.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-900">
                    {{ post.title }}
                  </span>
                  <span
                    v-if="post.isAiGenerated"
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    AI
                  </span>
                </div>
              </td>
              <td class="px-5 py-3">
                <span
                  :class="[
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
                    stateClass(post.state),
                  ]"
                >
                  {{ post.state }}
                </span>
              </td>
              <td class="px-5 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link
                    v-if="canEditPost(post)"
                    :to="`/posts/${post.id}/edit`"
                    class="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </router-link>
                  <button
                    v-if="canEditPost(post)"
                    @click="handleDelete(post.id)"
                    class="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
