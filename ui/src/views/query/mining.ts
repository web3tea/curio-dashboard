import gql from 'graphql-tag'

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
