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

export const dealInfoFragment = gql`
  fragment dealInfoAll on DealInfo {
    id
    spId
    announceToIpni
    chainDealId
    clientPeerId
    createdAt
    endEpoch
    error
    fastRetrieval
    indexed
    isDdo
    isLegacy
    miner
    offline
    pieceCid
    pieceSize
    publishCid
    sector
    signedProposalCid
    startEpoch
    url
    urlHeaders
    urls
    verified
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
  mutation DealSealNow($miner: Address!, $sector: Uint64!) {
    dealSealNow(miner: $miner, sectorNumber: $sector)
  }
`

export const GetDealInfo = gql`
  query GetDealInfo($id: String!) {
    marketDealInfo(id: $id) {
      ...dealInfoAll
    }
  }
  ${dealInfoFragment}
  `
