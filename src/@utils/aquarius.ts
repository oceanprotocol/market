import {
  Asset,
  LoggerInstance,
  PublisherTrustedAlgorithm
} from '@oceanprotocol/lib'
import { AssetSelectionAsset } from '@shared/FormFields/AssetSelection'
import { PriceList, getAssetsPriceList } from './subgraph'
import axios, { CancelToken, AxiosResponse } from 'axios'
import { OrdersData_orders as OrdersData } from '../@types/subgraph/OrdersData'
import { metadataCacheUri } from '../../app.config'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../@types/aquarius/SearchQuery'
import { getServiceByName } from './ddo'

export const MAXIMUM_NUMBER_OF_PAGES_WITH_RESULTS = 476

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
  const generatedQuery = {
    from: baseQueryParams.esPaginationOptions?.from || 0,
    size: baseQueryParams.esPaginationOptions?.size || 1000,
    query: {
      bool: {
        ...baseQueryParams.nestedQuery,
        filter: [
          ...(baseQueryParams.filters || []),
          getFilterTerm('chainId', baseQueryParams.chainIds),
          getFilterTerm('_index', 'aquarius'),
          ...(baseQueryParams.ignorePurgatory
            ? []
            : [getFilterTerm('purgatory.state', 'false')])
        ]
      }
    }
  } as SearchQuery

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
    totalResults: 0
  }

  result.results = (queryResult.hits.hits || []).map(
    (hit) => hit._source as Asset
  )
  result.totalResults = queryResult.hits.total
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

export async function retrieveDDO(
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

export async function getAssetsFromDidList(
  didList: string[],
  chainIds: number[],
  cancelToken: CancelToken
): Promise<any> {
  try {
    if (!(didList.length > 0)) return

    const baseParams = {
      chainIds: chainIds,
      filters: [getFilterTerm('id', didList)],
      ignorePurgatory: true
    } as BaseQueryParams
    const query = generateBaseQuery(baseParams)

    const queryResult = await queryMetadata(query, cancelToken)
    return queryResult
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function retrieveDDOListByDIDs(
  didList: string[],
  chainIds: number[],
  cancelToken: CancelToken
): Promise<Asset[]> {
  try {
    if (didList?.length === 0 || chainIds?.length === 0) return []
    const orderedDDOListByDIDList: Asset[] = []
    const baseQueryparams = {
      chainIds,
      filters: [getFilterTerm('id', didList)],
      ignorePurgatory: true
    } as BaseQueryParams
    const query = generateBaseQuery(baseQueryparams)
    const result = await queryMetadata(query, cancelToken)
    didList.forEach((did: string) => {
      const ddo = result.results.find((ddo: Asset) => ddo.id === did)
      orderedDDOListByDIDList.push(ddo)
    })
    return orderedDDOListByDIDList
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function transformDDOToAssetSelection(
  datasetProviderEndpoint: string,
  ddoList: Asset[],
  selectedAlgorithms?: PublisherTrustedAlgorithm[],
  cancelToken?: CancelToken
): Promise<AssetSelectionAsset[]> {
  const didList: string[] = []
  const priceList: PriceList = await getAssetsPriceList(ddoList)
  const symbolList: any = {}
  const didProviderEndpointMap: any = {}
  for (const ddo of ddoList) {
    didList.push(ddo.id)
    symbolList[ddo.id] = ddo.datatokens[0].symbol
    const algoComputeService = getServiceByName(ddo, 'compute')
    algoComputeService?.serviceEndpoint &&
      (didProviderEndpointMap[ddo.id] = algoComputeService?.serviceEndpoint)
  }
  const ddoNames = await getAssetsNames(didList, cancelToken)
  const algorithmList: AssetSelectionAsset[] = []
  didList?.forEach((did: string) => {
    if (
      priceList[did] &&
      (!didProviderEndpointMap[did] ||
        didProviderEndpointMap[did] === datasetProviderEndpoint)
    ) {
      let selected = false
      selectedAlgorithms?.forEach((algorithm: PublisherTrustedAlgorithm) => {
        if (algorithm.did === did) {
          selected = true
        }
      })
      selected
        ? algorithmList.unshift({
            did: did,
            name: ddoNames[did],
            price: priceList[did],
            checked: selected,
            symbol: symbolList[did]
          })
        : algorithmList.push({
            did: did,
            name: ddoNames[did],
            price: priceList[did],
            checked: selected,
            symbol: symbolList[did]
          })
    }
  })
  return algorithmList
}

export async function getAlgorithmDatasetsForCompute(
  algorithmId: string,
  datasetProviderUri: string,
  datasetChainId?: number,
  cancelToken?: CancelToken
): Promise<AssetSelectionAsset[]> {
  const baseQueryParams = {
    chainIds: [datasetChainId],
    filters: [
      getFilterTerm(
        'service.attributes.main.privacy.publisherTrustedAlgorithms.did',
        algorithmId
      )
    ],
    sortOptions: {
      sortBy: SortTermOptions.Created,
      sortDirection: SortDirectionOptions.Descending
    }
  } as BaseQueryParams

  const query = generateBaseQuery(baseQueryParams)
  const computeDatasets = await queryMetadata(query, cancelToken)

  if (computeDatasets.totalResults === 0) return []

  const datasets = await transformDDOToAssetSelection(
    datasetProviderUri,
    computeDatasets.results,
    [],
    cancelToken
  )
  return datasets
}

export async function getPublishedAssets(
  accountId: string,
  chainIds: number[],
  cancelToken: CancelToken,
  page?: number,
  type?: string,
  accesType?: string
): Promise<PagedAssets> {
  if (!accountId) return

  const filters: FilterTerm[] = []

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

export async function getDownloadAssets(
  didList: string[],
  tokenOrders: OrdersData[],
  chainIds: number[],
  cancelToken: CancelToken
): Promise<DownloadedAsset[]> {
  try {
    const baseQueryparams = {
      chainIds,
      filters: [
        getFilterTerm('id', didList),
        getFilterTerm('service.type', 'access')
      ]
    } as BaseQueryParams
    const query = generateBaseQuery(baseQueryparams)
    const result = await queryMetadata(query, cancelToken)

    const downloadedAssets: DownloadedAsset[] = result.results
      .map((ddo) => {
        const order = tokenOrders.find(
          ({ datatoken }) =>
            datatoken?.address.toLowerCase() ===
            ddo.services[0].datatokenAddress.toLowerCase()
        )

        return {
          ddo,
          networkId: ddo.chainId,
          dtSymbol: order?.datatoken?.symbol,
          timestamp: order?.createdTimestamp
        }
      })
      .sort((a, b) => b.timestamp - a.timestamp)

    return downloadedAssets
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}
