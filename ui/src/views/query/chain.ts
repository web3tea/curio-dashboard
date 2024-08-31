import gql from 'graphql-tag'

export const GetNodeInfos = gql`
    query GetNodeInfos {
        nodesInfo {
            id
            address
            layers
            reachable
            syncState
            version
        }
    }
`
