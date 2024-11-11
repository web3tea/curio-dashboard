import {
  IconBox, IconBrandAsana,
  IconChartHistogram, IconCurrency,
  IconDatabase,
  IconHome, IconParking,
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
    title: 'Miners',
    icon: IconUsers,
    to: '/app/miners',
  },
  {
    title: 'Tasks',
    icon: IconBrandAsana,
    to: '/app/tasks',
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
  { header: 'Mining' },
  {
    title: 'Win Blocks',
    icon: IconCurrency,
    to: '/app/mining/wins',
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
