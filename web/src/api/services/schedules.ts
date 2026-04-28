import type { AxiosResponse } from 'axios';
import axios from '@/api/axios.ts';
import type { ICreateScheduledPost } from '@/types/schedule/ScheduleTypes';

export function getScheduledPosts(brandId?: number): Promise<AxiosResponse> {
  return axios.get('api/v1/scheduled-posts', {
    params: brandId ? { brandId } : undefined,
  });
}

export function getScheduledPost(id: number): Promise<AxiosResponse> {
  return axios.get(`api/v1/scheduled-posts/${id}`);
}

export function createScheduledPost(
  data: ICreateScheduledPost,
): Promise<AxiosResponse> {
  return axios.post('api/v1/scheduled-posts', data);
}

export function deleteScheduledPost(id: number): Promise<AxiosResponse> {
  return axios.delete(`api/v1/scheduled-posts/${id}`);
}

export function getSocialAccounts(): Promise<AxiosResponse> {
  return axios.get('api/v1/social-accounts');
}
