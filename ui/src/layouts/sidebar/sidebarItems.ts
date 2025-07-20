import {
  IconBox,
  IconBrandAsana,
  IconContract,
  IconStars,
  IconDatabase,
  IconFilterCog,
  IconHome,
  IconServer,
  IconSettings,
  IconUsers,
  IconSend,
  IconCertificate,
  IconBrandGoogleAnalytics,
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
          title: t('nav.Overview'),
          to: { name: "TaskOverview" },
        },
        {
          title: t('nav.Active'),
          to: { name: 'ActiveTasks' }
        },
        {
          title: t('nav.History'),
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
          title: t('nav.PoRep'),
          to: { name: "PoRep" },
        },
        {
          title: t('nav.Snap'),
          to: { name: "Snap" },
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
          to: { name: "Wdpost" },
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
      icon: IconSend,
      children: [
        {
          title: t('nav.messagePending'),
          to: { name: "MessagePendings" },
        },
        {
          title: t('nav.messageHistory'),
          to: { name: "MessageHistory" },
        },
      ],
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
      icon: IconBrandGoogleAnalytics,
      children: [
        {
          title: t('nav.ipni.overview'),
          to: { name: "IPNIOverview" }
        },
        {
          title: t('nav.ipni.advertisements'),
          to: { name: "IPNIAdvertisements" },
        },
        {
          title: t('nav.ipni.providers'),
          to: { name: "IPNIProviders" },
        },
        {
          title: t('nav.ipni.tasks'),
          to: { name: "IPNITasks" },
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
      icon: IconStars,
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
