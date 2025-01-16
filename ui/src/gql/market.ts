import { gql } from "graphql-tag"

export const marketMk12StorageAskFragment = gql`
  fragment MarketMk12StorageAskAll on MarketMk12StorageAsk {
    spId
    price
    verifiedPrice
    minSize
    maxSize
    createdAt
    expiry
    sequence
  }
`

export const GetMarketMk12StorageAsks = gql`
  query GetMarketMk12StorageAsks {
    marketMk12StorageAsks {
      ...MarketMk12StorageAskAll
    }
  }
  ${marketMk12StorageAskFragment}
  `

export const GetMarketMk12StorageAsk = gql`
  query GetMarketMk12StorageAsk($spId: ActorID!) {
    marketMk12StorageAsk(spId: $spId) {
      ...MarketMk12StorageAskAll
    }
  }
  ${marketMk12StorageAskFragment}
  `

export const UpdateMarketMk12StorageAsk = gql`
  mutation UpdateMarketMk12StorageAsk($input: MarketMk12StorageAskInput!) {
    updateMarketMk12StorageAsk(input: $input) {
      ...MarketMk12StorageAskAll
    }
  }
  ${marketMk12StorageAskFragment}
  `
