import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import useLocalStorage from '@/composables/useLocalStorage.ts';
import * as brandService from '@/api/services/brands.ts';
import type {
  IBrand,
  ICreateBrand,
  IUpdateBrand,
} from '@/types/brand/BrandTypes';

interface IBrandsMeta {
  total: number;
  page: number;
  lastPage: number;
  perPage: number;
  hasMore: boolean;
}

export const useBrandStore = defineStore('brand', () => {
  const brands = ref<IBrand[]>([]);
  const brandsMeta = ref<IBrandsMeta | null>(null);
  const currentBrandId = useLocalStorage<number | null>('brand.current');
  const loading = ref(false);
  const loadingMore = ref(false);

  const currentBrand = computed(() => {
    if (!currentBrandId.value) return brands.value[0] ?? null;
    return brands.value.find(b => b.id === currentBrandId.value) ?? null;
  });

  function selectBrand(id: number) {
    currentBrandId.value = id;
  }

  async function loadBrands(limit = 5) {
    loading.value = true;
    try {
      const { data: res } = await brandService.getBrands({ page: 1, limit });
      brands.value = res.data;
      brandsMeta.value = res.meta;
      // auto-select first brand if none selected
      if (!currentBrandId.value && brands.value.length) {
        currentBrandId.value = brands.value[0].id;
      }
    } finally {
      loading.value = false;
    }
  }

  async function loadMoreBrands() {
    if (!brandsMeta.value?.hasMore || loadingMore.value) return;
    loadingMore.value = true;
    try {
      const { data: res } = await brandService.getBrands({
        page: brandsMeta.value.page + 1,
        limit: brandsMeta.value.perPage,
      });
      brands.value.push(...res.data);
      brandsMeta.value = res.meta;
    } finally {
      loadingMore.value = false;
    }
  }

  async function addBrand(data: ICreateBrand) {
    const { data: res } = await brandService.createBrand(data);
    brands.value.unshift(res.data);
    return res.data as IBrand;
  }

  async function editBrand(id: number, data: IUpdateBrand) {
    const { data: res } = await brandService.updateBrand(id, data);
    const idx = brands.value.findIndex(b => b.id === id);
    if (idx !== -1) brands.value[idx] = res.data;
    return res.data as IBrand;
  }

  async function removeBrand(id: number) {
    await brandService.deleteBrand(id);
    brands.value = brands.value.filter(b => b.id !== id);
    if (currentBrandId.value === id) {
      currentBrandId.value = brands.value[0]?.id ?? null;
    }
  }

  return {
    brands,
    brandsMeta,
    currentBrand,
    currentBrandId,
    loading,
    loadingMore,
    selectBrand,
    loadBrands,
    loadMoreBrands,
    addBrand,
    editBrand,
    removeBrand,
  };
});
