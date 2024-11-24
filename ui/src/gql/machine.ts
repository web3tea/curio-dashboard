import gql from 'graphql-tag'
import { taskFragment } from '@/gql/task'
import { storagePathFragment } from '@/gql/storage'

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

export const machineMetricsFragment = gql`
  fragment MachineMetricsAll on MachineMetrics {
    cpuUsage
    gpuUsage
    ramUsage
    activeTasks {
      key
      value
    }
    addedTasks {
      key
      value
    }
    tasksCompleted {
      key
      value
    }
    tasksStarted {
      key
      value
    }
    goRoutines
    goVersion
    goThreads
    processCpuSecondsTotal
    processStartTimeSeconds
    processVirtualMemoryBytes
    processResidentMemoryBytes
    processOpenFds
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

export const GetMachineInfo = gql`
    query GetMachineMetrics($id: Int!) {
      machine(id: $id) {
        ...MachineBaseAll
        metrics {
          ...MachineMetricsAll
        }
        detail {
          ...MachineDetailAll
        }
      }
    }
    ${machineMetricsFragment}
    ${machineBaseFragment}
    ${machineDetailFragment}
`

export const GetMachinesBase = gql`
    query GetMachinesBase {
      machines {
        ...MachineBaseAll
      }
    }
    ${machineBaseFragment}
`
