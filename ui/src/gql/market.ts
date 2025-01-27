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

export const marketMk12PriceFilterFragment = gql`
  fragment MarketMk12PriceFilterAll on PriceFilter {
    name
    minDurationDays
    maxDurationDays
    minimumSize
    maximumSize
    price
    verified
  }`

export const GetMarketMk12StorageAsks = gql`
  query GetMarketMk12StorageAsks {
    marketMk12StorageAsks {
      ...MarketMk12StorageAskAll
    }
  }
  ${marketMk12StorageAskFragment}
  `

export const GetMarketMk12StorageAsk = gql`
  query GetMarketMk12StorageAsk($spId: Address!) {
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

export const marketBalanceFragment = gql`
  fragment MarketBalanceAll on MarketBalance {
    miner
    balance
    balances {
      address
      balance
    }
  }
`

export const GetMarketBalances = gql`
  query GetMarketBalances {
    marketBalances {
      ...MarketBalanceAll
    }
  }
  ${marketBalanceFragment}
`

export const AddMarketBalance = gql`
  mutation AddMarketBalance($miner: Address!, $amount: FIL!, $wallet: Address!) {
    marketAddBalance(miner: $miner, amount: $amount, wallet: $wallet) {
      ...MarketBalanceAll
    }
  }
  ${marketBalanceFragment}
`

export const GetMarketPriceFilters = gql`
  query GetMarketPriceFilters {
    makretPriceFilters {
      ...MarketMk12PriceFilterAll
    }
  }
  ${marketMk12PriceFilterFragment}
  `

export const AddMarketPriceFilter = gql`
  mutation AddMarketPriceFilter($input: PriceFilterInput!) {
    marketAddPriceFilter(input: $input) {
      ...MarketMk12PriceFilterAll
    }
  }
  `
