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

export const taskSimpleFragment = gql`
  fragment TaskSimple on Task {
    id
    initiatedByID
    updateTime
    postedTime
    ownerId
    addedByID
    previousTaskID
    name
  }
`

export const taskDurationStatsFragment = gql`
  fragment TaskDurationStats on TaskDurationStats {
    name
    totalTasks
    maxDurationSeconds
    minDurationSeconds
    avgDurationSeconds
    medianDurationSeconds
    p90DurationSeconds
    p95DurationSeconds
    p99DurationSeconds
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
      completedBy {
        id
        hostAndPort
      }
    }
  }
`

export const GetTaskHistoriesCount = gql`
    query GetTaskHistoriesCount($machine: String, $name: String, $success: Boolean, $start: Time!, $end: Time!) {
        taskHistoriesCount(hostPort: $machine, name: $name, start: $start, end: $end, result: $success)
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
      addedBy {
        id
        hostAndPort
      }
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

export const GetTasksStats = gql`
    query GetTasksStats($start: Time!, $end: Time!, $machine: String) {
        tasksStats(start: $start, end: $end, machine: $machine) {
            name
            total
            success
            failure
        }
    }
`

export const GetRunningTasks = gql`
    query GetRunningTasks {
      tasks {
        ...TaskAll
      }
    }
    ${taskFragment}
`

export const GetRunningTask = gql`
  query GetRunningTask($id: Int!) {
    task(id: $id) {
      ...TaskAll
    }
  }
  ${taskFragment}
  `

export const GetTasksCount = gql`
    query GetTasksCount {
      tasksCount
    }
`

export const GetTaskHistories = gql`
    query GetTaskHistories($start: Time, $end: Time, $machine: String, $name: String, $result: Boolean, $offset: Int!, $limit: Int!) {
        taskHistories(start: $start, end: $end, hostPort: $machine, name: $name, result: $result, offset: $offset, limit: $limit) {
            ...TaskHistoryAll
        }
        taskHistoriesCount(start: $start, end: $end, hostPort: $machine, name: $name, result: $result)
    }
    ${taskHistoryFragment}
`

export const GetTaskNames = gql`
    query GetTaskNames {
        taskNames
    }
`

export const GetTasksDurationStats = gql`
  query GetTasksDurationStats($start: Time!, $end: Time!) {
    tasksDurationStats(start: $start, end: $end) {
      ...TaskDurationStats
    }
  }
  ${taskDurationStatsFragment}
  `

export const GetTaskDurationStats = gql`
  query GetTaskDurationStats($name: String!, $start: Time!, $end: Time!) {
    taskDurationStats(name: $name, start: $start, end: $end) {
      ...TaskDurationStats
    }
  }
  ${taskDurationStatsFragment}
  `

export const GetRunningTaskSummary = gql`
  query GetRunningTaskSummary {
    runningTaskSummary {
      running
      queued
      averageWaitTime
    }
  }`

export const GetTaskSuccessRate = gql`
  query TaskSuccessRate($name: String, $start: Time!, $end: Time!) {
    taskSuccessRate(name: $name, start: $start, end: $end) {
      total
      success
      successRate
    }
  }
  `

export const GetMachineTasks = gql`
    query GetMachineTasks($id: Int!) {
      machine(id: $id) {
        id
        tasks {
          ...TaskAll
        }
      }
    }
    ${taskFragment}
`
