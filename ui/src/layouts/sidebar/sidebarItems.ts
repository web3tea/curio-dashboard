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
  IconServer,
  IconSettings,
  IconUsers,
  IconVector,
} from '@tabler/icons-vue'
import { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, ComputedRef } from 'vue'

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

export function useSidebarItems(): ComputedRef<menuItem[]>  {
  const { t } = useI18n()

  const sidebarItems: ComputedRef<menuItem[]> = computed(() =>[
    { header: t('nav.Dashboard'), icon: IconHome },
    {
      title: t('nav.Overview'),
      icon: IconHome,
      to: { name: "Overview" },
    },
    {
      title: t('nav.Analytics'),
      icon: IconChartHistogram,
      to: { name: "Analytics" },
    },
    { header: t('nav.Sealing'), icon: IconBrandAsana },
    {
      title: t('nav.Tasks'),
      icon: IconBrandAsana,
      children: [
        {
          title: t('nav.Running'),
          to: { name: 'RunningTasks' }
        },
        {
          title: t('nav.History'),
          to: { name: "TaskHistory" },
        },
      ],
    },
    {
      title: t('nav.PoRep'),
      icon: IconVector,
      to: { name: "PoRep" },
    },
    {
      title: t('nav.Sectors'),
      icon: IconBox,
      to: { name: "Sectors" },
    },
    {
      title: t('nav.Messages'),
      icon: IconVector,
      to: { name: "MessageSends" },
    },
    { header: t('nav.Mining'), icon: IconUsers },
    {
      title: t('nav.Miners'),
      icon: IconUsers,
      to: { name: "Miners" },
    },
    {
      title: t('nav.Wins'),
      icon: IconCurrency,
      children: [
        {
          title: t('nav.Overview'),
          to: { name: "MiningOverview" },
        },
        {
          title: t('nav.Blocks'),
          to: { name: "MiningTaskList" },
        },
      ],
    },
    { header: t('nav.Market'), icon: IconBuildingStore },
    {
      title: t('nav.Deals'),
      icon: IconContract,
      children: [
        {
          title: t('nav.Pending Pieces'),
          to: { name: "PendingDeals" },
        },
        {
          title: t('nav.MK12 Deals'),
          to: { name: "MarketMk12Deals" }
        }
      ]
    },
    {
      title: t('nav.Settings'),
      icon: IconFilterCog,
      children: [
        {
          title: t('nav.Market Balances'),
          to: { name: "MarketBalances" }
        },
        {
          title: t('nav.Storage Asks'),
          to: { name: "StorageAsks" }
        },
        {
          title: t('nav.Pricing Filters'),
          to: { name: "PricingFilters" }
        },
        {
          title: t('nav.Client Filters'),
          to: { name: "ClientFilters" }
        },
        {
          title: t('nav.Client Allow/Deny'),
          to: { name: "ClientAllows" }
        }
      ],
    },
    { header: t('nav.Cluster'), icon: IconServer },
    {
      title: t('nav.Machines'),
      icon: IconServer,
      to: { name: "Machines" },
    },
    {
      title: t('nav.Storages'),
      icon: IconDatabase,
      to: { name: "Storages" },
    },
    {
      title: t('nav.Configurations'),
      icon: IconSettings,
      to: { name: "Configurations" },
    },
  ])
  return sidebarItems
}
