import {
  IconBox,
  IconBrandAsana,
  IconContract,
  IconCurrency,
  IconDatabase,
  IconFilterCog,
  IconHome,
  IconServer,
  IconSettings,
  IconUsers,
  IconVector,
  IconCertificate,
  IconSearch,
  IconShoppingCart
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
    { header: t('nav.Sector Processing'), icon: IconBrandAsana },
    {
      title: t('nav.Tasks'),
      icon: IconBrandAsana,
      children: [
        {
          title: t('nav.Task Overview'),
          to: { name: "TaskOverview" },
        },
        {
          title: t('nav.Active Tasks'),
          to: { name: 'ActiveTasks' }
        },
        {
          title: t('nav.Task History'),
          to: { name: "TaskHistory" },
        }
      ],
    },
    {
      title: t('nav.Sectors'),
      icon: IconBox,
      children: [
        {
          title: t('nav.Overview'),
          to: { name: "Sectors" },
        },
        {
          title: t('nav.PoRep Pipeline'),
          to: { name: "PoRep" },
        },
        {
          title: t('nav.Snap Deals'),
          to: 'Snap Deals',
          disabled: true // todo: add Snap Deals page
        },
        {
          title: t('nav.Unsealing'),
          to: 'Unsealing',
          disabled: true // todo: add Unsealing page
        },
        {
          title: t('nav.Events'),
          to: 'Sectors Events',
          disabled: true // todo: add Sectors Events page
        }
      ]
    },
    {
      title: t('nav.Proofs'),
      icon: IconCertificate,
      children: [
        {
          title: t('nav.WindowPoSt'),
          to: 'WindowPoSt',
          disabled: true // todo: add WindowPoSt page
        },
        {
          title: t('nav.Partition Tasks'),
          to: 'Partition Tasks',
          disabled: true // todo: add Partition Tasks page
        },
        {
          title: t('nav.Recovery Tasks'),
          to: 'Recovery Tasks',
          disabled: true // todo: add Recovery Tasks page
        }
      ]
    },
    {
      title: t('nav.Messages'),
      icon: IconVector,
      to: { name: "MessageSends" },
    },
    { header: t('nav.Market & Deals'), icon: IconShoppingCart },
    {
      title: t('nav.deals'),
      icon: IconContract,
      children: [
        {
          title: t('nav.pendingDeals'),
          to: { name: "PendingDeals" },
        },
        {
          title: t('nav.MK12 Deals'),
          to: { name: "MarketMk12Deals" }
        },
        {
          title: t('nav.Legacy Deals'),
          to: 'Legacy Deals',
          disabled: true // todo: add Legacy Deals page
        },
        {
          title: t('nav.Deal Pipeline'),
          to: 'Deal Pipeline',
          disabled: true // todo: add Deal Pipeline page
        }
      ]
    },
    {
      title: t('nav.IPNI'),
      icon: IconSearch,
      children: [
        {
          title: t('nav.ipni.overview'),
          to: { name: "IPNIOverview" }
        },
        {
          title: t('nav.ipni.advertisements'),
          to: 'advertisements',
          disabled: true // todo: add Advertisements page
        },
        {
          title: t('nav.ipni.providers'),
          to: 'providers',
          disabled: true // todo: add Providers page
        },
        {
          title: t('nav.ipni.tasks'),
          to: 'tasks',
          disabled: true // todo: add Tasks page
        }
      ],
    },
    {
      title: t('nav.Market Settings'),
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
    { header: t('nav.Mining & Network'), icon: IconUsers },
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
    { header: t('nav.System & Management'), icon: IconServer },
    {
      title: t('nav.Machines'),
      icon: IconServer,
      children: [
        {
          title: t('nav.Machine List'),
          to: { name: "Machines" },
        },
        {
          title: t('nav.Resource Usage'),
          to: 'Resource Usage',
          disabled: true // todo: add Resource Usage page
        }
      ]
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
