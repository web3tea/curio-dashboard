import gql from 'graphql-tag'

export const wdpostProofsFragment = gql`
  fragment WdpostProofsAll on WdpostProofs {
    id
    spId
    provingPeriodStart
    deadline
    partition
    submitAtEpoch
    submitByEpoch
    proofParams
    submitTaskId
    messageCid
    testTaskId
  }
`

export const GetWdpostProofs = gql`
  query GetWdpostProofs($spId: Address, $offset: Int!, $limit: Int!) {
    wdpostProofs(spId: $spId, offset: $offset, limit: $limit) {
      ...WdpostProofsAll
    }
    wdpostProofsCount(spId: $spId)
  }
  ${wdpostProofsFragment}
`

export const GetWdpostProof = gql`
  query GetWdpostProof($spId: Address!, $provingPeriodStart: Int!, $deadline: Int!, $partition: Int!) {
    wdpostProof(spId: $spId, provingPeriodStart: $provingPeriodStart, deadline: $deadline, partition: $partition) {
      ...WdpostProofsAll
    }
  }
  ${wdpostProofsFragment}
`

export const GetWdpostProofsCount = gql`
  query GetWdpostProofsCount($spId: Address) {
    wdpostProofsCount(spId: $spId)
  }
`
