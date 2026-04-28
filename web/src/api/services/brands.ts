import type { AxiosResponse } from 'axios';
import axios from '@/api/axios.ts';
import type {
  ICreateBrand,
  IUpdateBrand,
  ICreateBrandMember,
  IUpdateBrandMember,
} from '@/types/brand/BrandTypes';

export function getBrands(): Promise<AxiosResponse> {
  return axios.get('api/v1/brands');
}

export function getBrand(id: number): Promise<AxiosResponse> {
  return axios.get(`api/v1/brands/${id}`);
}

export function createBrand(data: ICreateBrand): Promise<AxiosResponse> {
  return axios.post('api/v1/brands', data);
}

export function updateBrand(
  id: number,
  data: IUpdateBrand,
): Promise<AxiosResponse> {
  return axios.put(`api/v1/brands/${id}`, data);
}

export function deleteBrand(id: number): Promise<AxiosResponse> {
  return axios.delete(`api/v1/brands/${id}`);
}

// ── Brand Members ──────────────────────────────────────────────────────────

export function getBrandMembers(brandId: number): Promise<AxiosResponse> {
  return axios.get(`api/v1/brands/${brandId}/members`);
}

export function addBrandMember(
  brandId: number,
  data: ICreateBrandMember,
): Promise<AxiosResponse> {
  return axios.post(`api/v1/brands/${brandId}/members`, data);
}

export function updateBrandMember(
  brandId: number,
  memberId: number,
  data: IUpdateBrandMember,
): Promise<AxiosResponse> {
  return axios.put(`api/v1/brands/${brandId}/members/${memberId}`, data);
}

export function removeBrandMember(
  brandId: number,
  memberId: number,
): Promise<AxiosResponse> {
  return axios.delete(`api/v1/brands/${brandId}/members/${memberId}`);
}

export function getAvailableUsers(brandId: number): Promise<AxiosResponse> {
  return axios.get(`api/v1/brands/${brandId}/members/available-users`);
}
