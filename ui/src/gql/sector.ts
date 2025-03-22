import gql from 'graphql-tag'
import { taskFragment, taskHistoryFragment } from '@/gql/task'
import { porepAllFragment } from '@/gql/porep'

const metaFragment = gql`
  fragment MetaAll on SectorMeta {
    id
    spId
    sectorNum
    regSealProof
    ticketEpoch
    ticketValue
    origSealedCid
    origUnsealedCid
    curSealedCid
    curUnsealedCid
    msgCidPrecommit
    msgCidCommit
    msgCidUpdate
    seedEpoch
    seedValue
    expirationEpoch
    isCC
  }
`

const locationPrimaryFragment = gql`
  fragment LocationPrimary on SectorLocation {
    minerId
    sectorNum
    sectorFiletype
    storageId
    isPrimary
    readTs
    readRefs
    writeTs
    writeLockOwner
  }
`

export const GetSectors = gql`
  query GetSectors($miner: Address, $sectorNumber: Int, $offset: Int!, $limit: Int!) {
    sectors(actor: $miner, sectorNumber: $sectorNumber, offset: $offset, limit: $limit) {
      id
      sectorNum
      spID
      meta {
        ...MetaAll
      }
      locations {
        ...LocationPrimary
      }
    }
    sectorsCount(actor: $miner)
  }
  ${metaFragment}
  ${locationPrimaryFragment}
`

export const GetSectorMeta = gql`
  query GetSectorMeta($miner: Address!, $sectorNumber: Int!) {
    sector(actor: $miner, sectorNumber: $sectorNumber) {
      id
      status
      meta {
        ...MetaAll
      }
    }
  }
  ${metaFragment}
`

export const GetSectorPoRep = gql`
  query GetSectorPoRep($miner: Address!, $sectorNumber: Int!) {
    sector(actor: $miner, sectorNumber: $sectorNumber) {
      id
      porep {
        ...PorepAll
      }
    }
  }
  ${porepAllFragment}
`

export const GetSectorPieces = gql`
  query GetSectorPieces($miner: Address!, $sectorNumber: Int!) {
    sector(actor: $miner, sectorNumber: $sectorNumber) {
      id
      pieces {
        spID
        sectorNum
        pieceNum
        pieceCID
        pieceSize
        requestedKeepData
        rawDataSize
        startEpoch
        origEndEpoch
        f05DealID
        ddoPam
        f05DealProposal
      }
    }
  }
`

export const GetSectorLocations = gql`
  query GetSectorLocations($miner: Address!, $sectorNumber: Int!) {
    sector(actor: $miner, sectorNumber: $sectorNumber) {
      id
      locations {
        ...LocationPrimary
        storage {
          path {
            storageId
            urls
            lastHeartbeat
            heartbeatErr
          }
        }
      }
    }
  }
  ${locationPrimaryFragment}
`

export const GetSectorEvents = gql`
  query GetSectorEvents($miner: Address!, $sectorNumber: Int!) {
    sector(actor: $miner, sectorNumber: $sectorNumber) {
      id
      events {
        ...TaskHistoryAll
      }
    }
  }
  ${taskHistoryFragment}
`

export const GetSectorTasks = gql`
    query GetSectorTasks($miner: Address!, $sectorNumber: Int!) {
      sector(actor: $miner, sectorNumber: $sectorNumber) {
        id
        spID
        sectorNum
        tasks {
          ...TaskAll
        }
      }
    }
    ${taskFragment}
`

export const RemoveSector = gql`
    mutation RemoveSector($miner: Address!, $sectorNumber: Int!) {
      removeSector(miner: $miner, sectorNumber: $sectorNumber)
    }
`

export const RestartSector = gql`
  mutation RestartSector($miner: Address!, $sectorNumber: Int!) {
    restartSector(miner: $miner, sectorNumber: $sectorNumber)
  }
`

export const RestartAllFailedSector = gql`
  mutation RestartAllFailedSector {
    restartAllFailedSectors
  }
`

export const GetSectorSummary = gql`
  query SectorSummary {
    sectorSummary {
      active
      sealing
      failed
    }
  }
  `
