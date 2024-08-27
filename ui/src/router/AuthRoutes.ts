const AuthRoutes = {
  path: '/auth',
  component: () => import('@/layouts/BlankLayout.vue'),
  meta: {
    requiresAuth: false,
  },
  children: [
    {
      name: 'Login',
      path: '/auth/login',
      component: () => import('@/views/auth/Login.vue'),
    },
  ],
}

export default AuthRoutes
