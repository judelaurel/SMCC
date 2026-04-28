<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBrandStore } from '@/stores/brand.ts'
import { usePostStore } from '@/stores/post.ts'
import * as postService from '@/api/services/posts.ts'
import type { IPost } from '@/types/post/PostTypes'
import type { IPostVariation } from '@/api/services/posts.ts'

const route = useRoute()
const router = useRouter()
const brandStore = useBrandStore()
const postStore = usePostStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  title: '',
  content: '',
  state: 'draft' as 'draft' | 'scheduled' | 'completed' | 'archived',
})

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const { data: res } = await postService.getPost(Number(route.params.id))
      const post: IPost = res.data
      form.value.title = post.title
      form.value.content = post.content
      form.value.state = post.state
    } catch {
      router.push('/posts')
    } finally {
      loading.value = false
    }
  }
})

function validate(): boolean {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Title is required'
  if (!form.value.content.trim()) errors.value.content = 'Content is required'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return
  saving.value = true
  try {
    if (isEdit.value) {
      await postStore.editPost(Number(route.params.id), {
        title: form.value.title,
        content: form.value.content,
        state: form.value.state,
      })
    } else {
      await postStore.addPost({
        brandId: brandStore.currentBrand!.id,
        title: form.value.title,
        content: form.value.content,
        state: form.value.state,
        isAiGenerated: aiUsed.value,
      })
    }
    router.push('/posts')
  } catch (err: any) {
    if (err.status === 422) {
      alert('Validation error: ' + (err.message || 'Check your input.'))
    } else {
      alert('Error: ' + (err.message || 'Something went wrong.'))
    }
  } finally {
    saving.value = false
  }
}

// ─── AI panel ───────────────────────────────────────────────────────────────
const aiPanelOpen = ref(false)
const aiGenerating = ref(false)
const aiError = ref('')
const aiUsed = ref(false)
const variations = ref<IPostVariation[]>([])

const aiForm = ref({
  topic: '',
  platform: 'instagram' as 'instagram' | 'twitter' | 'linkedin' | 'mastodon',
  toneOfVoice: 'casual' as 'professional' | 'casual' | 'witty' | 'formal',
  keywordsRaw: '',
})

const PLATFORM_LIMITS: Record<string, number> = {
  instagram: 2200,
  twitter: 280,
  linkedin: 1300,
  mastodon: 500,
}

async function handleGenerate() {
  if (!aiForm.value.topic.trim()) {
    aiError.value = 'Topic is required'
    return
  }
  const keywords = aiForm.value.keywordsRaw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
  if (!keywords.length) {
    aiError.value = 'Enter at least one keyword'
    return
  }

  aiError.value = ''
  aiGenerating.value = true
  variations.value = []

  try {
    const { data: res } = await postService.generateAiPost({
      brandId: brandStore.currentBrand?.id,
      topic: aiForm.value.topic.trim(),
      platform: aiForm.value.platform,
      toneOfVoice: aiForm.value.toneOfVoice,
      keywords,
    })
    variations.value = res.data.variations
  } catch (err: any) {
    aiError.value =
      err?.response?.data?.message ?? err?.message ?? 'Generation failed. Try again.'
  } finally {
    aiGenerating.value = false
  }
}

function useVariation(v: IPostVariation) {
  form.value.content = v.content
  aiUsed.value = true
  aiPanelOpen.value = false
}

function charClass(count: number, limit: number) {
  const pct = count / limit
  if (pct > 1) return 'text-red-500 font-medium'
  if (pct > 0.85) return 'text-amber-500'
  return 'text-gray-400'
}
</script>

<template>
  <div class="max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? 'Edit Post' : 'Create Post' }}
      </h1>
    </div>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-5">
      <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-4">

        <!-- Title -->
        <div class="flex flex-col">
          <label class="mb-1.5 text-sm font-medium text-gray-700">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Post title"
            class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span v-if="errors.title" class="text-sm text-red-500 mt-1">{{ errors.title }}</span>
        </div>

        <!-- Content + AI button -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-sm font-medium text-gray-700">
              Content <span class="text-red-500">*</span>
            </label>
            <button
              type="button"
              @click="aiPanelOpen = !aiPanelOpen"
              :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                aiPanelOpen
                  ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                  : 'bg-violet-50 text-violet-600 hover:bg-violet-100',
              ]"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              {{ aiPanelOpen ? 'Hide AI' : 'Generate with AI' }}
            </button>
          </div>

          <textarea
            v-model="form.content"
            rows="8"
            placeholder="Write your post content..."
            class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span v-if="errors.content" class="text-sm text-red-500 mt-1">{{ errors.content }}</span>
        </div>

        <!-- ── AI Panel ─────────────────────────────────────────────────── -->
        <div v-if="aiPanelOpen" class="rounded-xl border border-violet-200 bg-violet-50 p-4 space-y-4">
          <p class="text-xs font-semibold text-violet-700 uppercase tracking-wide">AI Post Generator</p>

          <!-- Topic -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-700">Topic / Idea <span class="text-red-500">*</span></label>
            <input
              v-model="aiForm.topic"
              type="text"
              placeholder="e.g. Our spring product launch is here"
              class="rounded-lg border-gray-300 text-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <!-- Platform + Tone row -->
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-700">Platform</label>
              <select
                v-model="aiForm.platform"
                class="rounded-lg border-gray-300 text-sm focus:border-violet-500 focus:ring-violet-500"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter / X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="mastodon">Mastodon</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-medium text-gray-700">Tone of Voice</label>
              <select
                v-model="aiForm.toneOfVoice"
                class="rounded-lg border-gray-300 text-sm focus:border-violet-500 focus:ring-violet-500"
              >
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="witty">Witty</option>
                <option value="formal">Formal</option>
              </select>
            </div>
          </div>

          <!-- Keywords -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium text-gray-700">
              Keywords <span class="text-gray-400">(comma-separated)</span>
            </label>
            <input
              v-model="aiForm.keywordsRaw"
              type="text"
              placeholder="e.g. spring, sale, new collection"
              class="rounded-lg border-gray-300 text-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <p v-if="aiError" class="text-xs text-red-500">{{ aiError }}</p>

          <!-- Generate button -->
          <button
            type="button"
            @click="handleGenerate"
            :disabled="aiGenerating"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg
              v-if="aiGenerating"
              class="size-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <svg v-else class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            {{ aiGenerating ? 'Generating…' : 'Generate 3 Variations' }}
          </button>

          <!-- Variations -->
          <div v-if="variations.length" class="space-y-3">
            <p class="text-xs font-medium text-gray-500">Click a variation to use it:</p>
            <div
              v-for="v in variations"
              :key="v.id"
              class="bg-white rounded-lg border border-violet-100 p-3 space-y-2 hover:border-violet-400 transition-colors group"
            >
              <p class="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{{ v.content }}</p>
              <div class="flex items-center justify-between">
                <span :class="['text-xs', charClass(v.characterCount, PLATFORM_LIMITS[aiForm.platform])]">
                  {{ v.characterCount }} / {{ PLATFORM_LIMITS[aiForm.platform] }} chars
                </span>
                <button
                  type="button"
                  @click="useVariation(v)"
                  class="text-xs px-2.5 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded-md transition-colors"
                >
                  Use this
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- State -->
        <div class="flex flex-col">
          <label class="mb-1.5 text-sm font-medium text-gray-700">State</label>
          <select
            v-model="form.state"
            class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {{ saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post' }}
        </button>
        <router-link
          to="/posts"
          class="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>
