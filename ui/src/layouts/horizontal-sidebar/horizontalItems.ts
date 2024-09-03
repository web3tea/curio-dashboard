import {
  BoxIcon,
  ChartHistogramIcon,
  DatabaseIcon,
  HomeIcon,
  ServerIcon, SettingsIcon, UsersIcon,
  VectorIcon,
} from 'vue-tabler-icons'

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
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
    icon: HomeIcon,
    to: '#',
    children: [
      {
        title: 'Overview',
        icon: HomeIcon,
        to: '/app/overview',
      },
      {
        title: 'Analytics',
        icon: ChartHistogramIcon,
        to: '/app/analytics',
      },
    ],
  },
  {
    title: 'Sealing',
    icon: VectorIcon,
    to: '#',
    children: [
      {
        title: 'Miners',
        icon: UsersIcon,
        to: '/app/miners',
      },
      {
        title: 'PoRep',
        icon: VectorIcon,
        to: '/app/porep',
      },
      {
        title: 'Sectors',
        icon: BoxIcon,
        to: '/app/sectors',
      },
    ],
  },
  {
    title: 'Cluster',
    icon: ServerIcon,
    to: '#',
    children: [
      {
        title: 'Machines',
        icon: ServerIcon,
        to: '/app/machines',
      },
      {
        title: 'Storages',
        icon: DatabaseIcon,
        to: '/app/storages',
      },
      {
        title: 'Configurations',
        icon: SettingsIcon,
        to: '/app/configurations',
      },
    ],
  },
]

export default horizontalItems
