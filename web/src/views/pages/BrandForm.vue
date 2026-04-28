<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBrandStore } from '@/stores/brand.ts'
import * as brandService from '@/api/services/brands.ts'
import type { IBrand } from '@/types/brand/BrandTypes'

const route = useRoute()
const router = useRouter()
const brandStore = useBrandStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const saving = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  name: '',
  description: '',
  toneOfVoice: 'professional' as
    | 'professional'
    | 'casual'
    | 'witty'
    | 'formal',
  logoUrl: '',
  primaryColor: '#6366f1',
})

onMounted(async () => {
  if (isEdit.value) {
    loading.value = true
    try {
      const { data: res } = await brandService.getBrand(
        Number(route.params.id),
      )
      const brand: IBrand = res.data
      form.value.name = brand.name
      form.value.description = brand.description ?? ''
      form.value.toneOfVoice = brand.toneOfVoice
      form.value.logoUrl = brand.logoUrl ?? ''
      form.value.primaryColor = brand.primaryColor ?? '#6366f1'
    } catch {
      router.push('/brands')
    } finally {
      loading.value = false
    }
  }
})

function validate(): boolean {
  errors.value = {}
  if (!form.value.name.trim() || form.value.name.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  }
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  saving.value = true
  try {
    const data = {
      name: form.value.name,
      description: form.value.description || undefined,
      toneOfVoice: form.value.toneOfVoice,
      logoUrl: form.value.logoUrl || undefined,
      primaryColor: form.value.primaryColor || undefined,
    }

    if (isEdit.value) {
      await brandStore.editBrand(Number(route.params.id), data)
    } else {
      await brandStore.addBrand(data)
    }
    router.push('/brands')
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
</script>

<template>
  <div class="max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? 'Edit Brand' : 'Create Brand' }}
      </h1>
    </div>

    <div v-if="loading" class="text-gray-400">Loading...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-5">
      <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <!-- Name -->
        <div class="flex flex-col">
          <label class="mb-1.5 text-sm font-medium text-gray-700">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Brand name"
            class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span v-if="errors.name" class="text-sm text-red-500 mt-1">
            {{ errors.name }}
          </span>
        </div>

        <!-- Description -->
        <div class="flex flex-col">
          <label class="mb-1.5 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Brief brand description..."
            class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <!-- Tone of Voice -->
        <div class="flex flex-col">
          <label class="mb-1.5 text-sm font-medium text-gray-700">
            Tone of Voice <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.toneOfVoice"
            class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="witty">Witty</option>
            <option value="formal">Formal</option>
          </select>
        </div>

        <!-- Logo URL -->
        <div class="flex flex-col">
          <label class="mb-1.5 text-sm font-medium text-gray-700">
            Logo URL
          </label>
          <input
            v-model="form.logoUrl"
            type="url"
            placeholder="https://example.com/logo.png"
            class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <!-- Primary Color -->
        <div class="flex flex-col">
          <label class="mb-1.5 text-sm font-medium text-gray-700">
            Primary Color
          </label>
          <div class="flex items-center gap-3">
            <input
              v-model="form.primaryColor"
              type="color"
              class="size-10 rounded border border-gray-300 cursor-pointer p-0.5"
            />
            <input
              v-model="form.primaryColor"
              type="text"
              placeholder="#6366f1"
              class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 flex-1"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="saving"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {{
            saving
              ? 'Saving...'
              : isEdit
                ? 'Update Brand'
                : 'Create Brand'
          }}
        </button>
        <router-link
          to="/brands"
          class="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>
