import gql from 'graphql-tag'

export const GetActorAddresses = gql`
    query GetActorAddresses {
      actors {
        id
        address
      }
    }
`
