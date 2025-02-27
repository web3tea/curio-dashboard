import gql from 'graphql-tag'

const pieceMetadataFragment = gql`
  fragment MarketPieceMetadataAll on MarketPieceMetadata {
    pieceCid
    pieceSize
    version
    createdAt
    indexed
    indexedAt
  }
`

const pieceDealFragment = gql`
  fragment MarketPieceDealAll on MarketPieceDeal {
    id
    pieceCid
    boostDeal
    legacyDeal
    chainDealId
    spId
    sectorNum
    pieceOffset
    pieceLength
    rawSize
  }
`

export const GetMarketPieceInfo = gql`
  query GetMarketPieceMetadata($id: Cid!) {
    marketPieceInfo(id: $id) {
      metadata {
        ...MarketPieceMetadataAll
      }
      deals {
        ...MarketPieceDealAll
      }
    }
  }
  ${pieceMetadataFragment}
  ${pieceDealFragment}
`
