import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as scheduleService from '@/api/services/schedules.ts';
import type {
  IScheduledPost,
  ISocialAccount,
  ICreateScheduledPost,
} from '@/types/schedule/ScheduleTypes';

export const useScheduleStore = defineStore('schedule', () => {
  const scheduledPosts = ref<IScheduledPost[]>([]);
  const socialAccounts = ref<ISocialAccount[]>([]);
  const loading = ref(false);

  async function loadScheduledPosts(brandId?: number) {
    loading.value = true;
    try {
      const { data: res } = await scheduleService.getScheduledPosts(brandId);
      scheduledPosts.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function loadSocialAccounts() {
    const { data: res } = await scheduleService.getSocialAccounts();
    socialAccounts.value = res.data;
  }

  async function schedulePost(data: ICreateScheduledPost) {
    const { data: res } = await scheduleService.createScheduledPost(data);
    // res.data is an array (one entry per socialAccount)
    const created: IScheduledPost[] = res.data;
    scheduledPosts.value.push(...created);
    return created;
  }

  async function removeScheduledPost(id: number) {
    await scheduleService.deleteScheduledPost(id);
    scheduledPosts.value = scheduledPosts.value.filter(s => s.id !== id);
  }

  return {
    scheduledPosts,
    socialAccounts,
    loading,
    loadScheduledPosts,
    loadSocialAccounts,
    schedulePost,
    removeScheduledPost,
  };
});
