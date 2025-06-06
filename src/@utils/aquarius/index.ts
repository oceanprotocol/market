import { LoggerInstance } from '@oceanprotocol/lib'
import { Asset } from '@oceanprotocol/ddo-js'
import axios, { CancelToken, AxiosResponse } from 'axios'
import { metadataCacheUri, allowDynamicPricing } from '../../../app.config.cjs'
import addressConfig from '../../../address.config.cjs'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../../@types/aquarius/SearchQuery'
import { isValidDid } from '@utils/ddo'

export interface UserSales {
  id: string
  totalSales: number
}

export const MAXIMUM_NUMBER_OF_PAGES_WITH_RESULTS = 476

export function escapeEsReservedCharacters(value: string): string {
  // eslint-disable-next-line no-useless-escape
  const pattern = /([\!\*\+\-\=\<\>\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g
  return value?.replace(pattern, '\\$1')
}

/**
 * @param filterField the name of the actual field from the ddo schema e.g. 'id','service.attributes.main.type'
 * @param value the value of the filter
 * @returns json structure of the es filter
 */
type TFilterValue = string | number | boolean | number[] | string[]
type TFilterKey = 'terms' | 'term' | 'match' | 'match_phrase'
export function getFilterTerm(
  filterField: string,
  value: TFilterValue,
  key: TFilterKey = 'term'
): FilterTerm {
  const isArray = Array.isArray(value)
  const useKey = key === 'term' ? (isArray ? 'terms' : 'term') : key
  return {
    [useKey]: {
      [filterField]: value
    }
  }
}

export function getDynamicPricingMustNot(): // eslint-disable-next-line camelcase
FilterTerm | undefined {
  return allowDynamicPricing === 'true'
    ? undefined
    : getFilterTerm('price.type', 'pool')
}
export function getWhitelistShould(): FilterTerm[] {
  const { whitelists } = addressConfig

  const whitelistFilterTerms = Object.entries(whitelists)
    .filter(([field, whitelist]) => whitelist.length > 0)
    .map(([field, whitelist]) =>
      whitelist.map((address) => getFilterTerm(field, address, 'match'))
    )
    .reduce((prev, cur) => prev.concat(cur), [])

  return whitelistFilterTerms.length > 0 ? whitelistFilterTerms : []
}

export function generateBaseQuery( // need to follow this query to fetch data from elasticsearch
  baseQueryParams: BaseQueryParams,
  index?: string
): SearchQuery {
  const generatedQuery = {
    index: index ?? 'op_ddo_v4.1.0',
    from: baseQueryParams.esPaginationOptions?.from || 0,
    size:
      baseQueryParams.esPaginationOptions?.size >= 0
        ? baseQueryParams.esPaginationOptions?.size
        : 1000,
    query: {
      bool: {
        ...baseQueryParams.nestedQuery,
        filter: [
          ...(baseQueryParams.filters || []),
          ...(baseQueryParams.chainIds
            ? [getFilterTerm('chainId', baseQueryParams.chainIds)]
            : []),
          ...(baseQueryParams.ignorePurgatory
            ? []
            : [getFilterTerm('indexedMetadata.purgatory.state', false)]),
          {
            bool: {
              must_not: [
                !baseQueryParams.ignoreState &&
                  getFilterTerm('indexedMetadata.nft.state', 5),
                getDynamicPricingMustNot()
              ]
            }
          }
        ]
      }
    }
  } as SearchQuery

  if (baseQueryParams.aggs !== undefined) {
    generatedQuery.aggs = baseQueryParams.aggs
  }

  if (baseQueryParams.sortOptions !== undefined) {
    generatedQuery.sort = {
      [`${baseQueryParams.sortOptions.sortBy}`]:
        baseQueryParams.sortOptions.sortDirection ||
        SortDirectionOptions.Descending
    }
  }

  // add whitelist filtering
  if (getWhitelistShould()?.length > 0) {
    const whitelistQuery = {
      bool: {
        should: [...getWhitelistShould()],
        minimum_should_match: 1
      }
    }
    Object.hasOwn(generatedQuery.query.bool, 'must')
      ? generatedQuery.query.bool.must.push(whitelistQuery)
      : (generatedQuery.query.bool.must = [whitelistQuery])
  }

  return generatedQuery
}

export function transformQueryResult(
  queryResult,
  from = 0,
  size = 21
): PagedAssets {
  const result: PagedAssets = {
    results: [],
    page: 0,
    totalPages: 0,
    totalResults: 0,
    aggregations: {}
  }
  result.results = queryResult.results

  result.totalResults =
    queryResult?.totalResults || queryResult?.results?.length || 0

  result.totalPages = Math.ceil(result.totalResults / size)
  result.page = from ? from + 1 : 1
  result.aggregations = queryResult.aggregations || {}
  return result
}

export async function queryMetadata(
  query: SearchQuery,
  cancelToken: CancelToken
): Promise<PagedAssets> {
  try {
    const response: AxiosResponse<SearchResponse> = await axios.post(
      `${metadataCacheUri}/api/aquarius/assets/metadata/query`,
      { ...query },
      { cancelToken }
    )
    console.log('response', response)
    if (!response || response.status !== 200 || !response.data) return
    return transformQueryResult(response.data, query.from, query.size)
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}

export async function getAsset(
  did: string,
  cancelToken: CancelToken
): Promise<Asset> {
  try {
    if (!isValidDid(did)) {
      return
    }

    const response: AxiosResponse<Asset> = await axios.get(
      `${metadataCacheUri}/api/aquarius/assets/ddo/${did}`,
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return

    const data = { ...response.data }

    return data
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}

export async function getAssetsNames(
  didList: string[],
  cancelToken: CancelToken
): Promise<Record<string, string>> {
  try {
    const response: AxiosResponse<Record<string, string>> = await axios.post(
      `${metadataCacheUri}/api/aquarius/assets/names`,
      { didList },
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return
    return response.data
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}

export async function getAssetsFromDids(
  didList: string[],
  chainIds: number[],
  cancelToken: CancelToken
): Promise<Asset[]> {
  if (didList?.length === 0 || chainIds?.length === 0) return []

  try {
    const orderedDDOListByDIDList: Asset[] = []
    const baseQueryparams = {
      chainIds,
      filters: [getFilterTerm('_id', didList)],
      ignorePurgatory: true
    } as BaseQueryParams
    const query = generateBaseQuery(baseQueryparams)
    const result = await queryMetadata(query, cancelToken)

    didList.forEach((did: string) => {
      const ddo = result.results.find((ddo: Asset) => ddo.id === did)
      if (ddo) orderedDDOListByDIDList.push(ddo)
    })
    return orderedDDOListByDIDList
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function getPublishedAssets(
  accountId: string,
  chainIds: number[],
  cancelToken: CancelToken,
  ignoreState = false,
  page?: number,
  type?: string,
  accesType?: string
): Promise<PagedAssets> {
  if (!accountId) return

  const filters: FilterTerm[] = []

  filters.push(getFilterTerm('nft.state', [0, 4, 5]))
  filters.push(getFilterTerm('nft.owner', accountId.toLowerCase()))
  // filters.push(getFilterTerm('services.type', 'access'))
  // filters.push(getFilterTerm('metadata.type', 'dataset'))

  const baseQueryParams = {
    chainIds,
    filters,
    sortOptions: {
      sortBy: SortTermOptions.Created,
      sortDirection: SortDirectionOptions.Descending
    },
    aggs: {
      totalOrders: {
        sum: {
          field: SortTermOptions.Orders
        }
      }
    },
    ignorePurgatory: true,
    ignoreState,
    esPaginationOptions: {
      from: (Number(page) - 1 || 0) * 9,
      size: 9
    }
  } as BaseQueryParams

  const query = generateBaseQuery(baseQueryParams)

  try {
    const result = await queryMetadata(query, cancelToken)
    return result
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}

async function getTopPublishers(
  chainIds: number[],
  cancelToken: CancelToken,
  page?: number,
  type?: string,
  accesType?: string
): Promise<PagedAssets> {
  const filters: FilterTerm[] = []

  accesType !== undefined &&
    filters.push(getFilterTerm('services.type', 'access'))
  type !== undefined && filters.push(getFilterTerm('metadata.type', 'dataset'))

  const baseQueryParams = {
    chainIds,
    filters,
    sortOptions: {
      sortBy: SortTermOptions.Created,
      sortDirection: SortDirectionOptions.Descending
    },
    aggs: {
      topPublishers: {
        terms: {
          field: 'nft.owner.keyword',
          order: { totalSales: 'desc' }
        },
        aggs: {
          totalSales: {
            sum: {
              field: SortTermOptions.Orders
            }
          }
        }
      }
    },
    esPaginationOptions: {
      from: (Number(page) - 1 || 0) * 9,
      size: 9
    }
  } as BaseQueryParams

  const query = generateBaseQuery(baseQueryParams)

  try {
    const result = await queryMetadata(query, cancelToken)
    return result
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}

export async function getTopAssetsPublishers(
  chainIds: number[],
  nrItems = 9
): Promise<UserSales[]> {
  const publishers: UserSales[] = []

  const result = await getTopPublishers(chainIds, null)
  const { topPublishers } = result.aggregations

  for (let i = 0; i < topPublishers.buckets.length; i++) {
    publishers.push({
      id: topPublishers.buckets[i].key,
      totalSales: parseInt(topPublishers.buckets[i].totalSales.value)
    })
  }

  publishers.sort((a, b) => b.totalSales - a.totalSales)

  return publishers.slice(0, nrItems)
}

export async function getUserSales(
  accountId: string,
  chainIds: number[]
): Promise<number> {
  try {
    const result = await getPublishedAssets(accountId, chainIds, null)
    const { totalOrders } = result.aggregations
    return totalOrders.value
  } catch (error) {
    LoggerInstance.error('Error getUserSales', error.message)
  }
}

export async function getUserOrders(
  accountId: string,
  cancelToken: CancelToken,
  page?: number
): Promise<PagedAssets> {
  const filters: FilterTerm[] = []
  filters.push(getFilterTerm('consumer.keyword', accountId))
  const baseQueryparams = {
    filters,
    ignorePurgatory: true,
    esPaginationOptions: {
      from: page || 0,
      size: 1000
    }
  } as BaseQueryParams
  const query = generateBaseQuery(baseQueryparams, 'order')
  console.log('query userorder', query)
  try {
    return queryMetadata(query, cancelToken)
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}

export async function getDownloadAssets(
  dtList: string[],
  chainIds: number[],
  cancelToken: CancelToken,
  ignoreState = false,
  page?: number
): Promise<{ downloadedAssets: DownloadedAsset[]; totalResults: number }> {
  const filters: FilterTerm[] = []
  filters.push(getFilterTerm('services.datatokenAddress.keyword', dtList))
  filters.push(getFilterTerm('services.type', 'access'))
  const baseQueryparams = {
    chainIds,
    filters,
    ignorePurgatory: true,
    ignoreState,
    esPaginationOptions: {
      from: Number(page) - 1 || 0,
      size: 9
    }
  } as BaseQueryParams
  const query = generateBaseQuery(baseQueryparams)
  try {
    const result = await queryMetadata(query, cancelToken)
    const downloadedAssets: DownloadedAsset[] = result.results
      .map((asset) => {
        const timestamp = new Date(asset.event.datetime).getTime()

        return {
          asset,
          networkId: asset.chainId,
          dtSymbol: asset?.datatokens[0]?.symbol,
          timestamp
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)

    return { downloadedAssets, totalResults: result.totalResults }
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}

export async function getTagsList(
  chainIds: number[],
  cancelToken: CancelToken
): Promise<string[]> {
  const baseQueryParams = {
    chainIds,
    esPaginationOptions: { from: 0, size: 0 }
  } as BaseQueryParams
  const query = {
    ...generateBaseQuery(baseQueryParams),
    aggs: {
      tags: {
        terms: {
          field: 'metadata.tags.keyword',
          size: 1000
        }
      }
    }
  }

  try {
    const response: AxiosResponse<SearchResponse> = await axios.post(
      `${metadataCacheUri}/api/aquarius/assets/metadata/query`,
      { ...query },
      { cancelToken }
    )
    if (response?.status !== 200 || !response?.data) return
    const { buckets }: { buckets: AggregatedTag[] } =
      response.data.aggregations.tags

    const tagsList = buckets
      .filter((tag) => tag.key !== '')
      .map((tag) => tag.key)

    return tagsList.sort()
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}
