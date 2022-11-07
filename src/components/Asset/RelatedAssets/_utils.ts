import { SortTermOptions } from '../../../@types/aquarius/SearchQuery'

export function generateQuery(
  chainIds: number[],
  nftAddress: string,
  size: number,
  tags?: string[],
  owner?: string
) {
  return {
    chainIds,
    esPaginationOptions: {
      size
    },
    nestedQuery: {
      must_not: {
        term: { 'nftAddress.keyword': nftAddress }
      }
    },
    filters: [
      tags && {
        terms: { 'metadata.tags.keyword': tags }
      },
      owner && { term: { 'nft.owner.keyword': owner } }
    ],
    sort: {
      'stats.orders': 'desc'
    },
    sortOptions: {
      sortBy: SortTermOptions.Orders
    } as SortOptions
  } as BaseQueryParams
}
