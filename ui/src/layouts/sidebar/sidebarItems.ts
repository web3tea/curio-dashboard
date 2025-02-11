import {
  IconBox,
  IconBrandAsana,
  IconBuildingStore,
  IconChartHistogram,
  IconContract,
  IconCurrency,
  IconDatabase,
  IconFilterCog,
  IconHome,
  IconParking,
  IconServer,
  IconSettings,
  IconUsers,
  IconVector,
} from '@tabler/icons-vue'
import { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router'

export interface menuItem {
  header?: string;
  title?: string;
  icon?: object;
  to?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
  getURL?: boolean;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: NonNullable<'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'> | undefined;
  chipIcon?: string;
  children?: menuItem[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItems: menuItem[] = [
  { header: 'Dashboard', icon: IconHome },
  {
    title: 'Overview',
    icon: IconHome,
    to: { name: "Overview" },
  },
  {
    title: 'Analytics',
    icon: IconChartHistogram,
    to: { name: "Analytics" },
  },
  { header: 'Sealing', icon: IconBrandAsana },
  {
    title: 'Tasks',
    icon: IconBrandAsana,
    children: [
      {
        title: 'Running',
        to: { name: 'RunningTasks' }
      },
      {
        title: 'History',
        to: { name: "TaskHistory" },
      },
    ],
  },
  {
    title: 'PoRep',
    icon: IconVector,
    to: { name: "PoRep" },
  },
  {
    title: 'Sectors',
    icon: IconBox,
    to: { name: "Sectors" },
  },
  {
    title: 'Deals',
    icon: IconParking,
    to: { name: "PendingDeals" },
  },
  {
    title: 'Messages',
    icon: IconVector,
    to: { name: "MessageSends" },
  },
  { header: 'Mining', icon: IconUsers },
  {
    title: 'Miners',
    icon: IconUsers,
    to: { name: "Miners" },
  },
  {
    title: "Wins",
    icon: IconCurrency,
    children: [
      {
        title: 'Overview',
        to: { name: "MiningOverview" },
      },
      {
        title: 'Blocks',
        to: { name: "MiningTaskList" },
      },
    ],
  },
  { header: 'Market', icon: IconBuildingStore },
  {
    title: 'Deals',
    icon: IconContract,
    children: [
      {
        title: 'MK12 Deals',
        to: { name: "MarketMk12Deals" }
      }
    ]
  },
  {
    title: 'Settings',
    icon: IconFilterCog,
    children: [
      {
        title: 'Market Balances',
        to: { name: "MarketBalances" }
      },
      {
        title: 'Storage Asks',
        to: { name: "StorageAsks" }
      },
      {
        title: 'Pricing Filters',
        to: { name: "PricingFilters" }
      },
      {
        title: 'Client Filters',
        to: { name: "ClientFilters" }
      },
      {
        title: 'Client Allow/Deny',
        to: { name: "ClientAllows" }
      }
    ],
  },
  { header: 'Cluster', icon: IconServer },
  {
    title: 'Machines',
    icon: IconServer,
    to: { name: "Machines" },
  },
  {
    title: 'Storages',
    icon: IconDatabase,
    to: { name: "Storages" },
  },
  {
    title: 'Configurations',
    icon: IconSettings,
    to: { name: "Configurations" },
  },
]

export default sidebarItems
