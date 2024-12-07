import { RouteLocationNormalizedLoaded } from 'vue-router'

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
      meta: {
        title: 'Overview',
        description: "Overview of the cluster's health and performance",
      },
    },
    {
      name: 'Analytics',
      path: '/app/analytics',
      component: () => import('@/views/analytics/index.vue'),
      meta: {
        title: 'Analytics',
        description: 'Analytics of the cluster',
      },
    },
    {
      name: 'Machines',
      path: '/app/machines',
      component: () => import('@/views/machines/index.vue'),
      meta: {
        title: 'Machine List',
        description: 'List of all machines in the cluster',
      },
    },
    {
      name: 'MachineInfo',
      path: '/app/machines/:id',
      component: () => import('@/views/machines/MachineInfo.vue'),
      props: true,
      meta: {
        title: 'Machine Info',
        description: 'Machine details',
      },
    },
    {
      name: 'Storages',
      path: '/app/storages',
      component: () => import('@/views/storages/index.vue'),
      meta: {
        title: 'Storage List',
        description: 'List of all storages in the cluster',
      },
    },
    {
      name: 'PoRep',
      path: '/app/porep',
      component: () => import('@/views/porep/index.vue'),
      meta: {
        title: 'PoRep Pipeline',
        description: "PoRep pipeline's status",
      },
    },
    {
      name: 'RunningTasks',
      path: '/app/running-tasks',
      component: () => import('@/views/task/index.vue'),
      meta: {
        title: 'Running',
        description: 'List of all running tasks in the cluster',
      },
    },
    {
      name: 'TaskHistory',
      path: '/app/task-history',
      component: () => import('@/views/task/history/index.vue'),
      props: (route: RouteLocationNormalizedLoaded) => ({
        start: Number(route.query.start),
        end: Number(route.query.end),
        name: route.query.name,
        machine: route.query.machine,
        success: route.query.success,
      }),
      meta: {
        title: 'History',
        description: 'List of all task history in the cluster',
      },
    },
    {
      name: 'Sectors',
      path: '/app/sectors',
      component: () => import('@/views/sectors/index.vue'),
      meta: {
        title: 'Sector List',
        description: 'List of all sectors in the cluster',
      },
    },
    {
      name: 'SectorDetails',
      path: '/app/sectors/:miner/:sectorNumber',
      component: () => import('@/views/sectors/SectorDetails.vue'),
      props: true,
      meta: {
        title: 'Sector Details',
        description: 'Sector details',
      },
    },
    {
      name: 'MiningTaskList',
      path: '/app/mining/wins',
      component: () => import('@/views/mining/wins/index.vue'),
      meta: {
        title: 'Mining Wins',
        description: 'List of all mining wins in the cluster',
      },
    },
    {
      name: 'Configurations',
      path: '/app/configurations',
      component: () => import('@/views/configurations/index.vue'),
      meta: {
        title: 'Configuration List',
        description: 'List of all configurations in the cluster',
      },
    },
    {
      name: 'ConfigurationEdit',
      path: '/app/configurations/:layer',
      component: () => import('@/views/configurations/ConfigurationEdit.vue'),
      props: true,
      meta: {
        title: 'Configuration Edit',
        description: 'Edit configuration',
      },
    },
    {
      name: 'ConfigurationCreate',
      path: '/app/configurations/create',
      component: () => import('@/views/configurations/ConfigurationCreate.vue'),
      meta: {
        title: 'Configuration Create',
        description: 'Create configuration',
      },
    },
    {
      name: 'Miners',
      path: '/app/miners',
      component: () => import('@/views/miners/index.vue'),
      meta: {
        title: 'Miner List',
        description: 'List of all miners in the cluster',
      },
    },
    {
      name: 'MinerDetails',
      path: '/app/miners/:id',
      component: () => import('@/views/miners/MinerDetails.vue'),
      props: true,
      meta: {
        title: 'Miner Details',
        description: 'Miner details',
      },
    },
    {
      name: 'PendingDeals',
      path: '/app/deals/pending',
      component: () => import('@/views/deals/index.vue'),
      meta: {
        title: 'Pending Deals',
        description: 'List of all pending deals in the cluster',
      },
    },
  ],
}

export default AppRoutes
