import gql from 'graphql-tag'

export const GetConfigs = gql`
  query GetConfigs {
    configs {
      id
      title
      config
      usedBy {
        machineId
        machineName
      }
    }
  }
`

export const UpdateConfig = gql`
  mutation UpdateConfig($title: String!, $config: String!) {
    updateConfig(title: $title, config: $config) {
      id
      title
      config
    }
  }
`

export const CreateConfig = gql`
  mutation CreateConfig($title: String!, $config: String!) {
    createConfig(title: $title, config: $config) {
      id
      title
      config
    }
  }
`
