import { useState, useEffect } from 'react'
import { Config, LoggerInstance } from '@oceanprotocol/lib'
import axios, { AxiosResponse } from 'axios'
import { getOceanConfig } from '@utils/ocean'
import { useBlockNumber } from 'wagmi'

const blockDifferenceThreshold = 30
const graphQueryBody =
  '{"query": "query Meta { _meta { block { hash number } deployment hasIndexingErrors } }", "variables": {},"operationName":"Meta"}'

export interface UseGraphSyncStatus {
  isGraphSynced: boolean
  blockHead: number
  blockGraph: number
}

async function fetchGraph(
  url: string,
  queryBody: string
): Promise<AxiosResponse> {
  try {
    const response = await axios.post(url, { ...JSON.parse(queryBody) })
    return response
  } catch (error) {
    LoggerInstance.error('Error parsing json: ' + error.message)
  }
}

async function getBlockSubgraph(subgraphUri: string) {
  const response: any = await fetchGraph(
    `${subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
    graphQueryBody
  )
  const blockNumberGraph = Number(response?.data?.data?._meta?.block?.number)
  return blockNumberGraph
}

export function useGraphSyncStatus(networkId: number): UseGraphSyncStatus {
  const { data: blockHead, isLoading } = useBlockNumber()
  const [blockGraph, setBlockGraph] = useState<number>()
  const [isGraphSynced, setIsGraphSynced] = useState(true)
  const [isSubgraphLoading, setIsSubgraphLoading] = useState(false)
  const [oceanConfig, setOceanConfig] = useState<Config>()

  // Grab ocean config based on passed networkId
  useEffect(() => {
    if (!networkId) return

    const oceanConfig = getOceanConfig(networkId)
    setOceanConfig(oceanConfig)
  }, [networkId])

  // Log head block
  useEffect(() => {
    if (!blockHead) return
    LoggerInstance.log('[GraphStatus] Head block: ', blockHead)
  }, [blockHead])

  // Get and set subgraph block
  useEffect(() => {
    if (!oceanConfig?.subgraphUri) return

    async function initBlockSubgraph() {
      setIsSubgraphLoading(true)
      const blockGraph = await getBlockSubgraph(oceanConfig.subgraphUri)
      setBlockGraph(blockGraph)
      setIsSubgraphLoading(false)
      LoggerInstance.log(
        '[GraphStatus] Latest block from subgraph: ',
        blockGraph
      )
    }
    initBlockSubgraph()
  }, [oceanConfig])

  // Set sync status
  useEffect(() => {
    if ((!blockGraph && !blockHead) || isLoading || isSubgraphLoading) return

    const difference = blockHead - blockGraph

    if (difference > blockDifferenceThreshold) {
      setIsGraphSynced(false)
      return
    }
    setIsGraphSynced(true)
  }, [blockGraph, blockHead, isLoading, isSubgraphLoading])

  return { blockHead, blockGraph, isGraphSynced }
}
