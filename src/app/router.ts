import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'

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

router.beforeEach((to) => {
  const { user } = useAuth();

  if (to.meta.requiresAuth && !user.value) {
    return { name: 'login' }
  }

  if (to.name === 'login' && user.value) {
    return { name: 'tasks' }
  }
});

export default router
