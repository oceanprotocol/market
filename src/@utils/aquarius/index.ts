import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '@shared/FormInput/InputElement/AssetSelection'
import axios, { CancelToken, AxiosResponse } from 'axios'
import { OrdersData_orders as OrdersData } from '../../@types/subgraph/OrdersData'
import { metadataCacheUri } from '../../../app.config'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../../@types/aquarius/SearchQuery'
import { transformAssetToAssetSelection } from '../assetConvertor'

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
export function getFilterTerm(
  filterField: string,
  value: string | number | boolean | number[] | string[]
): FilterTerm {
  const isArray = Array.isArray(value)
  return {
    [isArray ? 'terms' : 'term']: {
      [filterField]: value
    }
  }
}

export function generateBaseQuery(
  baseQueryParams: BaseQueryParams
): SearchQuery {
  const filters: unknown[] = [getFilterTerm('_index', 'aquarius')]
  baseQueryParams.filters && filters.push(...baseQueryParams.filters)
  baseQueryParams.chainIds &&
    filters.push(getFilterTerm('chainId', baseQueryParams.chainIds))
  !baseQueryParams.ignorePurgatory &&
    filters.push(getFilterTerm('purgatory.state', false))
  !baseQueryParams.ignoreState &&
    filters.push({
      bool: {
        must_not: [
          {
            term: {
              'nft.state': 5
            }
          }
        ],
        must: [
          {
            terms: {
              id: [
                'did:op:10de35106ac0c71d8dfccc01273a22cc63ad9b64764a0c2a389b76fb1aa53a10',
                'did:op:6f975ec3b9064f98f6c672d070913b10b7bbcbc53a79d2c00e356ba4db719298',
                'did:op:7e0bc5156f8cea8d4e752f2f3c4402da58753b5b10ee44a347ff5da7f56bb3d1',
                'did:op:e9b2c2a157a7ee66af7ad79166f7699812aacab57941faf054ec2b2609621e6e',
                'did:op:3a74dbc297bca6ce338ce0b7b3e9801e95b08d068473f4a6210196a7f13295c1',
                'did:op:1d04dd8ff4d0488270c40c551a8e781001c3a6cbe67126e2966e2f9d9abc4f11',
                'did:op:fcbb42f368e9680128d234cbfda6065544a2f5746e996108ddda65f8edb9939a',
                'did:op:2030a326ac98106a68a440319f13b8f15353185b5ae4ae99c3bf31b53e9e5ae1',
                'did:op:9f5cd15827f13a0081faa7252c01dad73d73bd7323f8146bfb5e9245c4a0a825',
                'did:op:84548484cf2109094a87582ac46ee98a0534a0f65403ad1364e5f1214b140773',
                'did:op:052e89ddda0fe9b400a6f292116fba6d1bb72b643f6fadc2ef6abbbe56be20f4',
                'did:op:a5e3cb6cfa9ccc702464168621f9625d488455984fe0fd81a8ec2fc671e085cc',
                'did:op:cbee73149648bafec85cd116f5ff27eeee857c26b84baafbfb345518445c5f45',
                'did:op:fea46e8b1d7a7eaffa08364e572d75e509cc48bc07cb3ebcb74e164fa8b5b859',
                'did:op:16957840694409af8a9d15b3bf3899d74ab6ed5ae85b713afb4e4f3446b19921',
                'did:op:2f47a91c4ee9bb30aa0eb1bbb648006f9775865b91e49b2afd05d40f9baff073',
                'did:op:0fe0b2193f2a92e5bb5bdcc4723ec38edc151a5301b6a770bda10a28655c72bb',
                'did:op:4342c2d20f60da8c23f3953817645f4061bf44152c0f7dec65d71359d8733d3d'
              ]
            }
          }
        ]
      }
    })
  const generatedQuery = {
    from: baseQueryParams.esPaginationOptions?.from || 0,
    size:
      baseQueryParams.esPaginationOptions?.size >= 0
        ? baseQueryParams.esPaginationOptions?.size
        : 1000,
    query: {
      bool: {
        ...baseQueryParams.nestedQuery,
        filter: filters
      }
    }
  } as SearchQuery

  if (baseQueryParams.aggs !== undefined) {
    generatedQuery.aggs = baseQueryParams.aggs
  }

  if (baseQueryParams.sortOptions !== undefined)
    generatedQuery.sort = {
      [baseQueryParams.sortOptions.sortBy]:
        baseQueryParams.sortOptions.sortDirection ||
        SortDirectionOptions.Descending
    }
  return generatedQuery
}

export function transformQueryResult(
  queryResult: SearchResponse,
  from = 0,
  size = 21
): PagedAssets {
  const result: PagedAssets = {
    results: [],
    page: 0,
    totalPages: 0,
    totalResults: 0,
    aggregations: []
  }

  result.results = (queryResult.hits.hits || []).map(
    (hit) => hit._source as Asset
  )

  result.aggregations = queryResult.aggregations
  result.totalResults = queryResult.hits.total.value
  result.totalPages =
    result.totalResults / size < 1
      ? Math.floor(result.totalResults / size)
      : Math.ceil(result.totalResults / size)
  result.page = from ? from / size + 1 : 1

  return result
}

export async function queryMetadata(
  query: SearchQuery,
  cancelToken: CancelToken
): Promise<PagedAssets> {
  try {
    const response: AxiosResponse<SearchResponse> = await axios.post(
      `${metadataCacheUri}/api/aquarius/assets/query`,
      { ...query },
      { cancelToken }
    )
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

export async function getAlgorithmDatasetsForCompute(
  algorithmId: string,
  datasetProviderUri: string,
  datasetChainId?: number,
  cancelToken?: CancelToken
): Promise<AssetSelectionAsset[]> {
  const baseQueryParams = {
    chainIds: [datasetChainId],
    nestedQuery: {
      must: {
        match: {
          'services.compute.publisherTrustedAlgorithms.did': {
            query: algorithmId
          }
        }
      }
    },
    sortOptions: {
      sortBy: SortTermOptions.Created,
      sortDirection: SortDirectionOptions.Descending
    }
  } as BaseQueryParams

  const query = generateBaseQuery(baseQueryParams)
  const computeDatasets = await queryMetadata(query, cancelToken)
  if (computeDatasets?.totalResults === 0) return []

  const datasets = await transformAssetToAssetSelection(
    datasetProviderUri,
    computeDatasets.results,
    []
  )
  return datasets
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
  accesType !== undefined &&
    filters.push(getFilterTerm('services.type', accesType))
  type !== undefined && filters.push(getFilterTerm('metadata.type', type))

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
    filters.push(getFilterTerm('services.type', accesType))
  type !== undefined && filters.push(getFilterTerm('metadata.type', type))

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

export async function getDownloadAssets(
  dtList: string[],
  tokenOrders: OrdersData[],
  chainIds: number[],
  cancelToken: CancelToken,
  ignoreState = false
): Promise<DownloadedAsset[]> {
  const baseQueryparams = {
    chainIds,
    filters: [
      getFilterTerm('services.datatokenAddress', dtList),
      getFilterTerm('services.type', 'access')
    ],
    ignorePurgatory: true,
    ignoreState
  } as BaseQueryParams
  const query = generateBaseQuery(baseQueryparams)
  try {
    const result = await queryMetadata(query, cancelToken)
    const downloadedAssets: DownloadedAsset[] = result.results
      .map((asset) => {
        const order = tokenOrders.find(
          ({ datatoken }) =>
            datatoken?.address.toLowerCase() ===
            asset.services[0].datatokenAddress.toLowerCase()
        )

        return {
          asset,
          networkId: asset.chainId,
          dtSymbol: order?.datatoken?.symbol,
          timestamp: order?.createdTimestamp
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)

    return downloadedAssets
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
      `${metadataCacheUri}/api/aquarius/assets/query`,
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
