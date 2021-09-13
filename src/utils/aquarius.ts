import {
  DDO,
  DID,
  Logger,
  publisherTrustedAlgorithm as PublisherTrustedAlgorithm
} from '@oceanprotocol/lib/'

import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { AssetSelectionAsset } from '../components/molecules/FormFields/AssetSelection'
import { PriceList, getAssetsPriceList } from './subgraph'
import axios, { CancelToken, AxiosResponse } from 'axios'
import { OrdersData_tokenOrders as OrdersData } from '../@types/apollo/OrdersData'
import { metadataCacheUri } from '../../app.config'
import web3 from '../../tests/unit/__mocks__/web3'

export interface DownloadedAsset {
  dtSymbol: string
  timestamp: number
  networkId: number
  ddo: DDO
}

function getQueryForAlgorithmDatasets(algorithmDid: string, chainId?: number) {
  return {
    query: {
      query_string: {
        query: `service.attributes.main.privacy.publisherTrustedAlgorithms.did:${algorithmDid} AND chainId:${chainId}`
      }
    },
    sort: { created: -1 }
  }
}

// TODO: import directly from ocean.js somehow.
// Transforming Aquarius' direct response is needed for getting actual DDOs
// and not just strings of DDOs. For now, taken from
// https://github.com/oceanprotocol/ocean.js/blob/main/src/metadatacache/MetadataCache.ts#L361-L375
export function transformQueryResult(
  {
    results,
    page,
    total_pages: totalPages,
    total_results: totalResults
  }: any = {
    result: [],
    page: 0,
    total_pages: 0,
    total_results: 0
  }
): QueryResult {
  return {
    results: (results || []).map((ddo: DDO) => new DDO(ddo as DDO)),
    page,
    totalPages,
    totalResults
  }
}

export function transformChainIdsListToQuery(chainIds: number[]): string {
  let chainQuery = ''
  chainIds.forEach((chainId) => {
    chainQuery += `chainId:${chainId} OR `
  })
  chainQuery = chainQuery.slice(0, chainQuery.length - 4)
  return chainQuery
}

export async function queryMetadata(
  query: SearchQuery,
  cancelToken: CancelToken
): Promise<QueryResult> {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${metadataCacheUri}/api/v1/aquarius/assets/ddo/query`,
      { ...query },
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return
    return transformQueryResult(response.data)
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

export async function transformDDOToAssetSelection(
  datasetProviderEndpoint: string,
  ddoList: DDO[],
  selectedAlgorithms?: PublisherTrustedAlgorithm[]
): Promise<AssetSelectionAsset[]> {
  const source = axios.CancelToken.source()
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
  const ddoNames = await getAssetsNames(didList, source.token)
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
  datasetChainId?: number
): Promise<AssetSelectionAsset[]> {
  const source = axios.CancelToken.source()
  const computeDatasets = await queryMetadata(
    getQueryForAlgorithmDatasets(algorithmId, datasetChainId),
    source.token
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
    []
  )
  return datasets
}

export async function getPublishedAssets(
  accountId: string,
  chainIds: number[],
  cancelToken: CancelToken,
  page?: number,
  type?: string
): Promise<QueryResult> {
  if (!accountId) return

  page = page || 1
  type = type || 'dataset OR algorithm'

  const queryPublishedAssets = {
    page,
    offset: 9,
    query: {
      query_string: {
        query: `(publicKey.owner:${accountId}) AND (service.attributes.main.type:${type}) AND (${transformChainIdsListToQuery(
          chainIds
        )})`
      }
    },
    sort: { created: -1 }
  }

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

export async function getAssetsFromDidList(
  didList: string[],
  chainIds: number[],
  cancelToken: CancelToken
): Promise<QueryResult> {
  try {
    // TODO: figure out cleaner way to transform string[] into csv
    const searchDids = JSON.stringify(didList)
      .replace(/,/g, ' ')
      .replace(/"/g, '')
      .replace(/(\[|\])/g, '')
      // for whatever reason ddo.id is not searchable, so use ddo.dataToken instead
      .replace(/(did:op:)/g, '0x')

    // safeguard against passed empty didList, preventing 500 from Aquarius
    if (!searchDids) return

    const query = {
      page: 1,
      offset: 1000,
      query: {
        query_string: {
          query: `(${searchDids}) AND (${transformChainIdsListToQuery(
            chainIds
          )})`,
          fields: ['dataToken'],
          default_operator: 'OR'
        }
      },
      sort: { created: -1 }
    }

    const queryResult = await queryMetadata(query, cancelToken)
    return queryResult
  } catch (error) {
    Logger.error(error.message)
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
    const queryResult = await getAssetsFromDidList(
      didList,
      chainIds,
      cancelToken
    )
    const ddoList = queryResult?.results

    for (let i = 0; i < tokenOrders?.length; i++) {
      const ddo = ddoList.filter(
        (ddo) =>
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
