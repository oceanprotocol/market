import { LoggerInstance } from '@oceanprotocol/lib'
import { Asset } from '@oceanprotocol/ddo-js'
import axios, { CancelToken, AxiosResponse } from 'axios'
import { metadataCacheUri, allowDynamicPricing } from '../../../app.config.cjs'
console.log('[Aquarius] metadataCacheUri =>', metadataCacheUri)
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
    : getFilterTerm('indexedMetadata.stats.prices.type', 'pool')
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

export function generateBaseQuery(
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
                getFilterTerm('chainId', 11155420), // remove this filter if you want 11155420 network later
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
  queryResult: any,
  from = 0,
  size = Number.MAX_SAFE_INTEGER
): PagedAssets {
  const rawResults = (queryResult || []).flat()
  const aggregations = queryResult || {}

  const effectiveSize = Math.max(size, rawResults.length + 1)
  // const pagedResults = rawResults.slice(from, from + effectiveSize)

  return {
    results: rawResults,
    page: from ? Math.floor(from / effectiveSize) + 1 : 1,
    totalPages: Math.ceil(rawResults.length / effectiveSize),
    totalResults: rawResults.length,
    aggregations
  }
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

    if (!response || response.status !== 200 || !response.data[0]) {
      console.log('Invalid response or empty data at index 0')
      return
    }

    const transformedResult = transformQueryResult(
      response.data,
      query.from,
      query.size
    )
    return transformedResult
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log('⚠️ Request cancelled:', error.message)
    } else {
      LoggerInstance.error('❌ Error occurred:', error.message)
    }
  }
}

export async function queryMetadataTags(
  query: SearchQuery,
  cancelToken: CancelToken
): Promise<{ tags: any; pagedAssets: PagedAssets }> {
  try {
    const response: AxiosResponse<SearchResponse> = await axios.post(
      `${metadataCacheUri}/api/aquarius/assets/metadata/query`,
      { ...query },
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data[0]) {
      LoggerInstance.warn('Invalid response or no data')
      return {
        tags: [],
        pagedAssets: {
          results: [],
          page: 1,
          totalPages: 0,
          totalResults: 0,
          aggregations: {}
        }
      }
    }

    const assets = response.data[0]
    const uniqueTags = [
      ...new Set(
        assets
          .filter((asset: any) => {
            // Check if metadata and tags exist, and tags is an array with length > 0
            const hasValidTags =
              asset.metadata &&
              Array.isArray(asset.metadata.tags) &&
              asset.metadata.tags.length > 0
            // Check if asset has sales (orders > 0)
            const hasSales = asset.indexedMetadata?.stats?.[0]?.orders > 0

            if (!hasValidTags) {
              LoggerInstance.warn(
                `Asset skipped due to invalid tags: ${JSON.stringify({
                  id: asset.id,
                  chainId: asset.chainId,
                  metadata: asset.metadata
                })}`
              )
            } else if (!hasSales) {
              LoggerInstance.warn(
                `Asset skipped due to zero sales: ${JSON.stringify({
                  id: asset.id,
                  chainId: asset.chainId,
                  orders: asset.indexedMetadata?.stats?.[0]?.orders
                })}`
              )
            }

            return hasValidTags && hasSales
          })
          .flatMap((asset: any) => asset.metadata.tags)
      )
    ]

    const transformedResult = transformQueryResult(
      response.data,
      query.from,
      query.size
    )
    return { tags: uniqueTags, pagedAssets: transformedResult }
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log('Query canceled:', error.message)
    } else {
      LoggerInstance.error('Error in queryMetadataTags:', error.message)
    }
    return {
      tags: [],
      pagedAssets: {
        results: [],
        page: 1,
        totalPages: 0,
        totalResults: 0,
        aggregations: {}
      }
    }
  }
}
export async function queryStats(
  query: SearchQuery,
  cancelToken: CancelToken
): Promise<{ totalOrders: number; pagedAssets: PagedAssets }> {
  try {
    const response: AxiosResponse<SearchResponse> = await axios.post(
      `${metadataCacheUri}/api/aquarius/assets/metadata/query`,
      { ...query },
      { cancelToken }
    )

    if (!response || response.status !== 200 || !response.data[0]) {
      LoggerInstance.warn('Invalid response or no data')
      return {
        totalOrders: 0,
        pagedAssets: {
          results: [],
          page: 1,
          totalPages: 0,
          totalResults: 0,
          aggregations: {}
        }
      }
    }

    const assets = response.data[0]

    const totalOrders = assets.reduce((sum: number, asset: any) => {
      const orders = asset.indexedMetadata?.stats?.[0]?.orders || 0
      return sum + (typeof orders === 'number' ? orders : 0)
    }, 0)

    const transformedResult = transformQueryResult(
      response.data,
      query.from,
      query.size
    )

    return { totalOrders, pagedAssets: transformedResult }
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log('Query canceled:', error.message)
    } else {
      LoggerInstance.error('Error in queryStats:', error.message)
    }
    return {
      totalOrders: 0,
      pagedAssets: {
        results: [],
        page: 1,
        totalPages: 0,
        totalResults: 0,
        aggregations: {}
      }
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
  ignorePurgatory = false,
  ignoreState = false,
  page?: number
): Promise<PagedAssets> {
  if (!accountId) return
  const filters: FilterTerm[] = []
  filters.push(
    getFilterTerm('indexedMetadata.nft.owner', accountId.toLowerCase())
  )
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
    ignorePurgatory,
    ignoreState,
    esPaginationOptions: {
      from: page || 0,
      size: 1000
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
          field: 'indexedMetadata.nft.owner.keyword',
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
      size: 1000
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

  try {
    const result = await getTopPublishers(chainIds, null)

    if (
      result?.aggregations?.topPublishers?.buckets &&
      Array.isArray(result.aggregations.topPublishers.buckets)
    ) {
      const { topPublishers } = result.aggregations
      for (const bucket of topPublishers.buckets) {
        publishers.push({
          id: bucket.key,
          totalSales: parseInt(bucket.totalSales.value)
        })
      }
    } else if (Array.isArray(result?.results)) {
      const publisherMap: { [key: string]: number } = {}

      for (const asset of result.results) {
        const owner = asset?.indexedMetadata?.nft?.owner
        if (!owner) {
          console.warn('Asset missing owner:', {
            id: asset?.id,
            nftAddress: asset?.nftAddress,
            indexedMetadata: asset?.indexedMetadata
          })
          continue
        }

        const orders = asset?.indexedMetadata?.stats?.[0]?.orders || 0
        if (typeof orders !== 'number') {
          console.warn('Invalid orders value for asset:', {
            id: asset?.id,
            owner,
            orders: asset?.indexedMetadata?.stats?.[0]?.orders
          })
          continue
        }

        publisherMap[owner] = (publisherMap[owner] || 0) + orders
      }

      for (const [id, totalSales] of Object.entries(publisherMap)) {
        publishers.push({ id, totalSales })
      }
    } else {
      console.warn(
        'Unexpected or empty response from getTopPublishers:',
        result
      )
      return []
    }

    publishers.sort((a, b) => b.totalSales - a.totalSales)
    return publishers.slice(0, nrItems)
  } catch (error: any) {
    console.error('Error in getTopAssetsPublishers:', error?.message || error)
    return []
  }
}

export async function getUserSales(
  accountId: string,
  chainIds: number[]
): Promise<number> {
  try {
    let page = 1
    let totalOrders = 0
    let assets: PagedAssets
    const allResults: Asset[] = []

    do {
      assets = await getPublishedAssets(
        accountId,
        chainIds,
        null,
        false,
        false,
        page
      )
      // TODO stats is not in ddo
      if (assets && assets.results) {
        assets.results.forEach((asset) => {
          const orders = asset?.indexedMetadata?.stats[0]?.orders || 0
          totalOrders += orders
        })
        allResults.push(...assets.results)
      }
      page++
    } while (
      assets &&
      assets.results &&
      assets.results?.length > 0 &&
      page <= assets.totalPages
    )

    return totalOrders
  } catch (error) {
    LoggerInstance.error('Error in getUserSales', error.message)
    return 0
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
        const timestamp = new Date(
          asset?.indexedMetadata?.event?.datetime
        ).getTime()

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
    return undefined
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
    const response: AxiosResponse<any[]> = await axios.post(
      `${metadataCacheUri}/api/aquarius/assets/metadata/query`,
      { ...query },
      { cancelToken }
    )
    if (response?.status !== 200 || !response?.data) return
    const tagsSet: Set<string> = new Set()
    response.data.forEach((items) => {
      items?.forEach((item) => {
        item?.metadata?.tags
          ?.filter((tag: string) => tag !== '')
          ?.forEach((tag: string) => tagsSet.add(tag))
      })
    })
    const uniqueTagsList = Array.from(tagsSet).sort()
    return uniqueTagsList
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}
