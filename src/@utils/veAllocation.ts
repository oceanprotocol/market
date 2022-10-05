import { HighestAllocationAssets } from 'src/@types/subgraph/HighestAllocationAssets'
import { NftAllocation } from 'src/@types/subgraph/NftAllocation'
import { AllAllocation } from 'src/@types/subgraph/AllAllocation'
import { AllLocked } from 'src/@types/subgraph/AllLocked'
import { gql, OperationResult } from 'urql'
import Web3 from 'web3'
import { generateBaseQuery, getFilterTerm } from './aquarius'
import { fetchData, getQueryContext } from './subgraph'
import appConfig from '../../app.config'

const HighestAllocationAssets = gql`
  query HighestAllocationAssets($chainIds: [BigInt!]) {
    veAllocateIds(
      orderBy: allocatedTotal
      orderDirection: desc
      first: 9
      where: { chainId_in: $chainIds }
    ) {
      allocatedTotal
      chainId
      nftAddress
    }
  }
`

const NftAllocation = gql`
  query NftAllocation($nftAddress: String) {
    veAllocateIds(where: { nftAddress: $nftAddress }) {
      allocatedTotal
    }
  }
`
const AllLocked = gql`
  query AllLocked {
    veOCEANs(first: 1000) {
      lockedAmount
    }
  }
`
const AllAllocation = gql`
  query AllAllocation {
    veAllocateIds(first: 1000) {
      allocatedTotal
    }
  }
`

export function getVeChainIds(chainIds: number[]): number[] {
  const productionChainId = 1
  const testChainId = 5
  const returnChainIds = []
  chainIds.filter((value) => appConfig.chainIdsProduction.includes(value))
    .length > 0 && returnChainIds.push(productionChainId)
  chainIds.filter((value) => appConfig.chainIdsTest.includes(value)).length >
    0 && returnChainIds.push(testChainId)
  return returnChainIds
}

export async function getHighestAllocationNfts(
  chainIds: number[]
): Promise<{ address: string; allocation: number }[]> {
  const dtList: { address: string; allocation: number }[] = []
  let highestAllocationAssets: any[] = []
  const ids = getVeChainIds(chainIds)
  for (const chainId of ids) {
    const queryContext = getQueryContext(chainId)
    const variables = {
      chainIds
    }
    const fetchedAllocations: OperationResult<HighestAllocationAssets, any> =
      await fetchData(HighestAllocationAssets, variables, queryContext)

    highestAllocationAssets = fetchedAllocations.data.veAllocateIds

    highestAllocationAssets.forEach((x) => {
      dtList.push({
        address: Web3.utils.toChecksumAddress(x.nftAddress),
        allocation: x.allocatedTotal
      })
    })
  }
  dtList.sort((a, b) => b.allocation - a.allocation)

  return dtList
}

export async function getQueryHighestAllocation(
  chainIds: number[]
): Promise<[SearchQuery, { address: string; allocation: number }[]]> {
  const dtList = await getHighestAllocationNfts(chainIds)
  const baseQueryParams = {
    chainIds,
    esPaginationOptions: {
      size: dtList.length > 0 ? 6 : 1
    },
    filters: [
      getFilterTerm(
        'nftAddress.keyword',
        dtList.map((x) => x.address)
      )
    ]
  } as BaseQueryParams
  const queryHighest = generateBaseQuery(baseQueryParams)

  return [queryHighest, dtList]
}

export async function getAllocationForNft(
  address: string,
  chainId: number
): Promise<number> {
  const veChain = getVeChainIds([chainId])
  const queryContext = getQueryContext(veChain[0])
  let allocation = 0
  const variables = {
    nftAddress: address.toLowerCase()
  }
  const fetchedAllocations: OperationResult<NftAllocation, any> =
    await fetchData(NftAllocation, variables, queryContext)
  const returnValue = fetchedAllocations.data?.veAllocateIds
  allocation = returnValue[0]?.allocatedTotal
  return allocation
}

interface TotalVe {
  totalLocked: number
  totalAllocated: number
}

export async function getTotalAllocatedAndLocked(): Promise<TotalVe> {
  const totals = {
    totalLocked: 0,
    totalAllocated: 0
  }

  const queryContext = getQueryContext(1)
  const fetchedAllocations: OperationResult<AllAllocation, any> =
    await fetchData(AllAllocation, null, queryContext)

  totals.totalAllocated = fetchedAllocations.data?.veAllocateIds.reduce(
    (previousValue, currentValue) =>
      previousValue + Number(currentValue.allocatedTotal),
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
