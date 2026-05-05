<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({ email: 'jude.laurel@dev.com', password: 'P@ssw0rd123!' })
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const serverError = ref('')

function validate(): boolean {
  errors.value = {}
  if (!form.value.email.trim()) errors.value.email = 'Email is required'
  if (!form.value.password) errors.value.password = 'Password is required'
  return !Object.keys(errors.value).length
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    const result = await authStore.login(form.value)
    if (!result) {
      router.push({ name: 'Dashboard' })
    }
  } catch (err: any) {
    serverError.value = err?.message ?? 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto flex rounded-2xl shadow-2xl overflow-hidden min-h-[520px]">

    <!-- ── Left panel ─────────────────────────────────────────────────── -->
    <div class="hidden md:flex flex-col justify-between w-5/12 bg-indigo-600 p-10">
      <div>
        <div class="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-8">
          <svg class="size-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white leading-tight">SMCC</h1>
        <p class="text-indigo-200 mt-2 text-sm leading-relaxed">
          Social Media Content Creator — schedule, publish, and manage your content across platforms.
        </p>
      </div>
      <p class="text-indigo-300 text-xs">© {{ new Date().getFullYear() }} SMCC</p>
    </div>

    <!-- ── Right panel ────────────────────────────────────────────────── -->
    <div class="flex-1 bg-white flex flex-col justify-center px-10 py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
      <p class="text-sm text-gray-500 mb-8">Sign in to continue to your dashboard</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <FormField
          label="Email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          :error="errors.email"
        />
        <FormField
          label="Password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          :error="errors.password"
        />

        <!-- Server error -->
        <div
          v-if="serverError"
          class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          <svg class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          {{ serverError }}
        </div>

        <Button type="submit" :loading="loading" class="w-full">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </Button>
      </form>

      <p class="text-sm text-center text-gray-500 mt-6">
        Don't have an account?
        <router-link to="/register" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
          Create one
        </router-link>
      </p>
    </div>
  </div>
</template>