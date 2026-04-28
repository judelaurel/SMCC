<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as authService from '@/api/services/auth.ts'

const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  passwordConfirmation: '',
})
const errors = ref<Record<string, string>>({})
const loading = ref(false)
const serverError = ref('')

function validate(): boolean {
  errors.value = {}
  if (!form.value.firstName.trim()) errors.value.firstName = 'First name is required'
  if (!form.value.lastName.trim()) errors.value.lastName = 'Last name is required'
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Enter a valid email address'
  }
  if (form.value.username.length < 5) errors.value.username = 'Username must be at least 5 characters'
  if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[A-Z])(?=.*\d)/.test(form.value.password)) {
    errors.value.password = 'Must contain at least one uppercase letter and one number'
  }
  if (form.value.passwordConfirmation !== form.value.password) {
    errors.value.passwordConfirmation = 'Passwords do not match'
  }
  return !Object.keys(errors.value).length
}

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  serverError.value = ''
  try {
    await authService.register(form.value)
    router.push({ name: 'LoginPage' })
  } catch (err: any) {
    const msg = err?.response?.data?.errors?.[0]?.message
      ?? err?.message
      ?? 'Something went wrong'
    serverError.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto flex rounded-2xl shadow-2xl overflow-hidden min-h-[580px]">

    <!-- ── Left panel ─────────────────────────────────────────────────── -->
    <div class="hidden md:flex flex-col justify-between w-5/12 bg-indigo-600 p-10">
      <div>
        <div class="size-10 rounded-xl bg-white/20 flex items-center justify-center mb-8">
          <svg class="size-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white leading-tight">Join SMCC</h1>
        <p class="text-indigo-200 mt-2 text-sm leading-relaxed">
          Create your account to start scheduling and publishing content across all your social platforms.
        </p>
      </div>
      <p class="text-indigo-300 text-xs">© {{ new Date().getFullYear() }} SMCC</p>
    </div>

    <!-- ── Right panel ────────────────────────────────────────────────── -->
    <div class="flex-1 bg-white flex flex-col justify-center px-10 py-10">
      <h2 class="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
      <p class="text-sm text-gray-500 mb-6">Fill in the details below to get started</p>

      <form @submit.prevent="handleSubmit" class="space-y-3">
        <!-- Name row -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">First Name</label>
            <input
              v-model="form.firstName"
              type="text"
              autocomplete="given-name"
              placeholder="John"
              :class="[
                'rounded-lg border text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition',
                errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300',
              ]"
            />
            <p v-if="errors.firstName" class="text-xs text-red-500">{{ errors.firstName }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Last Name</label>
            <input
              v-model="form.lastName"
              type="text"
              autocomplete="family-name"
              placeholder="Doe"
              :class="[
                'rounded-lg border text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition',
                errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300',
              ]"
            />
            <p v-if="errors.lastName" class="text-xs text-red-500">{{ errors.lastName }}</p>
          </div>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            :class="[
              'rounded-lg border text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition',
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Username -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Username</label>
          <input
            v-model="form.username"
            type="text"
            autocomplete="username"
            placeholder="johndoe"
            :class="[
              'rounded-lg border text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition',
              errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300',
            ]"
          />
          <p v-if="errors.username" class="text-xs text-red-500">{{ errors.username }}</p>
        </div>

        <!-- Password row -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              placeholder="••••••••"
              :class="[
                'rounded-lg border text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition',
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300',
              ]"
            />
            <p v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              v-model="form.passwordConfirmation"
              type="password"
              autocomplete="new-password"
              placeholder="••••••••"
              :class="[
                'rounded-lg border text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition',
                errors.passwordConfirmation ? 'border-red-300 bg-red-50' : 'border-gray-300',
              ]"
            />
            <p v-if="errors.passwordConfirmation" class="text-xs text-red-500">{{ errors.passwordConfirmation }}</p>
          </div>
        </div>

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

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ loading ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

      <p class="text-sm text-center text-gray-500 mt-5">
        Already have an account?
        <router-link to="/login" class="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>

<style scoped></style>