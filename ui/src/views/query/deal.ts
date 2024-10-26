import gql from 'graphql-tag'

export const dealsPendingFragment = gql`
  fragment dealsPendingAll on OpenSectorPiece {
    spID
    sectorNumber
    pieceIndex
    pieceCID
    pieceSize
    dataURL
    dataHeaders
    dataRawSize
    dataDeleteOnFinalize
    f05PublishCID
    f05DealID
    f05DealProposal
    f05DealStartEpoch
    f05DealEndEpoch
    directStartEpoch
    directEndEpoch
    directPieceActivationManifest
    createdAt
    isSnap
  }
`

export const GetPendingDeals = gql`
  query GetPendingDeals {
    dealsPending {
      ...dealsPendingAll
    }
  }
  ${dealsPendingFragment}
`

export const DealSealNow = gql`
  mutation DealSealNow($miner: ActorID!, $sector: Uint64!) {
    dealSealNow(miner: $miner, sectorNumber: $sector)
  }
`
