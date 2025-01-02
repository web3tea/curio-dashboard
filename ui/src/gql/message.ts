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
