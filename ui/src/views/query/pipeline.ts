import gql from 'graphql-tag'

export const GetSectorsPipeline = gql`
  query GetSectorsSdrPipeline {
    pipelines {
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
      currentTask {
        id
        name
        postedTime
      }
    }
  }`
