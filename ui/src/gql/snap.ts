import { gql } from '@apollo/client/core'

export const GetSnapSectors = gql`
  query GetSnapSectors($miner: Address, $sectorNumber: Int, $offset: Int!, $limit: Int!) {
    snapSectors(actor: $miner, sectorNumber: $sectorNumber, offset: $offset, limit: $limit) {
      spID
      sectorNumber
      startTime
      upgradeProof
      dataAssigned
      updateUnsealedCid
      updateSealedCid
      taskIdEncode
      afterEncode
      proof
      taskIdProve
      afterProve
      proveMsgCid
      taskIdSubmit
      afterSubmit
      afterProveMsgSuccess
      proveMsgTsk
      taskIdMoveStorage
      afterMoveStorage
      failed
      failedAt
      failedReason
      failedReasonMsg
      submitAfter
      updateReadyAt
    }
    snapSectorsCount(actor: $miner)
  }
`

export const GetSnapSummary = gql`
  query GetSnapSummary {
    snapSummary {
      encoding
      proving
      submitting
      moveStorage
      failed
      completed
    }
  }
`

export const GetSnapSectorDetails = gql`
  query GetSnapSectorDetails($spId: Address!, $sectorNumber: Int!) {
    snapSectors(actor: $spId, sectorNumber: $sectorNumber, offset: 0, limit: 1) {
      spID
      sectorNumber
      startTime
      upgradeProof
      dataAssigned
      updateUnsealedCid
      updateSealedCid
      taskIdEncode
      afterEncode
      proof
      taskIdProve
      afterProve
      proveMsgCid
      taskIdSubmit
      afterSubmit
      afterProveMsgSuccess
      proveMsgTsk
      taskIdMoveStorage
      afterMoveStorage
      failed
      failedAt
      failedReason
      failedReasonMsg
      submitAfter
      updateReadyAt
      meta {
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
        deadline
        partition
      }
      pieces {
        spID
        sectorNumber
        createdAt
        pieceIndex
        pieceCid
        pieceSize
        dataUrl
        dataHeaders
        dataRawSize
        dataDeleteOnFinalize
        directStartEpoch
        directEndEpoch
        directPieceActivationManifest
      }
    }
  }
`