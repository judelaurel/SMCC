<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import * as authService from '@/api/services/auth.ts'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// ─── Tab routing ─────────────────────────────────────────────────────────────
type Tab = 'profile' | 'password' | 'social-accounts'
const activeTab = ref<Tab>((route.query.tab as Tab) ?? 'profile')

function setTab(tab: Tab) {
  activeTab.value = tab
  router.replace({ query: { tab } })
}

const tabs: { id: Tab; label: string; icon: string }[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    id: 'password',
    label: 'Password',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    id: 'social-accounts',
    label: 'Social Accounts',
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  },
]

// ─── Profile tab ─────────────────────────────────────────────────────────────
const profileForm = ref({
  firstName: authStore.user?.firstName ?? '',
  lastName: authStore.user?.lastName ?? '',
})
const profileSaving = ref(false)
const profileSuccess = ref(false)
const profileErrors = ref<Record<string, string>>({})

function validateProfile() {
  profileErrors.value = {}
  if (!profileForm.value.firstName.trim())
    profileErrors.value.firstName = 'First name is required'
  if (!profileForm.value.lastName.trim())
    profileErrors.value.lastName = 'Last name is required'
  return !Object.keys(profileErrors.value).length
}

async function handleProfileSave() {
  if (!validateProfile()) return
  profileSaving.value = true
  profileSuccess.value = false
  try {
    await authService.updateProfile({
      firstName: profileForm.value.firstName.trim(),
      lastName: profileForm.value.lastName.trim(),
    })
    await authStore.loadUser()
    profileSuccess.value = true
    setTimeout(() => (profileSuccess.value = false), 3000)
  } catch (err: any) {
    const msg =
      err?.message?.errors?.[0]?.message ?? err?.message ?? 'Something went wrong'
    profileErrors.value.general = msg
  } finally {
    profileSaving.value = false
  }
}

// ─── Password tab ─────────────────────────────────────────────────────────────
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})
const passwordSaving = ref(false)
const passwordSuccess = ref(false)
const passwordErrors = ref<Record<string, string>>({})

function validatePassword() {
  passwordErrors.value = {}
  if (!passwordForm.value.currentPassword)
    passwordErrors.value.currentPassword = 'Required'
  if (passwordForm.value.newPassword.length < 8)
    passwordErrors.value.newPassword = 'Min 8 characters'
  if (!/(?=.*[A-Z])(?=.*\d)/.test(passwordForm.value.newPassword))
    passwordErrors.value.newPassword =
      'Must contain at least one uppercase letter and one number'
  if (passwordForm.value.confirmNewPassword !== passwordForm.value.newPassword)
    passwordErrors.value.confirmNewPassword = 'Passwords do not match'
  return !Object.keys(passwordErrors.value).length
}

async function handlePasswordSave() {
  if (!validatePassword()) return
  passwordSaving.value = true
  passwordSuccess.value = false
  try {
    await authService.updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmNewPassword: passwordForm.value.confirmNewPassword,
    })
    passwordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' }
    passwordSuccess.value = true
    setTimeout(() => (passwordSuccess.value = false), 3000)
  } catch (err: any) {
    const status = err?.status
    if (status === 401) {
      passwordErrors.value.currentPassword = 'Current password is incorrect'
    } else {
      passwordErrors.value.general =
        err?.message?.errors?.[0]?.message ?? err?.message ?? 'Something went wrong'
    }
  } finally {
    passwordSaving.value = false
  }
}

// ─── Social Accounts tab ─────────────────────────────────────────────────────
interface ISocialPlatform {
  id: number
  platform: string
  isActive: boolean
}
interface ISocialAccount {
  id: number
  platformId: number
  username: string
  isActive: boolean
  platform?: ISocialPlatform
}

const platforms = ref<ISocialPlatform[]>([])
const linkedAccounts = ref<ISocialAccount[]>([])
const socialLoading = ref(false)
const connectingId = ref<number | null>(null)
const disconnectingId = ref<number | null>(null)

const PLATFORM_META: Record<string, { label: string; icon: string; color: string }> = {
  mastodon: {
    label: 'Mastodon',
    icon: '🐘',
    color: 'bg-purple-50 border-purple-200',
  },
  instagram: {
    label: 'Instagram',
    icon: '📷',
    color: 'bg-pink-50 border-pink-200',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-50 border-blue-200',
  },
  twitter: {
    label: 'Twitter / X',
    icon: '🐦',
    color: 'bg-sky-50 border-sky-200',
  },
}

// Only these 3 shown in settings, in fixed order
const SETTINGS_PLATFORMS = ['mastodon', 'instagram', 'linkedin']

const platformCards = computed(() =>
  SETTINGS_PLATFORMS.map((name) => {
    const dbPlatform = platforms.value.find((p) => p.platform === name)
    const linked = linkedAccounts.value.find(
      (a) => a.platform?.platform === name || a.platformId === dbPlatform?.id,
    )
    const meta = PLATFORM_META[name] ?? { label: name, icon: '🌐', color: 'bg-gray-50 border-gray-200' }
    return {
      name,
      label: meta.label,
      icon: meta.icon,
      color: meta.color,
      dbPlatform,
      linked,
      isDisconnected: linked && !linked.isActive,
      // Only mastodon is enabled right now; others disabled
      canConnect: name === 'mastodon' && !!dbPlatform,
    }
  }),
)

async function loadSocialData() {
  socialLoading.value = true
  try {
    const [pRes, aRes] = await Promise.all([
      authService.getSocialPlatforms(),
      authService.getSocialAccounts(),
    ])
    platforms.value = pRes.data.data
    linkedAccounts.value = aRes.data.data
  } finally {
    socialLoading.value = false
  }
}

async function connectMastodon(platformId: number) {
  connectingId.value = platformId
  try {
    const { data: res } = await authService.getMastodonOAuthUrl(platformId, '')
    window.location.href = res.data.url
  } catch (err: any) {
    alert(err?.message ?? 'Failed to start OAuth flow')
    connectingId.value = null
  }
}

async function disconnectAccount(accountId: number, platformId: number) {
  if (!confirm('Disconnect this account? Existing scheduled posts will be preserved.')) return
  disconnectingId.value = accountId
  try {
    await authService.deleteSocialAccount(accountId)
    const account = linkedAccounts.value.find((a) => a.id === accountId)
    if (account) account.isActive = false
  } finally {
    disconnectingId.value = null
  }
}

// Handle OAuth callback query params
const oauthResult = ref<{ success: boolean; platform: string } | null>(null)
function checkOAuthCallback() {
  const { oauth, platform } = route.query
  if (oauth === 'success' && platform) {
    oauthResult.value = { success: true, platform: String(platform) }
    setTimeout(() => (oauthResult.value = null), 5000)
    router.replace({ query: { tab: 'social-accounts' } })
  } else if (oauth === 'error') {
    oauthResult.value = { success: false, platform: String(route.query.reason ?? '') }
    setTimeout(() => (oauthResult.value = null), 6000)
    router.replace({ query: { tab: 'social-accounts' } })
  }
}

onMounted(async () => {
  checkOAuthCallback()
  if (activeTab.value === 'social-accounts') {
    await loadSocialData()
  }
})

async function handleTabChange(tab: Tab) {
  setTab(tab)
  if (tab === 'social-accounts' && !platforms.value.length) {
    await loadSocialData()
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

    <div class="flex gap-6">
      <!-- ── Side nav ───────────────────────────────────────────────────── -->
      <nav class="w-44 shrink-0">
        <ul class="space-y-0.5">
          <li v-for="tab in tabs" :key="tab.id">
            <button
              @click="handleTabChange(tab.id)"
              :class="[
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ]"
            >
              <svg
                class="size-4 shrink-0"
                fill="none"
                stroke="currentColor"
                stroke-width="1.75"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" :d="tab.icon" />
              </svg>
              {{ tab.label }}
            </button>
          </li>
        </ul>
      </nav>

      <!-- ── Content panel ──────────────────────────────────────────────── -->
      <div class="flex-1 min-w-0">

        <!-- ═══ Profile Tab ════════════════════════════════════════════════ -->
        <div v-if="activeTab === 'profile'" class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-5">Profile Information</h2>

          <!-- Avatar placeholder -->
          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div class="size-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
              {{ authStore.user?.firstName?.[0] ?? authStore.user?.username?.[0] ?? '?' }}
            </div>
            <div>
              <p class="font-medium text-gray-900">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
              </p>
              <p class="text-sm text-gray-500">{{ authStore.user?.username }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- First name -->
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">
                First Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="profileForm.firstName"
                type="text"
                class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p v-if="profileErrors.firstName" class="text-xs text-red-500">{{ profileErrors.firstName }}</p>
            </div>

            <!-- Last name -->
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">
                Last Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="profileForm.lastName"
                type="text"
                class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p v-if="profileErrors.lastName" class="text-xs text-red-500">{{ profileErrors.lastName }}</p>
            </div>

            <!-- Read-only fields -->
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-500">Username</label>
              <input
                :value="authStore.user?.username"
                type="text"
                disabled
                class="rounded-lg border-gray-200 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-500">Email</label>
              <input
                :value="authStore.user?.email"
                type="email"
                disabled
                class="rounded-lg border-gray-200 bg-gray-50 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>

            <p v-if="profileErrors.general" class="text-sm text-red-500">{{ profileErrors.general }}</p>

            <!-- Success banner -->
            <div
              v-if="profileSuccess"
              class="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
            >
              <svg class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Profile updated successfully
            </div>

            <button
              @click="handleProfileSave"
              :disabled="profileSaving"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {{ profileSaving ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </div>

        <!-- ═══ Password Tab ═══════════════════════════════════════════════ -->
        <div v-else-if="activeTab === 'password'" class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-1">Change Password</h2>
          <p class="text-sm text-gray-500 mb-5">Must include at least 8 characters, one uppercase letter and one number.</p>

          <div class="space-y-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">Current Password</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                autocomplete="current-password"
                class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p v-if="passwordErrors.currentPassword" class="text-xs text-red-500">{{ passwordErrors.currentPassword }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">New Password</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                autocomplete="new-password"
                class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p v-if="passwordErrors.newPassword" class="text-xs text-red-500">{{ passwordErrors.newPassword }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                v-model="passwordForm.confirmNewPassword"
                type="password"
                autocomplete="new-password"
                class="rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <p v-if="passwordErrors.confirmNewPassword" class="text-xs text-red-500">{{ passwordErrors.confirmNewPassword }}</p>
            </div>

            <p v-if="passwordErrors.general" class="text-sm text-red-500">{{ passwordErrors.general }}</p>

            <div
              v-if="passwordSuccess"
              class="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
            >
              <svg class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Password changed successfully
            </div>

            <button
              @click="handlePasswordSave"
              :disabled="passwordSaving"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {{ passwordSaving ? 'Saving…' : 'Update Password' }}
            </button>
          </div>
        </div>

        <!-- ═══ Social Accounts Tab ════════════════════════════════════════ -->
        <div v-else-if="activeTab === 'social-accounts'">
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-1">Connected Accounts</h2>
            <p class="text-sm text-gray-500 mb-5">
              Link your social media accounts to allow SMCC to schedule and publish posts on your behalf.
            </p>

            <!-- OAuth result banner -->
            <div
              v-if="oauthResult?.success"
              class="flex items-center gap-2 px-3 py-2.5 mb-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
            >
              <svg class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {{ oauthResult.platform }} account connected successfully!
            </div>
            <div
              v-else-if="oauthResult && !oauthResult.success"
              class="flex items-center gap-2 px-3 py-2.5 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            >
              <svg class="size-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Connection failed: {{ oauthResult.platform || 'unknown error' }}
            </div>

            <div v-if="socialLoading" class="py-6 text-center text-gray-400 text-sm">Loading…</div>

            <div v-else class="space-y-3">
              <div
                v-for="card in platformCards"
                :key="card.name"
                :class="['rounded-xl border p-4 flex items-center gap-4', card.color]"
              >
                <!-- Icon -->
                <span class="text-3xl leading-none">{{ card.icon }}</span>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-semibold text-gray-900">{{ card.label }}</p>
                    <span
                      v-if="!card.canConnect && card.name !== 'mastodon'"
                      class="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500"
                    >
                      Available soon
                    </span>
                  </div>

                  <p v-if="card.linked && card.linked.isActive" class="text-xs text-gray-600 mt-0.5">
                    Connected as
                    <span class="font-medium">@{{ card.linked.username }}</span>
                  </p>
                  <p v-else-if="card.isDisconnected" class="text-xs text-amber-600 mt-0.5">
                    Disconnected — was
                    <span class="font-medium">@{{ card.linked!.username }}</span>
                  </p>
                  <p v-else-if="!card.canConnect" class="text-xs text-gray-400 mt-0.5">>
                    OAuth integration coming soon
                  </p>
                  <p v-else class="text-xs text-gray-500 mt-0.5">Not connected</p>
                </div>

                <!-- Action -->
                <div class="shrink-0">
                  <!-- Connected & active → Disconnect -->
                  <button
                    v-if="card.linked && card.linked.isActive"
                    @click="disconnectAccount(card.linked!.id, card.dbPlatform!.id)"
                    :disabled="disconnectingId === card.linked.id"
                    class="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 bg-white hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {{ disconnectingId === card.linked.id ? 'Disconnecting…' : 'Disconnect' }}
                  </button>

                  <!-- Disconnected → Reconnect -->
                  <button
                    v-else-if="card.isDisconnected && card.canConnect"
                    @click="connectMastodon(card.dbPlatform!.id)"
                    :disabled="connectingId === card.dbPlatform?.id"
                    class="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {{ connectingId === card.dbPlatform?.id ? 'Redirecting…' : 'Reconnect' }}
                  </button>

                  <!-- Active platform, not connected → Connect -->
                  <button
                    v-else-if="card.canConnect"
                    @click="connectMastodon(card.dbPlatform!.id)"
                    :disabled="connectingId === card.dbPlatform?.id"
                    class="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {{ connectingId === card.dbPlatform?.id ? 'Redirecting…' : 'Connect' }}
                  </button>

                  <!-- Disabled platform -->
                  <button
                    v-else
                    disabled
                    class="px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-200 bg-white rounded-lg cursor-not-allowed"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
