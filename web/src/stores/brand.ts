import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import useLocalStorage from '@/composables/useLocalStorage.ts';
import * as brandService from '@/api/services/brands.ts';
import type {
  IBrand,
  ICreateBrand,
  IUpdateBrand,
} from '@/types/brand/BrandTypes';

export const useBrandStore = defineStore('brand', () => {
  const brands = ref<IBrand[]>([]);
  const currentBrandId = useLocalStorage<number | null>('brand.current');
  const loading = ref(false);

  const currentBrand = computed(() => {
    if (!currentBrandId.value) return brands.value[0] ?? null;
    return brands.value.find(b => b.id === currentBrandId.value) ?? null;
  });

  function selectBrand(id: number) {
    currentBrandId.value = id;
  }

  async function loadBrands() {
    loading.value = true;
    try {
      const { data: res } = await brandService.getBrands();
      brands.value = res.data;
      // auto-select first brand if none selected
      if (!currentBrandId.value && brands.value.length) {
        currentBrandId.value = brands.value[0].id;
      }
    } finally {
      loading.value = false;
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
    currentBrand,
    currentBrandId,
    loading,
    selectBrand,
    loadBrands,
    addBrand,
    editBrand,
    removeBrand,
  };
});
