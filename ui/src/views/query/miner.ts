import gql from 'graphql-tag'

const minerInfoAllFragment = gql`
  fragment MinerInfoAll on MinerInfo {
    owner
    worker
    newWorker
    controlAddresses
    workerChangeEpoch
    peerId
    multiAddrs
    windowPoStProofType
    sectorSize
    windowPoStPartitionSectors
    consensusFaultElapsed
    pendingOwnerAddress
    beneficiary
    beneficiaryTerm {
      quota
      usedQuota
      expiration
    }
    pendingBeneficiaryChange {
      newBeneficiary
      newQuota
      newExpiration
      approvedByBeneficiary
      approvedByNominee
    }
  }
`

const minerPowerAllFragment = gql`
  fragment MinerPowerAll on MinerPower {
    id
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
`

const minerBalanceAllFragment = gql`
  fragment MinerBalanceAll on MinerBalance {
    balance
    initialPledge
    preCommitDeposits
    vesting
    available
  }
`

export const GetActors = gql`
  query GetActors {
    actors {
      id
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
      ...MinerPowerAll
    }
  }
  ${minerPowerAllFragment}
`

export const GetMinerFull = gql`
  query GetMinerFull($address: Address!) {
    miner(address: $address) {
      id
      info {
        ...MinerInfoAll
      }
      power {
        ...MinerPowerAll
      }
      balance {
        ...MinerBalanceAll
      }
    }
  }
  ${minerInfoAllFragment}
  ${minerPowerAllFragment}
  ${minerBalanceAllFragment}
`
