import type { AxiosResponse } from 'axios';
import axios from '@/api/axios.ts';
import type { ILogin, IRegister } from '@/types/auth/AuthTypes';

export async function getAPIHealth(): Promise<AxiosResponse> {
  return await axios.get(`api/v1/health`);
}

export async function login(credentials: ILogin): Promise<AxiosResponse> {
  return await axios.post(`api/v1/auth/login`, credentials);
}

export async function register(credentials: IRegister): Promise<AxiosResponse> {
  return await axios.post(`api/v1/auth/register`, credentials);
}

export async function getUser(): Promise<AxiosResponse> {
  return await axios.get(`api/v1/users/me`);
}

export async function updateProfile(data: {
  firstName: string;
  lastName: string;
}): Promise<AxiosResponse> {
  return await axios.put(`api/v1/users/profile`, data);
}

export async function updatePassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<AxiosResponse> {
  return await axios.put(`api/v1/users/password`, data);
}

export async function getSocialPlatforms(): Promise<AxiosResponse> {
  return await axios.get(`api/v1/social-platforms`);
}

export async function getSocialAccounts(): Promise<AxiosResponse> {
  return await axios.get(`api/v1/social-accounts`);
}

export async function deleteSocialAccount(id: number): Promise<AxiosResponse> {
  return await axios.delete(`api/v1/social-accounts/${id}`);
}

export async function getMastodonOAuthUrl(
  platformId: number,
  redirectTo: string,
): Promise<AxiosResponse> {
  return await axios.get(`api/v1/users/oauth/mastodon/redirect`, {
    params: { platformId, redirectTo },
  });
}

export async function exchangeMastodonCode(
  code: string,
  state: string,
): Promise<AxiosResponse> {
  return await axios.post(`api/v1/users/oauth/mastodon/callback`, {
    code,
    state,
  });
}

export async function logout(): Promise<AxiosResponse> {
  return await axios.delete(`api/v1/auth/logout`);
}
