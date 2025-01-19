import {
  IconBox,
  IconBrandAsana,
  IconBuildingStore,
  IconChartHistogram,
  IconPointFilled,
  IconCurrency,
  IconDatabase,
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
  { header: 'Dashboard', icon:  IconHome },
  {
    title: 'Overview',
    icon: IconHome,
    to: '/app/overview',
  },
  {
    title: 'Analytics',
    icon: IconChartHistogram,
    to: '/app/analytics',
  },
  { header: 'Sealing', icon: IconBrandAsana },
  {
    title: 'Tasks',
    icon: IconBrandAsana,
    children: [
      {
        title: 'Running',
        to: '/app/running-tasks',
      },
      {
        title: 'History',
        to: '/app/task-history',
      },
    ],
  },
  {
    title: 'PoRep',
    icon: IconVector,
    to: '/app/porep',
  },
  {
    title: 'Sectors',
    icon: IconBox,
    to: '/app/sectors',
  },
  {
    title: 'Deals',
    icon: IconParking,
    to: '/app/deals/pending',
  },
  {
    title: 'Messages',
    icon: IconVector,
    to: '/app/messages/sends',
  },
  { header: 'Mining', icon: IconUsers },
  {
    title: 'Miners',
    icon: IconUsers,
    to: '/app/miners',
  },
  {
    title: "Wins",
    icon: IconCurrency,
    children: [
      {
        title: 'Overview',
        to: '/app/mining/overview',
      },
      {
        title: 'Blocks',
        to: '/app/mining/wins',
      },
    ],
  },
  { header: 'Market', icon: IconBuildingStore },
  {
    title: 'Market',
    icon: IconBuildingStore,
    children: [
      {
        title: 'Storage Asks',
        to: '/app/market/storage-asks',
        icon: IconPointFilled,
      },
      {
        title: 'Balances',
        to: { name: "MarketBalances" },
        icon: IconPointFilled,
      },
    ]
  },
  { header: 'Cluster', icon: IconServer },
  {
    title: 'Machines',
    icon: IconServer,
    to: '/app/machines',
  },
  {
    title: 'Storages',
    icon: IconDatabase,
    to: '/app/storages',
  },
  {
    title: 'Configurations',
    icon: IconSettings,
    to: '/app/configurations',
  },
]

export default sidebarItems
