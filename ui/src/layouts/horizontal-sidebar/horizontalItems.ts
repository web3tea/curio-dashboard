import {
  IconBox, IconBrandAsana,
  IconChartHistogram, IconCurrency,
  IconDatabase,
  IconHome, IconParking,
  IconServer, IconSettings, IconUsers,
  IconVector,
} from '@tabler/icons-vue'

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: NonNullable<'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'> | undefined;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  subCaption?: string;
  class?: string;
  extraclass?: string;
  type?: string;
}

const horizontalItems: menu[] = [
  {
    title: 'Dashboard',
    icon: IconHome,
    to: '#',
    children: [
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
    ],
  },
  {
    title: 'Sealing',
    icon: IconVector,
    to: '#',
    children: [
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
    ],
  },
  {
    title: 'Mining',
    icon: IconVector,
    to: '#',
    children: [
      {
        title: 'Win Blocks',
        icon: IconCurrency,
        to: '/app/mining/wins',
      },
    ],
  },
  {
    title: 'Cluster',
    icon: IconServer,
    to: '#',
    children: [
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
    ],
  },
]

export default horizontalItems
