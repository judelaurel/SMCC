<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarOptions, EventClickArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import { useScheduleStore } from '@/stores/schedule.ts'
import { usePostStore } from '@/stores/post.ts'
import { useBrandStore } from '@/stores/brand.ts'
import { useAuthStore } from '@/stores/auth.ts'
import * as brandService from '@/api/services/brands.ts'
import type { IScheduledPost } from '@/types/schedule/ScheduleTypes'
import type { IPost } from '@/types/post/PostTypes'

// ─── Stores ──────────────────────────────────────────────────────────────────────────────
const scheduleStore = useScheduleStore()
const postStore = usePostStore()
const brandStore = useBrandStore()
const authStore = useAuthStore()

// ─── Brand role ─────────────────────────────────────────────────────────────────────────
const currentUserRole = ref<'owner' | 'admin' | 'member' | null>(null)

// ─── State ───────────────────────────────────────────────────────────────────
const selectedDate = ref<string | null>(null)

// Day-click modal
const showDayModal = ref(false)

// New-schedule modal
const showScheduleModal = ref(false)
const scheduleForm = ref({
  postId: null as number | null,
  selectedAccountIds: [] as number[],
  postType: 'text' as 'text' | 'link' | 'image',
  time: '',
})
const scheduleErrors = ref<Record<string, string>>({})
const scheduleSaving = ref(false)

// Day modal cancelled toggle
const showDayCancelled = ref(false)

// Upcoming panel: track view range & status filter
const calendarViewStart = ref('')
const calendarViewEnd = ref('')
const upcomingStatusFilter = ref<'all' | 'pending' | 'posted' | 'cancelled'>('pending')

// ─── Derived ─────────────────────────────────────────────────────────────────

/** Events fed to FullCalendar — cancelled posts are hidden from the grid */
const calendarEvents = computed(() => {
  return scheduleStore.scheduledPosts
    .filter(sp => sp.publishStatus !== 'cancelled')
    .map((sp) => {
      const isPosted = sp.publishStatus === 'posted'
      return {
        id: String(sp.id),
        title: sp.post?.title ?? `Post #${sp.postId}`,
        start: sp.scheduledAt,
        backgroundColor: isPosted ? '#16a34a' : '#6366f1',
        borderColor: isPosted ? '#15803d' : '#4f46e5',
        textColor: '#fff',
        extendedProps: { scheduledPost: sp },
      }
    })
})

/** Scheduled posts for the selected date — respects the cancelled toggle */
const dayScheduledPosts = computed<IScheduledPost[]>(() => {
  if (!selectedDate.value) return []
  return scheduleStore.scheduledPosts.filter((sp) => {
    if (!sp.scheduledAt.startsWith(selectedDate.value!)) return false
    if (!showDayCancelled.value && sp.publishStatus === 'cancelled') return false
    return true
  })
})

/** Upcoming posts filtered to the visible calendar month & status filter */
const upcomingPosts = computed(() => {
  return scheduleStore.scheduledPosts
    .filter(sp => {
      const inView = !calendarViewStart.value || (
        sp.scheduledAt >= calendarViewStart.value && sp.scheduledAt < calendarViewEnd.value
      )
      if (!inView) return false
      if (upcomingStatusFilter.value === 'all') return true
      if (upcomingStatusFilter.value === 'pending') return ['pending', 'processing'].includes(sp.publishStatus)
      return sp.publishStatus === upcomingStatusFilter.value
    })
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
})

/** Draft posts for the right-hand panel */
const draftPosts = computed<IPost[]>(() =>
  postStore.posts.filter((p) => p.state === 'draft'),
)

// ─── Min time for the schedule picker (no past) ───────────────────────────
const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + 5) // at least 5 min from now
  return now.toISOString().slice(0, 16)
})

/** Min time respecting selected date — if future date, midnight is fine */
const minTimeForDate = computed(() => {
  if (!selectedDate.value) return minDateTime.value
  const today = new Date().toISOString().slice(0, 10)
  if (selectedDate.value > today) {
    return `${selectedDate.value}T00:00`
  }
  return minDateTime.value
})

// ─── FullCalendar options ─────────────────────────────────────────────────
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: '',
  },
  events: calendarEvents.value,
  dateClick: onDateClick,
  eventClick: onEventClick,
  datesSet: onDatesSet,
  height: 'auto',
  dayCellClassNames: 'cursor-pointer hover:bg-indigo-50/50 transition-colors',
}))

// ─── Handlers ────────────────────────────────────────────────────────────
function onDateClick(arg: DateClickArg) {
  selectedDate.value = arg.dateStr
  showDayCancelled.value = false
  showDayModal.value = true
}

function onEventClick(arg: EventClickArg) {
  const sp: IScheduledPost = arg.event.extendedProps.scheduledPost
  selectedDate.value = sp.scheduledAt.slice(0, 10)
  showDayCancelled.value = false
  showDayModal.value = true
}

function onDatesSet(info: { startStr: string; endStr: string }) {
  calendarViewStart.value = info.startStr
  calendarViewEnd.value = info.endStr
}

function openNewSchedule() {
  scheduleForm.value = {
    postId: null,
    selectedAccountIds: [],
    postType: 'text',
    time: selectedDate.value
      ? `${selectedDate.value}T12:00`
      : minDateTime.value,
  }
  scheduleErrors.value = {}
  showScheduleModal.value = true
}

function closeDayModal() {
  showDayModal.value = false
}

function closeScheduleModal() {
  showScheduleModal.value = false
}

function toggleAccount(id: number) {
  const idx = scheduleForm.value.selectedAccountIds.indexOf(id)
  if (idx === -1) {
    scheduleForm.value.selectedAccountIds.push(id)
  } else {
    scheduleForm.value.selectedAccountIds.splice(idx, 1)
  }
}

function validateScheduleForm(): boolean {
  scheduleErrors.value = {}
  if (!scheduleForm.value.postId) {
    scheduleErrors.value.postId = 'Select a post to schedule'
  }
  if (!scheduleForm.value.selectedAccountIds.length) {
    scheduleErrors.value.accounts = 'Select at least one social account'
  }
  if (!scheduleForm.value.time) {
    scheduleErrors.value.time = 'Select a date & time'
  } else if (scheduleForm.value.time <= minDateTime.value) {
    scheduleErrors.value.time = 'Time must be in the future'
  }
  return Object.keys(scheduleErrors.value).length === 0
}

async function handleScheduleSubmit() {
  if (!validateScheduleForm()) return
  scheduleSaving.value = true
  try {
    await scheduleStore.schedulePost({
      postId: scheduleForm.value.postId!,
      socialAccountIds: scheduleForm.value.selectedAccountIds,
      postType: scheduleForm.value.postType,
      scheduledAt: new Date(scheduleForm.value.time).toISOString(),
    })
    showScheduleModal.value = false
    showDayModal.value = false
    await loadAll()
  } catch (err: any) {
    alert(err?.message?.message || 'Failed to schedule post')
  } finally {
    scheduleSaving.value = false
  }
}

async function handleCancelSchedule(id: number) {
  if (!confirm('Cancel this scheduled post?')) return
  await scheduleStore.removeScheduledPost(id)
  await loadAll()
}

// ─── Load data ─────────────────────────────────────────────────────────────
const brandId = computed(() => brandStore.currentBrand?.id)

async function loadAll() {
  const bId = brandId.value
  await Promise.all([
    scheduleStore.loadScheduledPosts(bId),
    scheduleStore.loadSocialAccounts(),
    bId ? postStore.loadPosts(bId) : Promise.resolve(),
    bId
      ? brandService.getBrandMembers(bId).then(({ data: res }) => {
          currentUserRole.value = res.data.currentUserRole
        }).catch(() => { currentUserRole.value = null })
      : Promise.resolve(),
  ])
}

onMounted(loadAll)
watch(() => brandStore.currentBrand?.id, loadAll)

// ─── Helpers ──────────────────────────────────────────────────────────────
function statusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    posted: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function platformIcon(platform: string) {
  const icons: Record<string, string> = {
    mastodon: '🐘',
    twitter: '🐦',
    reddit: '🤖',
    linkedin: '💼',
    instagram: '📷',
  }
  return icons[platform] ?? '🌐'
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Whether the current user can cancel a specific scheduled post */
function canCancelScheduledPost(sp: IScheduledPost): boolean {
  if (sp.publishStatus !== 'pending') return false
  if (currentUserRole.value === 'owner' || currentUserRole.value === 'admin') return true
  if (currentUserRole.value === 'member') {
    return sp.socialAccount?.userId === authStore.user?.id
  }
  return false
}

const isDisabled = computed(() => {
      const today = new Date().toISOString().slice(0, 10);
      return !selectedDate.value || selectedDate.value < today;
    })

</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Page header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-900">Calendar</h1>
    </div>

    <!-- Main layout: 65% calendar | 35% sidebar -->
    <div class="flex gap-4 flex-1 min-h-0">

      <!-- ── Calendar (65%) ──────────────────────────────────────────── -->
      <div class="w-[65%] bg-white rounded-xl border border-gray-200 p-4 overflow-auto">
        <FullCalendar :options="calendarOptions" />
      </div>

      <!-- ── Right panel (35%) ─────────────────────────────────────── -->
      <div class="w-[35%] flex flex-col gap-4 overflow-auto">

        <!-- Scheduled posts panel -->
        <div class="bg-white rounded-xl border border-gray-200 flex flex-col flex-1 min-h-0">
          <div class="px-4 py-3 border-b border-gray-100 shrink-0">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-sm font-semibold text-gray-900">This Month's Schedules</h2>
              <span class="text-xs text-gray-400">{{ upcomingPosts.length }} shown</span>
            </div>
            <!-- Status filter pills -->
            <div class="flex gap-1 flex-wrap">
              <button
                v-for="filter in [
                  { value: 'pending', label: 'Pending' },
                  { value: 'posted', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'all', label: 'All' },
                ]"
                :key="filter.value"
                @click="upcomingStatusFilter = filter.value as any"
                :class="[
                  'text-xs px-2 py-0.5 rounded-full font-medium transition-colors',
                  upcomingStatusFilter === filter.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                ]"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>
          <div class="overflow-y-auto flex-1 divide-y divide-gray-50">
            <div v-if="scheduleStore.loading" class="p-4 text-center text-gray-400 text-sm">Loading…</div>
            <div v-else-if="!upcomingPosts.length" class="p-4 text-center text-gray-400 text-sm">No posts match this filter</div>
            <div
              v-for="sp in upcomingPosts"
              :key="sp.id"
              class="px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ sp.post?.title ?? `Post #${sp.postId}` }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ platformIcon(sp.socialAccount?.platform?.platform ?? '') }}
                    {{ sp.socialAccount?.username }}
                  </p>
                  <p class="text-xs text-indigo-500 mt-0.5 font-medium">
                    {{ formatFullDate(sp.scheduledAt) }} · {{ formatTime(sp.scheduledAt) }}
                  </p>
                </div>
                <span :class="['shrink-0 text-xs px-1.5 py-0.5 rounded font-medium', statusClass(sp.publishStatus)]">
                  {{ sp.publishStatus }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Draft posts panel -->
        <div class="bg-white rounded-xl border border-gray-200 flex flex-col shrink-0 max-h-[280px]">
          <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h2 class="text-sm font-semibold text-gray-900">Draft Posts</h2>
            <router-link to="/posts/create" class="text-xs text-indigo-600 hover:text-indigo-800">+ New Post</router-link>
          </div>
          <div class="overflow-y-auto divide-y divide-gray-50">
            <div v-if="!draftPosts.length" class="p-4 text-center text-gray-400 text-sm">No drafts</div>
            <div
              v-for="post in draftPosts"
              :key="post.id"
              class="px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors"
            >
              <p class="text-sm text-gray-800 truncate flex-1">{{ post.title }}</p>
              <span v-if="post.isAiGenerated" class="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 shrink-0">AI</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════
       Day Modal — shows scheduled events for selected date + "Add schedule"
  ════════════════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <div v-if="showDayModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="closeDayModal" />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ new Date(selectedDate + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) }}
            </h3>
            <div class="flex items-center gap-3 mt-0.5">
              <p class="text-sm text-gray-500">{{ dayScheduledPosts.length }} shown</p>
              <button
                @click="showDayCancelled = !showDayCancelled"
                :class="[
                  'text-xs px-2 py-0.5 rounded-full font-medium transition-colors',
                  showDayCancelled
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200',
                ]"
              >
                {{ showDayCancelled ? 'Hide cancelled' : 'Show cancelled' }}
              </button>
            </div>
          </div>
          <button @click="closeDayModal" class="size-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Scheduled items for this day -->
        <div class="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <div v-if="!dayScheduledPosts.length" class="text-center py-6 text-gray-400">
            <svg class="mx-auto size-10 text-gray-200 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h12M6 12h8m-8 6h12"/></svg>
            <p class="text-sm">No posts scheduled for this day</p>
          </div>

          <div
            v-for="sp in dayScheduledPosts"
            :key="sp.id"
            class="bg-gray-50 rounded-xl p-4 border border-gray-100"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">
                  {{ sp.post?.title ?? `Post #${sp.postId}` }}
                </p>
                <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ sp.post?.content }}</p>
              </div>
              <span :class="['shrink-0 text-xs px-2 py-0.5 rounded-full font-medium', statusClass(sp.publishStatus)]">
                {{ sp.publishStatus }}
              </span>
            </div>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center gap-1.5 text-xs text-gray-500">
                <span>{{ platformIcon(sp.socialAccount?.platform?.platform ?? '') }}</span>
                <span class="font-medium">{{ sp.socialAccount?.username }}</span>
                <span>·</span>
                <span>{{ formatTime(sp.scheduledAt) }}</span>
              </div>
              <button
                v-if="canCancelScheduledPost(sp)"
                @click="handleCancelSchedule(sp.id)"
                class="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100" v-show="!isDisabled">
          <button
            @click="openNewSchedule"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Schedule a post for this day
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══════════════════════════════════════════════════════════════════════
       New Schedule Modal
  ════════════════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <div v-if="showScheduleModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-[2px]" @click="closeScheduleModal" />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h3 class="text-lg font-semibold text-gray-900">Schedule Post</h3>
          <button @click="closeScheduleModal" class="size-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          <!-- Select Post -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Post <span class="text-red-500">*</span>
            </label>
            <select
              v-model="scheduleForm.postId"
              class="w-full rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option :value="null" disabled>Select a draft post…</option>
              <option v-for="post in draftPosts" :key="post.id" :value="post.id">
                {{ post.title }}
              </option>
            </select>
            <p v-if="!draftPosts.length" class="mt-1.5 text-xs text-amber-600">
              No draft posts available.
              <router-link to="/posts/create" class="underline" @click="closeScheduleModal">Create one first.</router-link>
            </p>
            <p v-if="scheduleErrors.postId" class="mt-1 text-xs text-red-500">{{ scheduleErrors.postId }}</p>
          </div>

          <!-- Social accounts checkboxes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Publish to <span class="text-red-500">*</span>
            </label>

            <div v-if="!scheduleStore.socialAccounts.length" class="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2.5 border border-amber-100">
              No linked social accounts yet. Connect an account first.
            </div>

            <div v-else class="space-y-2">
              <label
                v-for="account in scheduleStore.socialAccounts"
                :key="account.id"
                :class="[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors',
                  scheduleForm.selectedAccountIds.includes(account.id)
                    ? 'border-indigo-300 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  !account.isActive || !account.platform?.isActive ? 'opacity-50 cursor-not-allowed' : '',
                ]"
              >
                <input
                  type="checkbox"
                  :checked="scheduleForm.selectedAccountIds.includes(account.id)"
                  :disabled="!account.isActive || !account.platform?.isActive"
                  @change="toggleAccount(account.id)"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="text-base leading-none">{{ platformIcon(account.platform?.platform ?? '') }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">{{ account.username }}</p>
                  <p class="text-xs text-gray-500 capitalize">{{ account.platform?.platform }}</p>
                </div>
                <span
                  v-if="!account.isActive"
                  class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  Disconnected
                </span>
                <span
                  v-else-if="!account.platform?.isActive"
                  class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  Inactive
                </span>
              </label>
            </div>
            <p v-if="scheduleErrors.accounts" class="mt-1 text-xs text-red-500">{{ scheduleErrors.accounts }}</p>
          </div>

          <!-- Post type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Post Type</label>
            <div class="flex gap-2">
              <button
                v-for="type in ['text', 'link', 'image']"
                :key="type"
                type="button"
                @click="scheduleForm.postType = type as any"
                :class="[
                  'flex-1 py-2 text-sm font-medium rounded-lg border transition-colors capitalize',
                  scheduleForm.postType === type
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
                ]"
              >
                {{ type }}
              </button>
            </div>
          </div>

          <!-- Date & time -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Schedule date & time <span class="text-red-500">*</span>
            </label>
            <input
              v-model="scheduleForm.time"
              type="datetime-local"
              :min="minTimeForDate"
              class="w-full rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p class="mt-1 text-xs text-gray-400">Cannot schedule in the past or within the next 5 minutes</p>
            <p v-if="scheduleErrors.time" class="mt-1 text-xs text-red-500">{{ scheduleErrors.time }}</p>
          </div>

        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          <button
            @click="handleScheduleSubmit"
            :disabled="scheduleSaving"
            class="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {{ scheduleSaving ? 'Scheduling…' : 'Schedule Post' }}
          </button>
          <button
            @click="closeScheduleModal"
            class="px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style>
/* FullCalendar global overrides scoped to this page */
.fc .fc-toolbar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}
.fc .fc-button {
  background-color: #fff !important;
  color: #374151 !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.5rem !important;
  font-size: 0.75rem !important;
  padding: 0.3rem 0.65rem !important;
  font-weight: 500 !important;
  box-shadow: none !important;
}
.fc .fc-button:hover {
  background-color: #f9fafb !important;
}
.fc .fc-button-primary:not(:disabled).fc-button-active {
  background-color: #eef2ff !important;
  color: #4f46e5 !important;
  border-color: #a5b4fc !important;
}
.fc .fc-daygrid-day-number {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 4px 6px;
}
.fc .fc-col-header-cell-cushion {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.fc .fc-event {
  border-radius: 6px !important;
  font-size: 0.7rem !important;
  padding: 1px 4px !important;
  cursor: pointer;
}
.fc .fc-daygrid-day.fc-day-today {
  background-color: #eef2ff !important;
}
.fc-theme-standard td, .fc-theme-standard th {
  border-color: #f3f4f6 !important;
}
</style>
