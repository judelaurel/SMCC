import type { AxiosResponse } from 'axios';
import axios from '@/api/axios.ts';
import type { ICreatePost, IUpdatePost } from '@/types/post/PostTypes';

export interface IGenerateAiPostPayload {
  brandId?: number;
  topic: string;
  platform: 'instagram' | 'twitter' | 'linkedin' | 'mastodon';
  toneOfVoice: 'professional' | 'casual' | 'witty' | 'formal';
  keywords: string[];
}

export interface IPostVariation {
  id: number;
  content: string;
  characterCount: number;
}

export function getPosts(
  brandId: number,
  state?: string,
): Promise<AxiosResponse> {
  const params: Record<string, any> = { brandId };
  if (state) params.state = state;
  return axios.get('api/v1/posts', { params });
}

export function getPost(id: number): Promise<AxiosResponse> {
  return axios.get(`api/v1/posts/${id}`);
}

export function createPost(data: ICreatePost): Promise<AxiosResponse> {
  return axios.post('api/v1/posts', data);
}

export function updatePost(
  id: number,
  data: IUpdatePost,
): Promise<AxiosResponse> {
  return axios.put(`api/v1/posts/${id}`, data);
}

export function deletePost(id: number): Promise<AxiosResponse> {
  return axios.delete(`api/v1/posts/${id}`);
}

export function generateAiPost(
  payload: IGenerateAiPostPayload,
): Promise<
  AxiosResponse<{ status: string; data: { variations: IPostVariation[] } }>
> {
  return axios.post('api/v1/posts/generate-ai', payload);
}
