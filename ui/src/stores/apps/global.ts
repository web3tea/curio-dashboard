import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { computed, ComputedRef } from 'vue'
import { Global } from '@/typed-graph'
import { useQuery } from '@vue/apollo-composable'

export const GetGlobal = gql`
  query GetGlobal {
    global {
      networkName
      genesisTimestamp
    }
  }
`

const networkInfos = {
  mainnet: {
    name: 'Mainnet',
    addressPrefix: 'f',
    genesisTimestamp: new Date('2020-08-24T22:00:00Z').getTime(),
  },
  calibrationnet: {
    name: 'Testnet',
    addressPrefix: 't',
    genesisTimestamp: new Date('2022-11-01T18:13:00Z').getTime(),
  },
}

export const useGlobalStore = defineStore('global', () => {
  const { result } = useQuery(GetGlobal, null, {
    fetchPolicy: 'cache-first',
  })

  const global: ComputedRef<Global> = computed(() => result.value?.global || {})

  const networkInfo = computed(() => {
    return networkInfos[global.value.networkName as keyof typeof networkInfos] || networkInfos.mainnet
  })

  function epochToTime (epoch: number): Date {
    const epochTime = (networkInfo.value.genesisTimestamp + epoch * 30000)
    return new Date(epochTime)
  }

  return {
    epochToTime,
  }
})
