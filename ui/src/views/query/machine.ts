import gql from 'graphql-tag'

export const GetMachines = gql`
  query GetMachines {
    machines {
      id
      lastContact
      cpu
      gpu
      ram
      hostAndPort
      detail {
        machineName
        startupTime
        layers
        miners
        tasks
      }
    }
  }
`

export const GetMachinesSummary = gql`
  query GetMachinesSummary {
    machineSummary {
      total
      totalUp
      totalDown
      totalCpu
      totalGpu
      totalRam
    }
  }
`
