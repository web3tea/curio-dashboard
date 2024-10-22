/**
 * router/index.ts
 */

import { createRouter, createWebHistory } from 'vue-router'
import AppRoutes from '@/router/AppRoutes'
import AuthRoutes from '@/router/AuthRoutes'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/app/overview',
    },
    AuthRoutes,
    AppRoutes,
  ],
})

interface AuthStore {
  token: string | null;
  returnUrl: string | null;
  login(username: string, password: string): Promise<void>;
  logout(): void;
}

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/auth/login']
  const authRequired = !publicPages.includes(to.path)
  const auth: AuthStore = useAuthStore()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (authRequired && !auth.token) {
      auth.returnUrl = to.fullPath
      return next('/auth/login')
    } else next()
  } else {
    next()
  }
})

router.beforeEach(() => {
  const uiStore = useUIStore()
  uiStore.isLoading = true
})

router.afterEach(() => {
  const uiStore = useUIStore()
  uiStore.isLoading = false
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
