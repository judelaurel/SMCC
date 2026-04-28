<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import * as brandService from '@/api/services/brands.ts'
import type { IBrand, IBrandMember } from '@/types/brand/BrandTypes'
import type { IUser } from '@/types/user/UserTypes'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const brandId = Number(route.params.id)

// ─── State ───────────────────────────────────────────────────────────────────
const loading = ref(true)
const brand = ref<IBrand | null>(null)
const members = ref<IBrandMember[]>([])
const currentUserRole = ref<'owner' | 'admin' | 'member' | null>(null)

// Add member modal
const showAddModal = ref(false)
const availableUsers = ref<IUser[]>([])
const availableLoading = ref(false)
const addForm = ref({ userId: null as number | null, role: 'member' as 'admin' | 'member' })
const addSaving = ref(false)
const addError = ref('')

// Edit role modal
const showEditModal = ref(false)
const editTarget = ref<IBrandMember | null>(null)
const editRole = ref<'admin' | 'member'>('member')
const editSaving = ref(false)

// ─── Derived ─────────────────────────────────────────────────────────────────
const canAddMembers = computed(() => currentUserRole.value === 'owner' || currentUserRole.value === 'admin')
const canEditMembers = computed(() => currentUserRole.value === 'owner' || currentUserRole.value === 'admin')
const canRemoveMembers = computed(() => currentUserRole.value === 'owner')

/** Roles the current user can assign */
const assignableRoles = computed<Array<{ value: 'admin' | 'member'; label: string }>>(() => {
  if (currentUserRole.value === 'owner') {
    return [
      { value: 'admin', label: 'Admin' },
      { value: 'member', label: 'Member' },
    ]
  }
  return [{ value: 'member', label: 'Member' }]
})

// ─── Load data ───────────────────────────────────────────────────────────────
async function loadMembers() {
  loading.value = true
  try {
    const [brandRes, membersRes] = await Promise.all([
      brandService.getBrand(brandId),
      brandService.getBrandMembers(brandId),
    ])
    brand.value = brandRes.data.data
    members.value = membersRes.data.data.members
    currentUserRole.value = membersRes.data.data.currentUserRole
  } catch {
    router.push('/brands')
  } finally {
    loading.value = false
  }
}

onMounted(loadMembers)

// ─── Add member ──────────────────────────────────────────────────────────────
async function openAddModal() {
  addForm.value = { userId: null, role: 'member' }
  addError.value = ''
  showAddModal.value = true
  availableLoading.value = true
  try {
    const { data: res } = await brandService.getAvailableUsers(brandId)
    availableUsers.value = res.data
  } catch {
    availableUsers.value = []
  } finally {
    availableLoading.value = false
  }
}

async function handleAddMember() {
  if (!addForm.value.userId) {
    addError.value = 'Select a user to invite'
    return
  }
  addSaving.value = true
  addError.value = ''
  try {
    await brandService.addBrandMember(brandId, {
      userId: addForm.value.userId,
      role: addForm.value.role,
    })
    showAddModal.value = false
    await loadMembers()
  } catch (err: any) {
    addError.value = err?.response?.data?.message || err?.message || 'Failed to add member'
  } finally {
    addSaving.value = false
  }
}

// ─── Edit role ───────────────────────────────────────────────────────────────
function openEditModal(member: IBrandMember) {
  editTarget.value = member
  editRole.value = member.role === 'owner' ? 'admin' : member.role as 'admin' | 'member'
  showEditModal.value = true
}

async function handleUpdateRole() {
  if (!editTarget.value) return
  editSaving.value = true
  try {
    await brandService.updateBrandMember(brandId, editTarget.value.id, { role: editRole.value })
    showEditModal.value = false
    await loadMembers()
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Failed to update role')
  } finally {
    editSaving.value = false
  }
}

// ─── Remove member ───────────────────────────────────────────────────────────
async function handleRemoveMember(member: IBrandMember) {
  const name = member.user?.firstName
    ? `${member.user.firstName} ${member.user.lastName ?? ''}`.trim()
    : member.user?.username ?? `User #${member.userId}`
  if (!confirm(`Remove ${name} from this brand?`)) return
  try {
    await brandService.removeBrandMember(brandId, member.id)
    await loadMembers()
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Failed to remove member')
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function roleClass(role: string) {
  const map: Record<string, string> = {
    owner: 'bg-amber-100 text-amber-800',
    admin: 'bg-blue-100 text-blue-800',
    member: 'bg-gray-100 text-gray-800',
  }
  return map[role] ?? 'bg-gray-100 text-gray-800'
}

function displayName(member: IBrandMember): string {
  if (member.user?.firstName) {
    return `${member.user.firstName} ${member.user.lastName ?? ''}`.trim()
  }
  return member.user?.username ?? `User #${member.userId}`
}

function isCurrentUser(member: IBrandMember): boolean {
  return member.userId === authStore.user?.id
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <router-link
          to="/brands"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ brand?.name ?? 'Brand' }} — Members
        </h1>
      </div>

      <button
        v-if="canAddMembers"
        @click="openAddModal"
        class="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Member
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-400">Loading...</div>

    <template v-else>
      <!-- Empty state -->
      <div
        v-if="!members.length"
        class="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500"
      >
        <p class="text-lg font-medium text-gray-700 mb-2">No members</p>
        <p>This brand doesn't have any members yet.</p>
      </div>

      <!-- Members table -->
      <div
        v-else
        class="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                User
              </th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Email
              </th>
              <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Role
              </th>
              <th v-if="canEditMembers || canRemoveMembers" class="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="member in members"
              :key="member.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- User info -->
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm shrink-0">
                    {{ (member.user?.firstName?.[0] ?? member.user?.username?.[0] ?? '?').toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ displayName(member) }}
                      <span v-if="isCurrentUser(member)" class="text-xs text-gray-400 ml-1">(you)</span>
                    </p>
                    <p class="text-xs text-gray-500">@{{ member.user?.username }}</p>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="px-5 py-3">
                <span class="text-sm text-gray-600">{{ member.user?.email ?? '—' }}</span>
              </td>

              <!-- Role badge -->
              <td class="px-5 py-3">
                <span
                  :class="['inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize', roleClass(member.role)]"
                >
                  {{ member.role }}
                </span>
              </td>

              <!-- Actions -->
              <td v-if="canEditMembers || canRemoveMembers" class="px-5 py-3 text-right">
                <div v-if="member.role !== 'owner' && !isCurrentUser(member)" class="flex items-center justify-end gap-2">
                  <!-- Edit role -->
                  <button
                    v-if="canEditMembers"
                    @click="openEditModal(member)"
                    class="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    Edit Role
                  </button>

                  <!-- Remove -->
                  <button
                    v-if="canRemoveMembers"
                    @click="handleRemoveMember(member)"
                    class="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════
       Add Member Modal
  ════════════════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showAddModal = false" />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Add Member</h3>
          <button @click="showAddModal = false" class="size-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-4">
          <!-- User select -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              User <span class="text-red-500">*</span>
            </label>
            <div v-if="availableLoading" class="text-sm text-gray-400">Loading users…</div>
            <template v-else>
              <select
                v-model="addForm.userId"
                class="w-full rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option :value="null" disabled>Select a user…</option>
                <option v-for="u in availableUsers" :key="u.id" :value="u.id">
                  {{ u.firstName ? `${u.firstName} ${u.lastName ?? ''}`.trim() : u.username }} ({{ u.email }})
                </option>
              </select>
              <p v-if="!availableUsers.length" class="mt-1.5 text-xs text-gray-500">No available users to invite.</p>
            </template>
          </div>

          <!-- Role select -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Role <span class="text-red-500">*</span>
            </label>
            <select
              v-model="addForm.role"
              class="w-full rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option v-for="r in assignableRoles" :key="r.value" :value="r.value">
                {{ r.label }}
              </option>
            </select>
          </div>

          <p v-if="addError" class="text-xs text-red-500">{{ addError }}</p>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            @click="showAddModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleAddMember"
            :disabled="addSaving || !addForm.userId"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {{ addSaving ? 'Adding…' : 'Add Member' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══════════════════════════════════════════════════════════════════════
       Edit Role Modal
  ════════════════════════════════════════════════════════════════════════════ -->
  <Teleport to="body">
    <div v-if="showEditModal && editTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showEditModal = false" />

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Edit Role</h3>
          <button @click="showEditModal = false" class="size-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-5 space-y-4">
          <p class="text-sm text-gray-600">
            Changing role for
            <span class="font-semibold text-gray-900">{{ displayName(editTarget) }}</span>
          </p>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">New Role</label>
            <select
              v-model="editRole"
              class="w-full rounded-lg border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option v-for="r in assignableRoles" :key="r.value" :value="r.value">
                {{ r.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleUpdateRole"
            :disabled="editSaving"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {{ editSaving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
