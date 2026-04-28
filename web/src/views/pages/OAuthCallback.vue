<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { exchangeMastodonCode } from '@/api/services/auth.ts'

const route = useRoute()
const router = useRouter()

const status = ref<'processing' | 'success' | 'error'>('processing')
const errorMessage = ref('')

onMounted(async () => {
  const { code, state, error } = route.query as Record<string, string>

  // User denied access or provider returned an error
  if (error || !code || !state) {
    status.value = 'error'
    errorMessage.value = error ?? 'Missing code or state'
    await redirectToSettings('error', error ?? 'access_denied')
    return
  }

  try {
    await exchangeMastodonCode(code, state)
    status.value = 'success'
    await redirectToSettings('success')
  } catch (err: any) {
    status.value = 'error'
    const reason =
      err?.response?.data?.message ?? err?.message ?? 'token_exchange_failed'
    errorMessage.value = reason
    await redirectToSettings('error', reason)
  }
})

async function redirectToSettings(result: 'success' | 'error', reason?: string) {
  // Small delay so the status is visible for a moment
  await new Promise((r) => setTimeout(r, 800))

  const query: Record<string, string> = { tab: 'social-accounts', oauth: result }
  if (reason) query.reason = reason

  router.replace({ path: '/settings', query })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[40vh] gap-4">
    <!-- Processing -->
    <template v-if="status === 'processing'">
      <svg
        class="size-10 animate-spin text-indigo-500"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p class="text-gray-600 text-sm">Connecting your Mastodon account…</p>
    </template>

    <!-- Success -->
    <template v-else-if="status === 'success'">
      <div class="size-12 rounded-full bg-green-100 flex items-center justify-center">
        <svg class="size-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p class="text-gray-700 text-sm font-medium">Account connected! Redirecting…</p>
    </template>

    <!-- Error -->
    <template v-else>
      <div class="size-12 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="size-6 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p class="text-gray-700 text-sm font-medium">Connection failed</p>
      <p class="text-gray-500 text-xs">{{ errorMessage }}</p>
      <p class="text-gray-400 text-xs">Redirecting back to settings…</p>
    </template>
  </div>
</template>
