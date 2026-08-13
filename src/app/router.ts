import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'

let authReadyPromise: Promise<void> | null = null;

export function setAuthReadyPromise(promise: Promise<void>) {
  authReadyPromise = promise;
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'tasks',
      component: () => import('@/pages/TasksPage.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  if (authReadyPromise) {
    await authReadyPromise;
  }

  const { user } = useAuth();

  if (to.meta.requiresAuth && !user.value) {
    return { name: 'login' }
  }

  if (to.name === 'login' && user.value) {
    return { name: 'tasks' }
  }
});

export default router
