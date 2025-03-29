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
    query GetMiningWinsCount($start: Time!, $end: Time!, $miner: Address) {
      miningWinsCount(start: $start, end: $end, actor: $miner, include: true)
    }
`

export const GetMiningWins = gql`
    query GetMiningWins($start: Time, $end: Time, $miner: Address, $include: Boolean, $offset: Int!, $limit: Int!) {
        miningWins(start: $start, end: $end, actor: $miner, include: $include, offset: $offset, limit: $limit) {
            ...MiningTaskAll
        }
        miningWinsCount(start: $start, end: $end, actor: $miner, include: $include)
    }
    ${miningFragment}
`

const miningCountFragment = gql`
  fragment MiningCount on MiningCountSummary {
    start
    end
    total
    won
    included
  }
`

export const GetMiningCountSummary = gql`
    query GetMiningCountSummary($start: Time!, $end: Time!, $miner: Address) {
        miningCountSummary(start: $start, end: $end, actor: $miner) {
          ...MiningCount
        }
    }
    ${miningCountFragment}
`

export const GetMiningCountSummaryWithPrevious = gql`
    query GetMiningCountSummaryWithPrevious($start: Time!, $end: Time!, $miner: Address) {
        miningCountSummary(start: $start, end: $end, actor: $miner) {
          ...MiningCount
          previous {
            ...MiningCount
          }
        }
    }
    ${miningCountFragment}`

export const GetMiningCountAggregation = gql`
    query GetMiningCountAggregation($start: Time!, $end: Time!, $miner: Address, $interval: MiningTaskAggregateInterval!) {
        miningCountAggregate(start: $start, end: $end, actor: $miner, interval: $interval) {
          time
          total
          won
          included
        }
    }
`

export const GetMiningStatusSummary = gql`
  query MiningStatusSummary($spID: ActorID, $start: Time!, $end: Time!) {
    miningStatusSummay(spID: $spID, start: $start, end: $end) {
      total
      won
      included
      lastMinedAt
      wonChangeRate
    }
  }
  `
