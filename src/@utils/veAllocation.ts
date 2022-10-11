import { AllLocked } from 'src/@types/subgraph/AllLocked'
import { OwnAllocations } from 'src/@types/subgraph/OwnAllocations'
import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from './subgraph'
import axios from 'axios'
import networkdata from '../../content/networks-metadata.json'
import {
  getNetworkDataById,
  getNetworkType,
  NetworkType
} from '@hooks/useNetworkMetadata'
import { getAssetsFromNftList } from './aquarius'
import { chainIdsSupported } from 'app.config'
import { Asset } from '@oceanprotocol/lib'
const AllLocked = gql`
  query AllLocked {
    veOCEANs(first: 1000) {
      lockedAmount
    }
  }
`

const OwnAllocations = gql`
  query OwnAllocations($address: String) {
    veAllocations(where: { allocationUser: $address }) {
      id
      nftAddress
      allocated
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
  did: string
  nftAddress: string
  allocation: number
  name: string
  symbol: string
}

export function getVeChainNetworkId(assetNetworkId: number): number {
  const networkData = getNetworkDataById(networkdata, assetNetworkId)
  const networkType = getNetworkType(networkData)
  if (networkType === NetworkType.Mainnet) return 1
  else return 5
}

export async function getTotalAllocatedAndLocked(): Promise<TotalVe> {
  const totals = {
    totalLocked: 0,
    totalAllocated: 0
  }

  const queryContext = getQueryContext(1)

  const response = await axios.post(`https://df-sql.oceandao.org/nftinfo`)
  totals.totalAllocated = response.data?.reduce(
    (previousValue: number, currentValue: { ve_allocated: any }) =>
      previousValue + Number(currentValue.ve_allocated),
    0
  )

  const fetchedLocked: OperationResult<AllLocked, any> = await fetchData(
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

export async function getOwnAllocations(
  networkId: number,
  userAddress: string
): Promise<Allocation[]> {
  const allocations: Allocation[] = []

  const queryContext = getQueryContext(networkId)
  const fetchedAllocations: OperationResult<OwnAllocations, any> =
    await fetchData(
      OwnAllocations,
      {
        address: userAddress.toLowerCase()
      },
      queryContext
    )

  fetchedAllocations.data?.veAllocations.forEach((x) =>
    allocations.push({
      nftAddress: x.nftAddress,
      allocation: x.allocated / 100
    })
  )
  return allocations
}

export async function getOwnAssetsWithAllocation(
  networkId: number,
  userAddress: string
): Promise<AssetWithOwnAllocation[]> {
  const assetsWithAllocations: AssetWithOwnAllocation[] = []
  const allocations = await getOwnAllocations(networkId, userAddress)
  const assets = await getAssetsFromNftList(
    allocations.map((x) => x.nftAddress),
    chainIdsSupported,
    null
  )
  assets?.forEach((asset: Asset) => {
    const allocation = allocations.find(
      (x) => x.nftAddress.toLowerCase() === asset.nftAddress.toLowerCase()
    )
    console.log('allocation', allocation, asset)

    assetsWithAllocations.push({
      did: asset.id,
      nftAddress: asset.nftAddress,
      allocation: allocation.allocation,
      name: asset.metadata.name,
      symbol: asset.datatokens[0].symbol
    })
  })

  return assetsWithAllocations
}
