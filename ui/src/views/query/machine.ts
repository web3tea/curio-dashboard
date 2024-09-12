import gql from 'graphql-tag'
import { taskFragment } from '@/views/query/task'
import { storagePathFragment } from '@/views/query/storage'

export const machineDetailFragment = gql`
  fragment MachineDetailAll on MachineDetail {
    machineName
    startupTime
    layers
    miners
    tasks
  }
`

export const machineBaseFragment = gql`
  fragment MachineBaseAll on Machine {
    id
    lastContact
    cpu
    gpu
    ram
    hostAndPort
  }
`

export const GetMachines = gql`
  query GetMachines {
    machines {
      ...MachineBaseAll
      detail {
        ...MachineDetailAll
      }
    }
  }
  ${machineBaseFragment}
  ${machineDetailFragment}
`

export const GetMachine = gql`
    query GetMachine($id: Int!) {
      machine(id: $id) {
        ...MachineBaseAll
        detail {
          ...MachineDetailAll
        }
      }
    }
    ${machineBaseFragment}
    ${machineDetailFragment}
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

export const GetMachineTasks = gql`
    query GetMachineTasks($id: Int!) {
      machine(id: $id) {
        id
        tasks {
          ...TaskAll
        }
      }
    }
    ${taskFragment}
`

export const GetMachineStorages = gql`
    query GetMachineStorages($id: Int!) {
      machine(id: $id) {
        id
        storages {
          ...StoragePathAll
        }
      }
    }
    ${storagePathFragment}
`
