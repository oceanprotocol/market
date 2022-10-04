import { HighestAllocationAssets } from 'src/@types/subgraph/HighestAllocationAssets'
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
): Promise<string[]> {
  const dtList: string[] = []
  let highestAllocationAssets: any[] = []

  // ve is only on main
  const queryContext = getQueryContext(1)
  const variables = {
    chainIds
  }
  const fetchedAllocations: OperationResult<HighestAllocationAssets, any> =
    await fetchData(HighestAllocationAssets, variables, queryContext)

  highestAllocationAssets = fetchedAllocations.data.veAllocateIds

  highestAllocationAssets.forEach((x) => {
    dtList.push(Web3.utils.toChecksumAddress(x.nftAddress))
  })
  return dtList
}

export async function getQueryHighestAllocation(
  chainIds: number[]
): Promise<[SearchQuery, string[]]> {
  const ids = getVeChainIds(chainIds)
  const dtList = await getHighestAllocationNfts(ids)
  const baseQueryParams = {
    chainIds,
    esPaginationOptions: {
      size: dtList.length > 0 ? 6 : 1
    },
    filters: [getFilterTerm('nftAddress.keyword', dtList)]
  } as BaseQueryParams
  const queryHighest = generateBaseQuery(baseQueryParams)

  return [queryHighest, dtList]
}
