import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

function auth(to: any, from: any) {
  const auth = useAuthStore();
  if (!auth.user) {
    return { name: 'LoginPage' };
  }
}

async function guest(to: any, from: any) {
  const auth = useAuthStore();
  if (auth.user) {
    return { name: 'Dashboard' };
  }
}

const routes = [
  {
    path: '/',
    component: () => import('@/views/layouts/Default.vue'),
    beforeEnter: auth,
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/pages/Dashboard.vue'),
      },
      {
        path: '/calendar',
        name: 'Calendar',
        component: () => import('@/views/pages/Calendar.vue'),
      },
      {
        path: '/posts',
        name: 'Posts',
        component: () => import('@/views/pages/Posts.vue'),
      },
      {
        path: '/posts/create',
        name: 'PostCreate',
        component: () => import('@/views/pages/PostForm.vue'),
      },
      {
        path: '/posts/:id/edit',
        name: 'PostEdit',
        component: () => import('@/views/pages/PostForm.vue'),
      },
      {
        path: '/brands',
        name: 'Brands',
        component: () => import('@/views/pages/Brands.vue'),
      },
      {
        path: '/brands/create',
        name: 'BrandCreate',
        component: () => import('@/views/pages/BrandForm.vue'),
      },
      {
        path: '/brands/:id/edit',
        name: 'BrandEdit',
        component: () => import('@/views/pages/BrandForm.vue'),
      },
      {
        path: '/brands/:id/members',
        name: 'BrandMembers',
        component: () => import('@/views/pages/BrandMembers.vue'),
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('@/views/pages/Settings.vue'),
      },
      {
        path: '/oauth/callback/mastodon',
        name: 'OAuthCallbackMastodon',
        component: () => import('@/views/pages/OAuthCallback.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/views/layouts/Auth.vue'),
    beforeEnter: guest,
    children: [
      {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@/views/pages/auth/Login.vue'),
      },
      {
        path: '/register',
        name: 'RegisterPage',
        component: () => import('@/views/pages/auth/Register.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to, from) => {
  // if (useMainStore().selected.length) {
  //   useMainStore().toggleSelectAll([]);
  // }
  await useAuthStore().verifySession();
});

export default router;
