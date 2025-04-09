import { defineStore } from 'pinia'
import gql from 'graphql-tag'
import { computed, ComputedRef } from 'vue'
import { Metadata } from '@/typed-graph'
import { useQuery } from '@vue/apollo-composable'

export const GetMetadata = gql`
  query GetMetadata {
    metadata {
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

export const useMetadataStore = defineStore('metadata', () => {
  const { result } = useQuery(GetMetadata, null, {
    fetchPolicy: 'cache-and-network',
  })

  const global: ComputedRef<Metadata> = computed(() => result.value?.metadata || {})

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
