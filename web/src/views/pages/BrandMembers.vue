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
function roleBadgeVariant(role: string): string {
  const map: Record<string, string> = {
    owner: 'amber',
    admin: 'info',
    member: 'neutral',
  }
  return map[role] ?? 'neutral'
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
    <PageHeader :title="`${brand?.name ?? 'Brand'} — Members`" back-to="/brands">
      <template #actions>
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
      </template>
    </PageHeader>

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
                <AppBadge :variant="roleBadgeVariant(member.role)">
                  {{ member.role }}
                </AppBadge>
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

  <!-- Add Member Modal -->
  <AppModal v-model="showAddModal" title="Add Member">
    <div class="space-y-4">
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

      <AppSelect
        label="Role"
        required
        v-model="addForm.role"
        :options="assignableRoles"
      />

      <p v-if="addError" class="text-xs text-red-500">{{ addError }}</p>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button variant="secondary" @click="showAddModal = false">Cancel</Button>
        <Button :loading="addSaving" :disabled="!addForm.userId" @click="handleAddMember">
          Add Member
        </Button>
      </div>
    </template>
  </AppModal>

  <!-- Edit Role Modal -->
  <AppModal v-model="showEditModal" title="Edit Role" max-width="sm">
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Changing role for
        <span class="font-semibold text-gray-900">{{ editTarget ? displayName(editTarget) : '' }}</span>
      </p>
      <AppSelect
        label="New Role"
        v-model="editRole"
        :options="assignableRoles"
      />
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <Button variant="secondary" @click="showEditModal = false">Cancel</Button>
        <Button :loading="editSaving" @click="handleUpdateRole">Save</Button>
      </div>
    </template>
  </AppModal>
</template>
