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
  subscription SubscribeCompletedTask($host: String, $last: Int!) {
    completedTask(machine: $host, last: $last) {
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
  subscription SubscribeNewTask($machineID: Int, $last: Int!) {
    newTask(machineID: $machineID, last: $last) {
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

export const GetTaskHistoriesAggregation = gql`
    query GetTaskHistoriesAggregation($start: Time!, $end: Time!, $interval: TaskHistoriesAggregateInterval!) {
      taskHistoriesAggregate(start: $start, end: $end, interval: $interval) {
        time
        total
        success
        failure
      }
    }
`
