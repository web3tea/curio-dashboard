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

// if address is not provided, it will return the total power of all miners in the database
export const GetMinerPower = gql`
  query GetMinerPower($address: Address) {
    minerPower(address: $address) {
      minerPower {
        rawBytePower
        qualityAdjPower
      }
      totalPower {
        rawBytePower
        qualityAdjPower
      }
      hasMinPower
    }
  }
`
