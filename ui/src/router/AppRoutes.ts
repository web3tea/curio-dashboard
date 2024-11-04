const AppRoutes = {
  path: '/app',
  meta: {
    requiresAuth: true,
  },
  redirect: '/app/overview',
  component: () => import('@/layouts/DashboardLayout.vue'),
  children: [
    {
      name: 'Overview',
      path: '/app/overview',
      component: () => import('@/views/overview/index.vue'),
    },
    {
      name: 'Analytics',
      path: '/app/analytics',
      component: () => import('@/views/analytics/index.vue'),
    },
    {
      name: 'Machines',
      path: '/app/machines',
      component: () => import('@/views/machines/index.vue'),
    },
    {
      name: 'MachineInfo',
      path: '/app/machines/:id',
      component: () => import('@/views/machines/MachineInfo.vue'),
      props: true,
    },
    {
      name: 'Storages',
      path: '/app/storages',
      component: () => import('@/views/storages/index.vue'),
    },
    {
      name: 'PoRep',
      path: '/app/porep',
      component: () => import('@/views/porep/index.vue'),
    },
    {
      name: 'Tasks',
      path: '/app/tasks',
      component: () => import('@/views/task/index.vue'),
    },
    {
      name: 'Sectors',
      path: '/app/sectors',
      component: () => import('@/views/sectors/index.vue'),
    },
    {
      name: 'SectorDetails',
      path: '/app/sectors/:miner/:sectorNumber',
      component: () => import('@/views/sectors/SectorDetails.vue'),
      props: true,
    },
    {
      name: 'Configurations',
      path: '/app/configurations',
      component: () => import('@/views/configurations/index.vue'),
    },
    {
      name: 'ConfigurationEdit',
      path: '/app/configurations/:layer',
      component: () => import('@/views/configurations/ConfigurationEdit.vue'),
      props: true,
    },
    {
      name: 'ConfigurationCreate',
      path: '/app/configurations/create',
      component: () => import('@/views/configurations/ConfigurationCreate.vue'),
    },
    {
      name: 'Miners',
      path: '/app/miners',
      component: () => import('@/views/miners/index.vue'),
    },
    {
      name: 'MinerDetails',
      path: '/app/miners/:id',
      component: () => import('@/views/miners/MinerDetails.vue'),
      props: true,
    },
    {
      name: 'PendingDeals',
      path: '/app/deals/pending',
      component: () => import('@/views/deals/index.vue'),
    },
  ],
}

export default AppRoutes
