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
import { DDO_TEMPORARY } from '../providers/Ocean'

function getQueryForAlgorithmDatasets(algorithmDid: string) {
  return {
    query: {
      query_string: {
        query: `service.attributes.main.privacy.publisherTrustedAlgorithms.did:${algorithmDid}`
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

export function transformChainIdsListToQuery(chainIds: number[]) {
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
): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `https://multiaqua.oceanprotocol.com/api/v1/aquarius/assets/ddo/query`,
      { ...query, cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return
    console.log(response.data)
    return transformQueryResult(response.data)
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(error.message)
    }
  }
}

/*
  --for sorting results
  datas.results.sort((ddo1, ddo2) => {
    if (ddo1.created < ddo2.created) return 1
    if (ddo1.created > ddo2.created) return -1
    return 0
  })
  datas.results = datas.results.slice(0, 9)
*/

export async function retrieveDDO(
  did: string | DID,
  chainId: number,
  cancelToken: CancelToken,
  metadataCacheUri?: string
): Promise<DDO_TEMPORARY> {
  try {
    const response: AxiosResponse<DDO> = await axios.get(
      `https://multiaqua.oceanprotocol.com/api/v1/aquarius/assets/ddo/${did}`,
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return

    // TODO: remove hacking in chainId in DDO response once Aquarius gives us that
    const data = { ...response.data, chainId: 1 }
    return new DDO(data) as DDO_TEMPORARY
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
  chainList: number[],
  cancelToken: CancelToken
): Promise<Record<string, string>> {
  try {
    const response: AxiosResponse<Record<string, string>> = await axios.post(
      `https://multiaqua.oceanprotocol.com/api/v1/aquarius/assets/names`,
      {
        didList,
        cancelToken
      }
    )
    if (!response || response.status !== 200 || !response.data) return

    console.log(response.data.total_pages)

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
  metadataCacheUri: string,
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
  const ddoNames = await getAssetsNames(didList, metadataCacheUri, source.token)
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
  metadataCacheUri: string
): Promise<AssetSelectionAsset[]> {
  const source = axios.CancelToken.source()
  const computeDatasets = await queryMetadata(
    getQueryForAlgorithmDatasets(algorithmId),
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
    metadataCacheUri,
    []
  )
  return datasets
}
