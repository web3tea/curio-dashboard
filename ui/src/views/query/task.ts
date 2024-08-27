import gql from 'graphql-tag'

export const taskHistoryFragment = gql`
  fragment TaskHistoryAll on TaskHistory {
    id
    taskId
    name
    posted
    workStart
    workEnd
    result
    err
    completedByHostAndPort
  }
`

export const SubscribeCompletedTask = gql`
  subscription SubscribeCompletedTask($last: Int!) {
    completedTask(last: $last) {
      id
      taskId
      name
      posted
      workStart
      workEnd
      result
      err
      completedByHostAndPort
    }
  }
`
