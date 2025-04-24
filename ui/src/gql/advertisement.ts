import gql from 'graphql-tag'

export const GetAdvertisements = gql`
  query GetAdvertisements($offset: Int!, $limit: Int!, $provider: String, $isSkip: Boolean, $isRemoved: Boolean) {
  ipniAdvertisements(
    offset: $offset
    limit: $limit
    provider: $provider
    isSkip: $isSkip
    isRemoved: $isRemoved
  ) {
    orderNumber
    pieceCid
    adCid
    contextId
    pieceSize
    provider {
      peerID
      spID
    }
    entries
    addresses
    isSkip
    isRm
  }
  ipniAdvertisementsCount(
    provider: $provider
    isSkip: $isSkip
    isRemoved: $isRemoved
  )
}
`
