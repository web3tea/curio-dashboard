import { RouteLocationNormalizedLoaded } from 'vue-router'
import { parseBoolean, parseNumber } from '@/utils/helpers/routeParamsParser'

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
      component: () => import('@/views/storages/paths/StorageIndex.vue'),
      meta: {
        title: 'Storage Paths',
        description: 'List of all storages paths in the cluster',
      },
    },

    {
      name: 'PoRep',
      path: '/pipeline/porep',
      component: () => import('@/views/porep/PorepIndex.vue'),
      meta: {
        title: 'PoRep Pipeline',
        description: "PoRep pipeline's status",
      },
    },
    {
      name: 'ActiveTasks',
      path: '/tasks/active',
      component: () => import('@/views/task/active/ActiveTaskIndex.vue'),
      meta: {
        title: 'Active Tasks',
        description: 'List of all active tasks in the cluster',
      },
    },
    {
      name: 'TaskHistory',
      path: '/tasks/history',
      component: () => import('@/views/task/history/TaskHistoryIndex.vue'),
      props: (route: RouteLocationNormalizedLoaded) => ({
        start: parseNumber(route.query.start),
        end: parseNumber(route.query.end),
        name: route.query.name,
        machine: route.query.machine,
        success: parseBoolean(route.query.success),
      }),
      meta: {
        title: 'Task History',
        description: 'List of all task history in the cluster',
      },
    },
    {
      name: 'TaskOverview',
      path: '/tasks/overview',
      component: () => import('@/views/task/overview/TaskOverviewIndex.vue'),
      meta: {
        title: 'Task Overview',
        description: 'Overview of the tasks in the cluster',
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
      props: (route: RouteLocationNormalizedLoaded) => ({
        miner: route.params.miner,
        sectorNumber: parseNumber(route.params.sectorNumber)
      }),
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
      path: '/market/pending-pieces',
      component: () => import('@/views/market/deals/pending/PendingDealIndex.vue'),
      meta: {
        title: 'Pending Pieces',
        description: 'List of all pending pieces in the cluster',
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
      component: () => import('@/views/market/balances/BalanceIndex.vue'),
      meta: {
        title: 'Market Balances',
        description: 'List of all market balances in the cluster',
      },
    },
    {
      name: "PricingFilters",
      path: "/market/filters/price",
      component: () => import('@/views/market/filter/price/PriceFilterIndex.vue'),
      meta: {
        title: 'Pricing Filters',
        description: 'Market pricing filters',
      },
    },
    {
      name: "ClientFilters",
      path: "/market/filters/client",
      component: () => import('@/views/market/filter/client/ClientFilterIndex.vue'),
      meta: {
        title: 'Client Filters',
        description: 'Market client filters',
      },
    },
    {
      name: "ClientAllows",
      path: "/market/filters/client-allow",
      component: () => import('@/views/market/filter/clientAllow/ClientAllowIndex.vue'),
      meta: {
        title: 'Client Allows',
        description: 'Market client allows',
      },
    },
    {
      name: "MarketMk12Deals",
      path: "/market/mk12-deals",
      component: () => import('@/views/market/deals/mk12/Mk12DealIndex.vue'),
      meta: {
        title: 'MK12 Deals',
        description: 'Market Mk12 deals',
      },
    },
    {
      name: "MakretDealInfo",
      path: "/market/deals/:id",
      component: () => import('@/views/market/deals/detail/DealDetailIndex.vue'),
      props: true,
      meta: {
        title: 'Deal Info',
        description: 'Market deal info',
      },
    },
    {
      name: "IPNIOverview",
      path: "/ipni",
      component: () => import('@/views/ipni/overview/IPNIOverviewIndex.vue'),
      meta: {
        title: 'IPNI Overview',
        description: 'InterPlanetary Network Indexer',
      },
    },
    {
      name: "IPNIAdvertisements",
      path: "/ipni/advertisements",
      component: () => import('@/views/ipni/advertisements/AdvertisementsIndex.vue'),
      meta: {
        title: 'IPNI Advertisements',
        description: 'InterPlanetary Network Indexer Ads',
      },
    },
    {
      name: "IPNIProviders",
      path: "/ipni/providers",
      component: () => import('@/views/ipni/providers/ProvidersIndex.vue'),
      meta: {
        title: 'IPNI Providers',
        description: 'InterPlanetary Network Indexer Providers',
      },
    },
    {
      name: "IPNITasks",
      path: "/ipni/tasks",
      component: () => import('@/views/ipni/tasks/TasksIndex.vue'),
      meta: {
        title: "IPNI Tasks",
        description: ""
      }
    }
  ],
}

export default AppRoutes
