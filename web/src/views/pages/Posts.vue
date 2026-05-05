<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBrandStore } from '@/stores/brand.ts'
import { usePostStore } from '@/stores/post.ts'
import { useAuthStore } from '@/stores/auth'
import { updatePost } from '@/api/services/posts'
import type { IPost } from '@/types/post/PostTypes'

const brandStore = useBrandStore()
const postStore = usePostStore()
const authStore = useAuthStore()

const stateFilter = ref<string>('')
const showTrash = ref(false)

const tabs = [
  { label: 'All', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
]

const currentUserRole = computed(
  () => brandStore.currentBrand?.members?.[0]?.role ?? 'member',
)

// Client-side filtering — keeps trash separate from the main tabs
const visiblePosts = computed(() => {
  return postStore.posts.filter(p => {
    if (p.state === 'trash') return false
    if (!stateFilter.value) return true
    return p.state === stateFilter.value
  })
})

const trashPosts = computed(() =>
  postStore.posts.filter(p => p.state === 'trash'),
)

async function load() {
  if (brandStore.currentBrand) {
    // Always fetch all — tabs are client-side
    await postStore.loadPosts(brandStore.currentBrand.id)
  }
}

onMounted(load)
watch(() => brandStore.currentBrand?.id, load)

async function handleDelete(post: IPost) {
  if (post.state === 'scheduled') {
    const ok = confirm(
      'This post is currently scheduled. Moving it to trash will also cancel all pending schedule records. Continue?',
    )
    if (!ok) return
  }
  else if (post.state === 'trash' ){
    if (!confirm('Are you sure to delete this post?')) return
  }
  else {
    if (!confirm('Are you sure you want to move this post to trash?')) return
  }
  await postStore.removePost(post.id)
  await load()
}

async function handleRestore(post: IPost) {
  await updatePost(post.id, { state: 'draft' })
  await load()
}

function canEditPost(post: IPost): boolean {
  if (currentUserRole.value === 'owner' || currentUserRole.value === 'admin') return true
  return post.createdBy === authStore.user?.id
}

function stateBadgeVariant(state: string): string {
  const map: Record<string, string> = {
    draft: 'warning',
    scheduled: 'info',
    completed: 'success',
    trash: 'neutral',
  }
  return map[state] ?? 'neutral'
}
</script>

<template>
  <div>
    <PageHeader title="Posts">
      <template #actions>
        <router-link
          to="/posts/create"
          class="inline-flex items-center justify-center w-36 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          <svg class="size-4 mr-1.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </router-link>
      </template>
    </PageHeader>

    <!-- No brand -->
    <div
      v-if="!brandStore.currentBrand"
      class="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500"
    >
      <p>Select a brand to view posts.</p>
    </div>

    <template v-else>
      <!-- Tabs (client-side, never includes trash) -->
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

      <template v-else>
        <!-- Empty active posts -->
        <div
          v-if="!visiblePosts.length"
          class="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500"
        >
          <p class="text-lg font-medium text-gray-700 mb-2">No posts found</p>
          <p>Create your first post to get started.</p>
        </div>

        <!-- Posts Table -->
        <div v-else class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class=" w-80 text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Title</th>
                <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Content</th>
                <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">State</th>
                <th class="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="post in visiblePosts"
                :key="post.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-gray-900">{{ post.title }}</span>
                    <span
                      v-if="post.isAiGenerated"
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                    >AI</span>
                  </div>
                </td>
                <td class="">
                  <div class="my-2 max-h-8 truncate  fc-truncated" :title="post.content">
                    <span class="text-xs ">{{ post.content }}</span>
                  </div>
                </td>
                <td class="px-5 py-3">
                  <AppBadge :variant="stateBadgeVariant(post.state)">{{ post.state }}</AppBadge>
                </td>
                
                <td class="px-5 py-3 text-right">
                  <div v-if="canEditPost(post)" class="flex items-center justify-end gap-3">
                    <router-link
                      v-if="post.state !== 'completed'"
                      :to="`/posts/${post.id}/edit`"
                      class="text-sm text-indigo-600 hover:text-indigo-800"
                    >Edit</router-link>
                    <button
                      v-if="post.state !== 'completed'"
                      @click="handleDelete(post)"
                      class="text-sm text-red-600 hover:text-red-800"
                    >Trash</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- trash section toggle -->
        <div class="mt-6">
          <button
            @click="showTrash = !showTrash"
            class="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              :class="['size-4 transition-transform', showTrash ? 'rotate-90' : '']"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Trash
            <span class="text-xs text-gray-400 font-normal">({{ trashPosts.length }})</span>
          </button>

          <div v-if="showTrash && trashPosts.length" class="mt-3 bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100 bg-gray-50">
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-2.5">Title</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-2.5">Content</th>
                  <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="post in trashPosts"
                  :key="post.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-5 py-3 w-80">
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-500">{{ post.title }}</span>
                      <span
                        v-if="post.isAiGenerated"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                      >AI</span>
                    </div>
                  </td>
                  <td class="">
                    <div class="my-2 max-h-8 truncate fc-truncated" :title="post.content">
                      <span class="text-xs">{{ post.content }}</span>
                    </div>
                  </td>
                  <td class="px-5 py-3 text-right">
                    <div v-if="canEditPost(post)" class="flex items-center justify-end gap-3">
                      <button
                        @click="handleRestore(post)"
                        class="text-sm text-amber-600 hover:text-amber-800"
                      >Restore</button>
                      <button
                        @click="handleDelete(post)"
                        class="text-sm text-red-600 hover:text-red-800"
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else-if="showTrash && !trashPosts.length" class="mt-3 bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-400 text-sm">
            No trash record.
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.fc-truncated {
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis; 
  /* Optional: set a fixed max-width or width to the element if needed */
  max-width: 800px; /* max-width: 100%; also works */
}
</style>