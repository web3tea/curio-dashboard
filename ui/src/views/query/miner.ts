import gql from 'graphql-tag'

export const GetActors = gql`
  query GetActors {
    actors {
      address
      layers
      qualityAdjustedPower
      rawBytePower
      actorBalance
      actorAvailableBalance
      workerBalance
    }
  }
`
