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

export const GetMiningBlockCount = gql`
    query GetMiningBlockCount($start: Time!, $end: Time!, $miner: ActorID) {
        miningCount(start: $start, end: $end, actor: $miner) {
          include
          exclude
        }
    }
`

export const GetMiningWins = gql`
    query GetMiningWins($miner: ActorID, $include: Boolean, $offset: Int!, $limit: Int!) {
        miningWins(actor: $miner, include: $include, offset: $offset, limit: $limit) {
            ...MiningTaskAll
        }
    }
    ${miningFragment}
`
