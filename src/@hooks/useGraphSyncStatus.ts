import { useState, useEffect } from 'react'
import { useWeb3 } from '@context/Web3'
import { Config, LoggerInstance } from '@oceanprotocol/lib'
import Web3 from 'web3'
import axios, { AxiosResponse } from 'axios'
import { getOceanConfig } from '@utils/ocean'

const blockDifferenceThreshold = 30
const ethGraphUrl = `https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks`
const ethGraphQueryBody =
  '{"query":"  query Blocks{   blocks(first: 1, skip: 0, orderBy: number, orderDirection: desc, where: {number_gt: 9300000}) { id number timestamp  author  difficulty  gasUsed  gasLimit } }","variables":{},"operationName":"Blocks"}'
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

async function getBlockHead(config: Config) {
  if (!config) return
  // for ETH main, get block from graph fetch
  if (config.network === 'mainnet') {
    const response: any = await fetchGraph(ethGraphUrl, ethGraphQueryBody)
    return Number(response?.data?.blocks[0]?.number)
  }

  // for everything else, create new web3 instance with infura
  // TODO: this fails randomly , WHY!?!?!?!?!
  const web3Instance = new Web3(config.nodeUri)
  const blockHead = await web3Instance.eth.getBlockNumber()
  return blockHead
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
  const { block, web3Loading } = useWeb3()
  const [blockGraph, setBlockGraph] = useState<number>()
  const [blockHead, setBlockHead] = useState<number>()
  const [isGraphSynced, setIsGraphSynced] = useState(true)
  const [subgraphLoading, setSubgraphLoading] = useState(false)
  const [oceanConfig, setOceanConfig] = useState<Config>()

  // Grab ocean config based on passed networkId
  useEffect(() => {
    if (!networkId) return

    const oceanConfig = getOceanConfig(networkId)
    setOceanConfig(oceanConfig)
  }, [networkId])

  // Get and set head block
  useEffect(() => {
    if (!oceanConfig?.nodeUri || web3Loading) return

    async function initBlockHead() {
      const blockHead = block || (await getBlockHead(oceanConfig))
      setBlockHead(blockHead)
      LoggerInstance.log('[GraphStatus] Head block: ', blockHead)
    }
    initBlockHead()
  }, [web3Loading, block, oceanConfig])

  // Get and set subgraph block
  useEffect(() => {
    if (!oceanConfig?.subgraphUri) return

    async function initBlockSubgraph() {
      setSubgraphLoading(true)
      const blockGraph = await getBlockSubgraph(oceanConfig.subgraphUri)
      setBlockGraph(blockGraph)
      setSubgraphLoading(false)
      LoggerInstance.log(
        '[GraphStatus] Latest block from subgraph: ',
        blockGraph
      )
    }
    initBlockSubgraph()
  }, [oceanConfig])

  // Set sync status
  useEffect(() => {
    if ((!blockGraph && !blockHead) || web3Loading || subgraphLoading) return

    const difference = blockHead - blockGraph

    if (difference > blockDifferenceThreshold) {
      setIsGraphSynced(false)
      return
    }
    setIsGraphSynced(true)
  }, [blockGraph, blockHead, web3Loading, subgraphLoading])

  return { blockHead, blockGraph, isGraphSynced }
}
