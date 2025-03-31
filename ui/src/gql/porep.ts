import gql from 'graphql-tag'

export const porepAllFragment = gql`
  fragment PorepAll on Porep {
    id
    spId
    sectorNumber
    createTime
    regSealProof
    ticketEpoch
    ticketValue
    taskIdSdr
    afterSdr
    treeDCid
    taskIdTreeD
    afterTreeD
    taskIdTreeC
    afterTreeC
    treeRCid
    taskIdTreeR
    afterTreeR
    precommitMsgCid
    taskIdPrecommitMsg
    afterPrecommitMsg
    seedEpoch
    precommitMsgTsk
    afterPrecommitMsgSuccess
    seedValue
    taskIdPorep
    porepProof
    afterPorep
    taskIdFinalize
    afterFinalize
    taskIdMoveStorage
    afterMoveStorage
    commitMsgCid
    taskIdCommitMsg
    afterCommitMsg
    commitMsgTsk
    afterCommitMsgSuccess
    failed
    failedAt
    failedReason
    failedReasonMsg
    status
    stage
    compactStages {
      name
      status
      taskId
    }
    currentTask {
      id
      name
      postedTime
      owner {
        id
        hostAndPort
      }
    }
  }
`

export const GetSectorsPoreps = gql`
  query GetSectorsPoreps {
    poreps {
      ...PorepAll
    }
  }
  ${porepAllFragment}
`
