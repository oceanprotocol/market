import {
  DDO,
  DID,
  Logger,
  publisherTrustedAlgorithm as PublisherTrustedAlgorithm
} from '@oceanprotocol/lib/'

import { AssetSelectionAsset } from '../components/molecules/FormFields/AssetSelection'
import { PriceList, getAssetsPriceList } from './subgraph'
import axios, { CancelToken, AxiosResponse } from 'axios'
import { OrdersData_tokenOrders as OrdersData } from '../@types/apollo/OrdersData'
import { metadataCacheUri } from '../../app.config'
import { DownloadedAsset } from '../models/aquarius/DownloadedAsset'
import { SearchQuery } from '../models/aquarius/SearchQuery'
import { SearchResponse } from '../models/aquarius/SearchResponse'
import { PagedAssets } from '../models/PagedAssets'
import { SortDirectionOptions } from '../models/SortAndFilters'
import { FilterTerm } from '../models/aquarius/FilterTerm'
import { BaseQueryParams } from '../models/aquarius/BaseQueryParams'

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
  const baseFilters = [
    getFilterTerm('chainId', baseQueryParams.chainIds),
    getFilterTerm('_index', 'aquarius'),
    getFilterTerm('isInPurgatory', 'false')
  ]
  const generatedQuery = {
    from: baseQueryParams.esPaginationOptions?.from || 0,
    size: baseQueryParams.esPaginationOptions?.size || 1000,
    query: {
      bool: {
        ...baseQueryParams.nestedQuery,
        filter: [
          ...(baseQueryParams.filters || []),
          ...(baseQueryParams.ignoreDefaultFilters ? [] : baseFilters)
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
    (hit) => new DDO(hit._source as DDO)
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
      `${metadataCacheUri}/api/v1/aquarius/assets/query`,
      { ...query },
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return
    return transformQueryResult(response.data, query.from, query.size)
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(error.message)
    }
  }
}

export async function retrieveDDO(
  did: string | DID,
  cancelToken: CancelToken
): Promise<DDO> {
  try {
    const response: AxiosResponse<DDO> = await axios.get(
      `${metadataCacheUri}/api/v1/aquarius/assets/ddo/${did}`,
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return

    const data = { ...response.data }
    return new DDO(data)
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(error.message)
    }
  }
}

export async function getAssetsNames(
  didList: string[] | DID[],
  cancelToken: CancelToken
): Promise<Record<string, string>> {
  try {
    const response: AxiosResponse<Record<string, string>> = await axios.post(
      `${metadataCacheUri}/api/v1/aquarius/assets/names`,
      { didList },
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return
    return response.data
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(error.message)
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
      filters: [getFilterTerm('id', didList)]
    } as BaseQueryParams
    const query = generateBaseQuery(baseParams)

    const queryResult = await queryMetadata(query, cancelToken)
    return queryResult
  } catch (error) {
    Logger.error(error.message)
  }
}

// under this needs to be removed or moved

export function transformChainIdsListToQuery(chainIds: number[]): string {
  let chainQuery = ''
  chainIds.forEach((chainId) => {
    chainQuery += `chainId:${chainId} OR `
  })
  chainQuery = chainQuery.slice(0, chainQuery.length - 4)
  return chainQuery
}

export function transformDIDListToQuery(didList: string[] | DID[]): string {
  let chainQuery = ''
  const regex = new RegExp('(:)', 'g')
  didList.forEach((did: any) => {
    chainQuery += `id:${did.replace(regex, '\\:')} OR `
  })
  chainQuery = chainQuery.slice(0, chainQuery.length - 4)
  return chainQuery
}
function getQueryForAlgorithmDatasets(
  algorithmDid: string,
  chainId?: number
): SearchQuery {
  return {
    query: {
      bool: {
        must: [
          {
            match: {
              'service.attributes.main.privacy.publisherTrustedAlgorithms.did':
                algorithmDid
            }
          },
          {
            query_string: {
              query: `chainId:${chainId}`
            }
          }
        ]
      }
    },
    sort: { created: SortDirectionOptions.Descending }
  }
}

export async function transformDDOToAssetSelection(
  datasetProviderEndpoint: string,
  ddoList: DDO[],
  selectedAlgorithms?: PublisherTrustedAlgorithm[],
  cancelToken?: CancelToken
): Promise<AssetSelectionAsset[]> {
  const didList: string[] = []
  const priceList: PriceList = await getAssetsPriceList(ddoList)
  const symbolList: any = {}
  const didProviderEndpointMap: any = {}
  for (const ddo of ddoList) {
    didList.push(ddo.id)
    symbolList[ddo.id] = ddo.dataTokenInfo.symbol
    const algoComputeService = ddo.findServiceByType('compute')
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
  const computeDatasets = await queryMetadata(
    getQueryForAlgorithmDatasets(algorithmId, datasetChainId),
    cancelToken
  )
  const computeDatasetsForCurrentAlgorithm: DDO[] = []
  computeDatasets.results.forEach((data: DDO) => {
    const algorithm = data
      .findServiceByType('compute')
      .attributes.main.privacy.publisherTrustedAlgorithms.find(
        (algo) => algo.did === algorithmId
      )
    algorithm && computeDatasetsForCurrentAlgorithm.push(data)
  })
  if (computeDatasetsForCurrentAlgorithm.length === 0) {
    return []
  }
  const datasets = await transformDDOToAssetSelection(
    datasetProviderUri,
    computeDatasetsForCurrentAlgorithm,
    [],
    cancelToken
  )
  return datasets
}

export async function retrieveDDOListByDIDs(
  didList: string[] | DID[],
  chainIds: number[],
  cancelToken: CancelToken
): Promise<DDO[]> {
  try {
    if (didList?.length === 0 || chainIds?.length === 0) return []
    const orderedDDOListByDIDList: DDO[] = []
    const query = {
      size: didList.length,
      query: {
        query_string: {
          query: `(${transformDIDListToQuery(
            didList
          )})  AND (${transformChainIdsListToQuery(chainIds)})`
        }
      }
    }
    const result = await queryMetadata(query, cancelToken)
    didList.forEach((did: string | DID) => {
      const ddo: DDO = result.results.find((ddo: DDO) => ddo.id === did)
      orderedDDOListByDIDList.push(ddo)
    })
    return orderedDDOListByDIDList
  } catch (error) {
    Logger.error(error.message)
  }
}

export async function getPublishedAssets(
  accountId: string,
  chainIds: number[],
  cancelToken: CancelToken,
  page?: number,
  type?: string,
  accesType?: string
): Promise<any> {
  if (!accountId) return

  type = type || 'dataset OR algorithm'
  accesType = accesType || 'access OR compute'

  const queryPublishedAssets = {
    from: (Number(page) - 1 || 0) * (Number(9) || 21),
    size: Number(9) || 21,
    query: {
      query_string: {
        query: `(publicKey.owner:${accountId}) AND (service.attributes.main.type:${type}) AND (service.type:${accesType}) AND (${chainIds})`
      }
    },
    sort: { created: 'desc' }
  } as SearchQuery
  try {
    const result = await queryMetadata(queryPublishedAssets, cancelToken)
    return result
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(error.message)
    }
  }
}

export async function getDownloadAssets(
  didList: string[],
  tokenOrders: OrdersData[],
  chainIds: number[],
  cancelToken: CancelToken
): Promise<DownloadedAsset[]> {
  const downloadedAssets: DownloadedAsset[] = []

  try {
    const queryResult = await retrieveDDOListByDIDs(
      didList,
      chainIds,
      cancelToken
    )
    const ddoList = queryResult

    for (let i = 0; i < tokenOrders?.length; i++) {
      const ddo = ddoList.filter(
        (ddo: { dataToken: string }) =>
          tokenOrders[i].datatokenId.address.toLowerCase() ===
          ddo.dataToken.toLowerCase()
      )[0]

      // make sure we are only pushing download orders
      if (ddo.service[1].type !== 'access') continue

      downloadedAssets.push({
        ddo,
        networkId: ddo.chainId,
        dtSymbol: tokenOrders[i].datatokenId.symbol,
        timestamp: tokenOrders[i].timestamp
      })
    }

    const sortedOrders = downloadedAssets.sort(
      (a, b) => b.timestamp - a.timestamp
    )
    return sortedOrders
  } catch (error) {
    Logger.error(error.message)
  }
}
