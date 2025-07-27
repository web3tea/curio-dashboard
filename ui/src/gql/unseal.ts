import { gql } from '@apollo/client/core'

export const GetUnsealSectors = gql`
  query GetUnsealSectors($miner: Address, $sectorNumber: Int, $offset: Int!, $limit: Int!) {
    unsealSectors(actor: $miner, sectorNumber: $sectorNumber, offset: $offset, limit: $limit) {
      spID
      sectorNumber
      createTime
      regSealProof
      taskIdUnsealSdr
      afterUnsealSdr
      taskIdDecodeSector
      afterDecodeSector
    }
    unsealSectorsCount(actor: $miner)
  }
`


