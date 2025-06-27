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

export const marketMk12ClientFilterFragment = gql`
  fragment MarketMk12ClientFilterAll on ClientFilter {
    name
    active
    wallets
    peers
    pricingFilters
    maxDealsPerHour
    maxDealSizePerHour
    info
  }`

export const marketMk12DealFragment = gql`
  fragment MarketMk12DealCommon on MarketMk12Deal {
    uuid
    spId
    createdAt
    startEpoch
    endEpoch
    pieceCid
    pieceSize
  }
  fragment MarketMk12DealAll on MarketMk12Deal {
    ...MarketMk12DealCommon
    signedProposalCid
    proposalSignature
    proposal
    offline
    verified
    clientPeerId
    chainDealId
    publishCid
    fastRetrieval
    announceToIpni
    url
    urlHeaders
    error
    label
    proposalCid
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
    marketAddPriceFilter(input: $input)
  }
  `

export const UpdateMarketPriceFilter = gql`
  mutation UpdateMarketPriceFilter($input: PriceFilterInput!) {
    marketUpdatePriceFilter(input: $input) {
      ...MarketMk12PriceFilterAll
    }
  }
  ${marketMk12PriceFilterFragment}
  `

export const CheckMarketPriceFilter = gql`
  query CheckMarketPriceFilter($name: String!) {
    marketCheckPriceFilter(name: $name)
  }
  `

export const DeleteMarketPriceFilter = gql`
  mutation DeleteMarketPriceFilter($name: String!) {
    marketDeletePriceFilter(name: $name)
  }
`

export const GetMarketClientFilters = gql`
  query GetMarketClientFilters {
    marketClientFilters {
      ...MarketMk12ClientFilterAll
    }
  }
  ${marketMk12ClientFilterFragment}
  `

export const AddMarketClientFilter = gql`
  mutation AddMarketClientFilter($input: ClientFilterInput!) {
    marketAddClientFilter(input: $input)
  }
  `

export const UpdateMarketClientFilter = gql`
  mutation UpdateMarketClientFilter($input: ClientFilterInput!) {
    marketUpdateClientFilter(input: $input) {
      ...MarketMk12ClientFilterAll
    }
  }
  ${marketMk12ClientFilterFragment}
  `

export const CheckMarketClientFilter = gql`
  query CheckMarketClientFilter($name: String!) {
    marketCheckClientFilter(name: $name)
  }
  `

export const DeleteMarketClientFilter = gql`
  mutation DeleteMarketClientFilter($name: String!) {
    marketDeleteClientFilter(name: $name)
  }
  `

export const ToggleMarketClientFilter = gql`
  mutation ToggleMarketClientFilter($name: String!) {
    marketToggleClientFilter(name: $name)
  }
  `

export const GetMarketClientAllowList = gql`
  query GetMarketClientAllowList {
    marketAllowFilters {
      wallet
      status
    }
    marketDefaultFilterBehaviour {
      allowDealsFromUnknownClients
      isDealRejectedWhenCidGravityNotReachable
      isCidGravityEnabled {
        miner
        status
      }
    }
  }
  `

export const SetMarketClientAllow = gql`
  mutation SetMarketClientAllow($wallet: Address!, $status: Boolean!) {
    marketSetAllowFilter(wallet: $wallet, status: $status) {
      wallet
      status
    }
  }
  `

export const ToggleMarketClientAllow = gql`
  mutation ToggleMarketClientAllow($wallet: Address!) {
    marketToggleAllowFilter(wallet: $wallet)
  }
  `

export const DeleteMarketClientAllow = gql`
  mutation DeleteMarketClientAllow($wallet: Address!) {
    marketDeleteAllowFilter(wallet: $wallet)
  }
  `

export const GetMarketClientAllow = gql`
  query GetMarketClientAllow($wallet: Address!) {
    marketAllowFilter(wallet: $wallet) {
      wallet
      status
    }
  }
  `

export const GetMarketMk12Deals = gql`
  query GetMarketMk12Deals($filter: MarketMk12DealFilterInput! $offset: Int!, $limit: Int!) {
    marketMk12Deals(filter: $filter, offset: $offset, limit: $limit) {
      ...MarketMk12DealAll
    }
    marketMk12DealsCount(filter: $filter)
  }
  ${marketMk12DealFragment}
  `
