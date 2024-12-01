import gql from 'graphql-tag'

const miningFragment = gql`
  fragment MiningTaskAll on MiningTask {
    taskId
    spId
    epoch
    baseComputeTime
    won
    minedCid
    minedHeader
    minedAt
    submittedAt
    included
  }
`

export const GetMiningSummary = gql`
  query GetMiningSummary($start: Time!, $end: Time!) {
    miningSummaryByDay(start: $start, end: $end) {
      day
      miner
      wonBlock
    }
  }
`

export const GetMiningWinsCount = gql`
    query GetMiningWinsCount($start: Time!, $end: Time!, $miner: ActorID) {
      miningWinsCount(start: $start, end: $end, actor: $miner, include: true)
    }
`

export const GetMiningWins = gql`
    query GetMiningWins($start: Time, $end: Time, $miner: ActorID, $include: Boolean, $offset: Int!, $limit: Int!) {
        miningWins(start: $start, end: $end, actor: $miner, include: $include, offset: $offset, limit: $limit) {
            ...MiningTaskAll
        }
        miningWinsCount(start: $start, end: $end, actor: $miner, include: $include)
    }
    ${miningFragment}
`
