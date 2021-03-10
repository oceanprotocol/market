import { DDO, DID, Logger } from '@oceanprotocol/lib/'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { AlgorithmOption } from '../@types/ComputeDataset'
import axios, { CancelToken, AxiosResponse } from 'axios'
import web3 from 'web3'

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

export async function queryMetadata(
  query: SearchQuery,
  metadataCacheUri: string,
  cancelToken: CancelToken
): Promise<QueryResult> {
  try {
    const response: AxiosResponse<QueryResult> = await axios.post(
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
  metadataCacheUri: string,
  cancelToken: CancelToken
): Promise<DDO> {
  try {
    const response: AxiosResponse<DDO> = await axios.get(
      `${metadataCacheUri}/api/v1/aquarius/assets/ddo/${did}`,
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return

    return new DDO(response.data)
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
  metadataCacheUri: string,
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

export async function getAlgorithmsOptions(
  config: any
): Promise<AlgorithmOption[]> {
  const query = {
    page: 1,
    query: {
      nativeSearch: 1,
      query_string: {
        query: `(service.attributes.main.type:algorithm) -isInPurgatory:true`
      }
    },
    sort: { created: -1 }
  }
  const source = axios.CancelToken.source()
  const didList: string[] = []
  const result = await queryMetadata(
    query as any,
    config.metadataCacheUri,
    source.token
  )
  result.results.forEach((ddo: DDO) => {
    const did: string = web3.utils
      .toChecksumAddress(ddo.dataToken)
      .replace('0x', 'did:op:')
    didList.push(did)
  })
  const ddoNames = await getAssetsNames(
    didList,
    config.metadataCacheUri,
    source.token
  )
  const algorithmList: AlgorithmOption[] = []
  didList.forEach((did: string) => {
    algorithmList.push({
      did: did,
      name: ddoNames[did]
    })
  })
  return algorithmList
}
