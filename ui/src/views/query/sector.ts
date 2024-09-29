import gql from 'graphql-tag'
import { taskFragment, taskHistoryFragment } from '@/views/query/task'
import { porepAllFragment } from '@/views/query/porep'

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

const locationFragment = gql`
  fragment LocationAll on SectorLocation {
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
  query GetSectors($miner: ActorID, $sectorNumber: Int, $offset: Int!, $limit: Int!) {
    sectors(actor: $miner, sectorNumber: $sectorNumber, offset: $offset, limit: $limit) {
      id
      meta {
        ...MetaAll
      }
      locations {
        ...LocationAll
      }
    }
    sectorsCount(actor: $miner)
    actors {
      address
    }
  }
  ${metaFragment}
  ${locationFragment}
`

export const GetSectorMeta = gql`
  query GetSectorMeta($miner: ActorID!, $sectorNumber: Int!) {
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
  query GetSectorPoRep($miner: ActorID!, $sectorNumber: Int!) {
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
  query GetSectorPieces($miner: ActorID!, $sectorNumber: Int!) {
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
  query GetSectorLocations($miner: ActorID!, $sectorNumber: Int!) {
    sector(actor: $miner, sectorNumber: $sectorNumber) {
      id
      locations {
        ...LocationAll
      }
    }
  }
  ${locationFragment}
`

export const GetSectorEvents = gql`
  query GetSectorEvents($miner: ActorID!, $sectorNumber: Int!) {
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
    query GetSectorTasks($miner: ActorID!, $sectorNumber: Int!) {
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
    mutation RemoveSector($miner: ActorID!, $sectorNumber: Int!) {
      removeSector(miner: $miner, sectorNumber: $sectorNumber)
    }
`
