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

export const taskFragment = gql`
  fragment TaskAll on Task {
    id
    initiatedByID
    initiatedBy {
      id
      hostAndPort
    }
    updateTime
    postedTime
    ownerId
    owner {
      id
      hostAndPort
    }
    addedByID
    addedBy {
      id
      hostAndPort
    }
    previousTaskID
    previousTask {
      id
      name
    }
    name
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

export const GetTaskHistoriesCount = gql`
    query GetTaskHistoriesCount($machine: String, $name: String, $success: Boolean, $start: Time!, $end: Time!) {
        taskHistoriesCount(machine: $machine, name: $name, start: $start, end: $end, success: $success)
    }
`

export const SubscribeNewTask = gql`
  subscription SubscribeNewTask($last: Int!) {
    newTask(last: $last) {
      id
      name
      postedTime
      updateTime
      ownerId
      addedByID
      initiatedByID
    }
  }
`
