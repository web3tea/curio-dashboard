import {
  IconBox,
  IconBrandAsana,
  IconChartHistogram,
  IconCurrency,
  IconDatabase,
  IconHome,
  IconParking,
  IconServer,
  IconSettings,
  IconUsers,
  IconVector,
} from '@tabler/icons-vue'

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  getURL?: boolean;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: NonNullable<'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'> | undefined;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Dashboard' },
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
  { header: 'Sealing' },
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
  { header: 'Mining' },
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
  { header: 'Cluster' },
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

export default sidebarItem
