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
import { metadataCacheUri } from '../../app.config'

export const MAXIMUM_NUMBER_OF_PAGES_WITH_RESULTS = 476

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

export function transformDIDListToQuery(didList: string[] | DID[]): string {
  let chainQuery = ''
  didList.forEach((did: any) => {
    chainQuery += `id:${did} OR `
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
      { ...query, cancelToken }
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
      {
        didList,
        cancelToken
      }
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

export async function retrieveDDOListByChainIds(
  didList: string[] | DID[],
  cancelToken: CancelToken
): Promise<DDO[]> {
  const query = {
    query: {
      query_string: {
        query: `(${transformDIDListToQuery(didList)}) AND -isInPurgatory:true`
      }
    }
  }
  const result = await queryMetadata(query, cancelToken)
  return result.results
}
