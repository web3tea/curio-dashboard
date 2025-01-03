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
      component: () => import('@/views/auth/AuthLogin.vue'),
      meta: {
        title: 'Login',
        description: 'Login to the Curio Dashboard',
      },
    },
  ],
}

export default AuthRoutes
