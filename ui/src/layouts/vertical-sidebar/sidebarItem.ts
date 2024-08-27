import {
  BoxIcon,
  ChartHistogramIcon,
  DatabaseIcon,
  HomeIcon,
  ServerIcon,
  SettingsIcon,
  UsersIcon,
  VectorIcon,
} from 'vue-tabler-icons'

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  getURL?: boolean;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
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
    icon: HomeIcon,
    to: '/app/overview',
  },
  {
    title: 'Analytics',
    icon: ChartHistogramIcon,
    to: '/app/analytics',
  },
  { header: 'Sealing' },
  {
    title: 'Miners',
    icon: UsersIcon,
    to: '/app/miners',
  },
  {
    title: 'Pipelines',
    icon: VectorIcon,
    to: '/app/pipelines',
  },
  {
    title: 'Sectors',
    icon: BoxIcon,
    to: '/app/sectors',
  },
  { header: 'Cluster' },
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
]

export default sidebarItem
