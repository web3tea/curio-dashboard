import gql from 'graphql-tag'

export const GetStoragePaths = gql`
  query GetStoragePaths {
    storagePaths {
      id
      storageId
      urls
      weight
      maxStorage
      canSeal
      canStore
      type
      groups
      allowTo
      allowTypes
      denyTypes
      capacity
      available
      fsAvailable
      reserved
      used
      lastHeartbeat
      heartbeatErr
      allowMiners
      denyMiners
    }
  }`

export const GetStorageStats = gql`
  query GetStorageStats {
    storageStats {
      type
      totalAvailable
      totalCapacity
      totalFsAvailable
      totalReserved
      totalUsed
    }
  }`
