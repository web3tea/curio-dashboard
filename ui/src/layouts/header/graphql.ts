import gql from 'graphql-tag'

export const GetAlerts = gql`
  query GetAlerts {
    alerts {
      id
      machineName
      message
    }
  }
`

export const SubscribeAlerts = gql`
  subscription SubscribeAlerts($offset: Int!) {
    alerts(offset: $offset) {
      id
      machineName
      message
    }
  }
`
