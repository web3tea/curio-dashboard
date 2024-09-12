import gql from 'graphql-tag'

export const storagePathFragment = gql`
  fragment StoragePathAll on StoragePath {
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
  }`

export const GetStoragePaths = gql`
  query GetStoragePaths {
    storagePaths {
      ...StoragePathAll
    }
  }
  ${storagePathFragment}
`

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
