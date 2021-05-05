import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { MetadataCache, Logger } from '@oceanprotocol/lib'
import queryString from 'query-string'

export const SortTermOptions = {
  Liquidity: 'liquidity',
  Price: 'price',
  Created: 'created'
} as const
type SortTermOptions = typeof SortTermOptions[keyof typeof SortTermOptions]

export const SortElasticTerm = {
  Liquidity: 'price.ocean',
  Price: 'price.value',
  Created: 'created'
} as const
type SortElasticTerm = typeof SortElasticTerm[keyof typeof SortElasticTerm]

export const SortValueOptions = {
  Ascending: 'asc',
  Descending: 'desc'
} as const
type SortValueOptions = typeof SortValueOptions[keyof typeof SortValueOptions]

export const FilterByPriceOptions = {
  Fixed: 'exchange',
  Dynamic: 'pool',
  All: 'all'
} as const
type FilterByPriceOptions = typeof FilterByPriceOptions[keyof typeof FilterByPriceOptions]

export const FilterByTypeOptions = {
  Data: 'dataset',
  Algorithm: 'algorithm'
} as const
type FilterByTypeOptions = typeof FilterByTypeOptions[keyof typeof FilterByTypeOptions]

function addPriceFilterToQuery(sortTerm: string, priceFilter: string): string {
  if (priceFilter === FilterByPriceOptions.All) {
    sortTerm = priceFilter
      ? sortTerm === ''
        ? `(price.type:${FilterByPriceOptions.Fixed} OR price.type:${FilterByPriceOptions.Dynamic})`
        : `${sortTerm} AND (price.type:${FilterByPriceOptions.Dynamic} OR price.type:${FilterByPriceOptions.Fixed})`
      : sortTerm
  } else {
    sortTerm = priceFilter
      ? sortTerm === ''
        ? `price.type:${priceFilter}`
        : `${sortTerm} AND price.type:${priceFilter}`
      : sortTerm
  }
  return sortTerm
}

function addTypeFilterToQuery(sortTerm: string, typeFilter: string): string {
  sortTerm = typeFilter
    ? sortTerm === ''
      ? `service.attributes.main.type:${typeFilter}`
      : `${sortTerm} AND service.attributes.main.type:${typeFilter}`
    : sortTerm
  return sortTerm
}

function getSortType(sortParam: string): string {
  const sortTerm =
    sortParam === SortTermOptions.Liquidity
      ? SortElasticTerm.Liquidity
      : sortParam === SortTermOptions.Price
      ? SortElasticTerm.Price
      : SortTermOptions.Created
  return sortTerm
}

export function getSearchQuery(
  text?: string,
  owner?: string,
  tags?: string,
  categories?: string,
  page?: string,
  offset?: string,
  sort?: string,
  sortOrder?: string,
  priceType?: string,
  serviceType?: string
): SearchQuery {
  const sortTerm = getSortType(sort)
  const sortValue = sortOrder === SortValueOptions.Ascending ? 1 : -1
  let searchTerm = owner
    ? `(publicKey.owner:${owner})`
    : tags
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.tags:\"${tags}\")`
    : categories
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.categories:\"${categories}\")`
    : text || ''
  searchTerm = addTypeFilterToQuery(searchTerm, serviceType)
  searchTerm = addPriceFilterToQuery(searchTerm, priceType)

  return {
    page: Number(page) || 1,
    offset: Number(offset) || 21,
    query: {
      query_string: {
        query: `*${searchTerm}* -isInPurgatory:true`,
        fields: [
          'dataTokenInfo.name',
          'dataTokenInfo.symbol',
          'dataTokenInfo.address',
          'service.attributes.main.name'
        ],
        default_operator: 'AND'
      }
      // ...(owner && { 'publicKey.owner': [owner] }),
      // ...(tags && { tags: [tags] }),
      // ...(categories && { categories: [categories] })
    },
    sort: {
      [sortTerm]: sortValue
    }

    // Something in ocean.js is weird when using 'tags: [tag]'
    // which is the only way the query actually returns desired results.
    // But it doesn't follow 'SearchQuery' interface so we have to assign
    // it here.
    // } as SearchQuery

    // And the next hack,
    // nativeSearch is not implmeneted on ocean.js typings
  }
}

export async function getResults(
  params: {
    text?: string
    owner?: string
    tags?: string
    categories?: string
    page?: string
    offset?: string
    sort?: string
    sortOrder?: string
    priceType?: string
    serviceType?: string
  },
  metadataCacheUri: string
): Promise<QueryResult> {
  const {
    text,
    owner,
    tags,
    page,
    offset,
    categories,
    sort,
    sortOrder,
    priceType,
    serviceType
  } = params
  const metadataCache = new MetadataCache(metadataCacheUri, Logger)
  const searchQuery = getSearchQuery(
    text,
    owner,
    tags,
    categories,
    page,
    offset,
    sort,
    sortOrder,
    priceType,
    serviceType
  )
  const queryResult = await metadataCache.queryMetadata(searchQuery)

  return queryResult
}

export async function addExistingParamsToUrl(
  location: Location,
  excludedParam: string,
  secondExcludedParam?: string
): Promise<string> {
  const parsed = queryString.parse(location.search)
  let urlLocation = '/search?'
  if (Object.keys(parsed).length > 0) {
    for (const querryParam in parsed) {
      if (
        querryParam !== excludedParam &&
        querryParam !== secondExcludedParam
      ) {
        if (querryParam === 'page' && excludedParam === 'text') {
          Logger.log('remove page when starting a new search')
        } else {
          const value = parsed[querryParam]
          urlLocation = `${urlLocation}${querryParam}=${value}&`
        }
      }
    }
  } else {
    urlLocation = `${urlLocation}sort=${SortTermOptions.Created}&sortOrder=${SortValueOptions.Descending}&`
  }
  urlLocation = urlLocation.slice(0, -1)
  return urlLocation
}
