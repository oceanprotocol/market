import { AllLockedQuery } from '../../src/@types/subgraph/AllLockedQuery'
import { OwnAllocationsQuery } from '../../src/@types/subgraph/OwnAllocationsQuery'
import { NftOwnAllocationQuery } from '../../src/@types/subgraph/NftOwnAllocationQuery'
import { OceanLockedQuery } from '../../src/@types/subgraph/OceanLockedQuery'
import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from './subgraph'
import axios from 'axios'
import networkdata from '../../content/networks-metadata.json'
import {
  getNetworkDataById,
  getNetworkType,
  NetworkType
} from '@hooks/useNetworkMetadata'

const AllLocked = gql`
  query AllLockedQuery {
    veOCEANs(first: 1000) {
      lockedAmount
    }
  }
`

const OwnAllocations = gql`
  query OwnAllocationsQuery($address: String) {
    veAllocations(where: { allocationUser: $address }) {
      id
      nftAddress
      allocated
    }
  }
`
const NftOwnAllocation = gql`
  query NftOwnAllocationQuery($address: String, $nftAddress: String) {
    veAllocations(
      where: { allocationUser: $address, nftAddress: $nftAddress }
    ) {
      allocated
    }
  }
`
const OceanLocked = gql`
  query OceanLockedQuery($address: ID!) {
    veOCEAN(id: $address) {
      id
      lockedAmount
      unlockTime
    }
  }
`

export interface TotalVe {
  totalLocked: number
  totalAllocated: number
}
export interface Allocation {
  nftAddress: string
  allocation: number
}

export interface AssetWithOwnAllocation {
  asset: AssetExtended
  allocation: string
}

export function getVeChainNetworkId(assetNetworkId: number): number {
  const networkData = getNetworkDataById(networkdata, assetNetworkId)
  const networkType = getNetworkType(networkData)
  if (networkType === NetworkType.Mainnet) return 1
  else return 5
}

export function getVeChainNetworkIds(assetNetworkIds: number[]): number[] {
  const veNetworkIds: number[] = []
  assetNetworkIds.forEach((x) => {
    const id = getVeChainNetworkId(x)
    veNetworkIds.indexOf(id) === -1 && veNetworkIds.push(id)
  })
  return veNetworkIds
}

export async function getNftOwnAllocation(
  userAddress: string,
  nftAddress: string,
  networkId: number
): Promise<number> {
  const veNetworkId = getVeChainNetworkId(networkId)
  const queryContext = getQueryContext(veNetworkId)
  const fetchedAllocation: OperationResult<NftOwnAllocationQuery, any> =
    await fetchData(
      NftOwnAllocation,
      {
        address: userAddress.toLowerCase(),
        nftAddress: nftAddress.toLowerCase()
      },
      queryContext
    )

  return fetchedAllocation.data?.veAllocations[0]?.allocated
}

export async function getTotalAllocatedAndLocked(): Promise<TotalVe> {
  const totals = {
    totalLocked: 0,
    totalAllocated: 0
  }

  const queryContext = getQueryContext(1)

  const response = await axios.post(`https://df-sql.oceandao.org/nftinfo`)
  totals.totalAllocated = response.data?.reduce(
    (previousValue: number, currentValue: { ve_allocated: string }) =>
      previousValue + Number(currentValue.ve_allocated),
    0
  )

  const fetchedLocked: OperationResult<AllLockedQuery, any> = await fetchData(
    AllLocked,
    null,
    queryContext
  )
  totals.totalLocked = fetchedLocked.data?.veOCEANs.reduce(
    (previousValue, currentValue) =>
      previousValue + Number(currentValue.lockedAmount),
    0
  )
  return totals
}

export async function getLocked(
  userAddress: string,
  networkIds: number[]
): Promise<number> {
  let total = 0
  const veNetworkIds = getVeChainNetworkIds(networkIds)
  for (let i = 0; i < veNetworkIds.length; i++) {
    const queryContext = getQueryContext(veNetworkIds[i])
    const fetchedLocked: OperationResult<OceanLockedQuery, any> =
      await fetchData(
        OceanLocked,
        { address: userAddress.toLowerCase() },
        queryContext
      )

    fetchedLocked.data?.veOCEAN?.lockedAmount &&
      (total += Number(fetchedLocked.data?.veOCEAN?.lockedAmount))
  }

  return total
}

export async function getOwnAllocations(
  networkIds: number[],
  userAddress: string
): Promise<Allocation[]> {
  const allocations: Allocation[] = []
  const veNetworkIds = getVeChainNetworkIds(networkIds)
  for (let i = 0; i < veNetworkIds.length; i++) {
    const queryContext = getQueryContext(veNetworkIds[i])
    const fetchedAllocations: OperationResult<OwnAllocationsQuery, any> =
      await fetchData(
        OwnAllocations,
        { address: userAddress.toLowerCase() },
        queryContext
      )

    fetchedAllocations.data?.veAllocations.forEach(
      (x) =>
        x.allocated !== '0' &&
        allocations.push({
          nftAddress: x.nftAddress,
          allocation: x.allocated / 100
        })
    )
  }

  return allocations
}
