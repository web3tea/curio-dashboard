import gql from "graphql-tag"

export const messageSendFragment = gql`
  fragment MessageSendAll on MessageSend {
    fromKey
    toAddr
    sendReason
    sendTaskId
    unsignedCid
    unsignedData
    nonce
    signedCid
    signedData
    signedJson
    sendTime
    sendSuccess
    sendError
  }
`

export const GetMessageSends = gql`
  query GetMessageSends($account: Address, $offset: Int!, $limit: Int!) {
    messageSends(account: $account, offset: $offset, limit: $limit) {
      ...MessageSendAll
    }
    messageSendsCount(account: $account)
  }
  ${messageSendFragment}
`

export const messageWaitFragment = gql`
  fragment MessageWaitAll on MessageWait {
    signedMessageCid
    waiterMachineId
    waiterMachine {
      id
      hostAndPort
      lastContact
    }
    executedTskCid
    executedTskEpoch
    executedMsgCid
    executedMsgData
    executedRcptExitcode
    executedRcptReturn
    executedRcptGasUsed
    createdAt
  }
`

export const GetMessageWaits = gql`
  query GetMessageWaits($waiterMachineId: Int, $offset: Int!, $limit: Int!) {
    messageWaits(waiterMachineId: $waiterMachineId, offset: $offset, limit: $limit) {
      ...MessageWaitAll
    }
    messageWaitsCount(waiterMachineId: $waiterMachineId)
  }
  ${messageWaitFragment}
`
