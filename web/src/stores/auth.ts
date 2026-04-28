import { defineStore } from 'pinia';
import useLocalStorage from '@/composables/useLocalStorage.ts';
import * as authServices from '@/api/services/auth.ts';
import type { ILogin, IRegister } from '@/types/auth/AuthTypes';
import type { IUser } from '@/types/user/UserTypes';
// import { useHelper } from "@/utils/Helper";

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage<IUser | null>('auth.user');
  const token = useLocalStorage<string | null>('token');

  let isSessionVerified = false;

  async function login(credentials: ILogin) {
    try {
      const { data: response } = await authServices.login(credentials);
      token.value = response.data.metadata.token;
      await loadUser();
    } catch (err: any) {
      if (err.status === 422) {
        alert('Validation Error: ' + (err.message || 'Invalid input.'));
      } else if (err.status === 400) {
        alert(
          'Error: ' +
            (err?.message?.errors[0]?.message || 'Something went wrong.'),
        );
      } else {
        alert('Error: ' + (err?.message || 'Something went wrong.'));
      }
      return err;
    }
  }

  async function register(credentials: IRegister) {
    try {
      const response = await authServices.register(credentials);
      //   return useHelper().successApiResponse(response)
    } catch (err: any) {
      if (err.status === 422) {
        alert('Validation Error: ' + (err.message || 'Invalid input.'));
      } else {
        alert('Error: ' + (err?.message || 'Something went wrong.'));
      }
      return err;
    }
  }

  async function loadUser() {
    isSessionVerified = true;
    const { data: response } = await authServices.getUser();
    user.value = response.data.user;
  }

  async function logout() {
    try {
      await authServices.logout();
      user.value = null;
      token.value = null;
      return;
    } catch (error: any) {
      // console.error(error)
      return;
    } finally {
      // useProductStore().$reset()
    }
  }

  async function verifySession() {
    if (user.value && !isSessionVerified) {
      try {
        await loadUser();
      } catch (error) {
        user.value = null;
        token.value = null;
      }
    }
  }

  return {
    verifySession,
    login,
    register,
    logout,
    loadUser,
    user,
  };
});
