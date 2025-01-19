import { RouteLocationNormalizedLoaded } from 'vue-router'

const AppRoutes = {
  path: '/',
  meta: {
    requiresAuth: true,
  },
  redirect: '/overview',
  component: () => import('@/layouts/DashboardLayout.vue'),
  children: [
    {
      name: 'Overview',
      path: '/overview',
      component: () => import('@/views/overview/OverviewIndex.vue'),
      meta: {
        title: 'Overview',
        description: "Overview of the cluster's health and performance",
      },
    },
    {
      name: 'Analytics',
      path: '/analytics',
      component: () => import('@/views/analytics/AnalyticsIndex.vue'),
      meta: {
        title: 'Analytics',
        description: 'Analytics of the cluster',
      },
    },
    {
      name: 'Machines',
      path: '/machines',
      component: () => import('@/views/machines/MachineIndex.vue'),
      meta: {
        title: 'Machine List',
        description: 'List of all machines in the cluster',
      },
    },
    {
      name: 'MachineInfo',
      path: '/machines/:id',
      component: () => import('@/views/machines/MachineInfo.vue'),
      props: true,
      meta: {
        title: 'Machine Info',
        description: 'Machine details',
      },
    },
    {
      name: 'Storages',
      path: '/storages',
      component: () => import('@/views/storages/StorageIndex.vue'),
      meta: {
        title: 'Storage List',
        description: 'List of all storages in the cluster',
      },
    },
    {
      name: 'PoRep',
      path: '/porep',
      component: () => import('@/views/porep/PorepIndex.vue'),
      meta: {
        title: 'PoRep Pipeline',
        description: "PoRep pipeline's status",
      },
    },
    {
      name: 'RunningTasks',
      path: '/running-tasks',
      component: () => import('@/views/task/TaskIndex.vue'),
      meta: {
        title: 'Running',
        description: 'List of all running tasks in the cluster',
      },
    },
    {
      name: 'TaskHistory',
      path: '/task-history',
      component: () => import('@/views/task/history/TaskHistoryIndex.vue'),
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
      path: '/sectors',
      component: () => import('@/views/sectors/SectorIndex.vue'),
      meta: {
        title: 'Sector List',
        description: 'List of all sectors in the cluster',
      },
    },
    {
      name: 'SectorDetails',
      path: '/sectors/:miner/:sectorNumber',
      component: () => import('@/views/sectors/SectorDetails.vue'),
      props: true,
      meta: {
        title: 'Sector Details',
        description: 'Sector details',
      },
    },
    {
      name: 'MiningTaskList',
      path: '/mining/wins',
      component: () => import('@/views/mining/wins/MiningWinsIndex.vue'),
      meta: {
        title: 'Mining Wins',
        description: 'List of all mining wins in the cluster',
      },
    },
    {
      name: 'Configurations',
      path: '/configurations',
      component: () => import('@/views/configurations/ConfigurationIndex.vue'),
      meta: {
        title: 'Configuration List',
        description: 'List of all configurations in the cluster',
      },
    },
    {
      name: 'ConfigurationEdit',
      path: '/configurations/:layer',
      component: () => import('@/views/configurations/ConfigurationEdit.vue'),
      props: true,
      meta: {
        title: 'Configuration Edit',
        description: 'Edit configuration',
      },
    },
    {
      name: 'ConfigurationCreate',
      path: '/configurations/create',
      component: () => import('@/views/configurations/ConfigurationCreate.vue'),
      meta: {
        title: 'Configuration Create',
        description: 'Create configuration',
      },
    },
    {
      name: 'Miners',
      path: '/miners',
      component: () => import('@/views/miners/MinerIndex.vue'),
      meta: {
        title: 'Miner List',
        description: 'List of all miners in the cluster',
      },
    },
    {
      name: 'MinerDetails',
      path: '/miners/:id',
      component: () => import('@/views/miners/MinerDetails.vue'),
      props: true,
      meta: {
        title: 'Miner Details',
        description: 'Miner details',
      },
    },
    {
      name: 'PendingDeals',
      path: '/deals/pending',
      component: () => import('@/views/deals/DealIndex.vue'),
      meta: {
        title: 'Pending Deals',
        description: 'List of all pending deals in the cluster',
      },
    },
    {
      name: 'MiningOverview',
      path: '/mining/overview',
      component: () => import('@/views/mining/overview/MiningOverviewIndex.vue'),
      meta: {
        title: 'Mining Overview',
        description: 'Overview of the mining in the cluster',
      },
    },
    {
      name: "MessageSends",
      path: "/messages/sends",
      component: () => import('@/views/messages/MessageIndex.vue'),
      meta: {
        title: 'Message Sends',
        description: 'List of all message sends in the cluster',
      },
    },
    {
      name: "Settings",
      path: "/settings",
      component: () => import('@/views/settings/SettingsIndex.vue'),
      meta: {
        title: 'Settings',
        description: 'My Settings',
      },
    },
    {
      name: "StorageAsks",
      path: "/market/storage-asks",
      component: () => import('@/views/market/asks/AskIndex.vue'),
      meta: {
        title: 'Storage Asks',
        description: 'List of all storage asks in the cluster',
      },
    },
    {
      name: "MarketBalances",
      path: "/market/balances",
      component: () => import('@/views/market/balances/balanceIndex.vue'),
      meta: {
        title: 'Market Balances',
        description: 'List of all market balances in the cluster',
      },
    }
  ],
}

export default AppRoutes
