import { useState, useEffect } from 'react'
import Web3 from 'web3'
import fetch from 'cross-fetch'
import { useOcean } from '../providers/Ocean'
import { useWeb3 } from '../providers/Web3'

const refreshInterval = 12000
const blockDifferenceThreshold = 30
const ethGraphUrl = `https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks`
const ethGraphQuery =
  '{"query":"  query Blocks{   blocks(first: 1, skip: 0, orderBy: number, orderDirection: desc, where: {number_gt: 9300000}) { id number timestamp  author  difficulty  gasUsed  gasLimit } }","variables":{},"operationName":"Blocks"}'
const graphQuery =
  '{"query":"  query Meta {   _meta {      block {        hash       number     }      deployment      hasIndexingErrors    }  }","variables":{},"operationName":"Meta"}'

async function fetchGraph(url: string, queryBody: string): Promise<Response> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: queryBody
    })

    return response.json()
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}

export function useGraphSyncStatus(): {
  isGraphSynced: boolean
  blockNumber: number
  graphBlockNumber: number
  state: 'success' | 'warning'
} {
  const { config } = useOcean()
  const { web3 } = useWeb3()
  const [state, setState] = useState<'success' | 'warning'>()
  const [blockNumber, setBlockNumber] = useState<number>()
  const [graphBlockNumber, setGraphBlockNumber] = useState<number>()
  const [isGraphSynced, setIsGraphSynced] = useState(true)

  async function getBlockFromPolygon() {
    console.log('Polygon')
    const web3Polygon = new Web3(config.nodeUri)
    const blockNumber = await web3Polygon.eth.getBlockNumber()
    setBlockNumber(blockNumber)
  }

  async function getBlockFromWeb3() {
    console.log('withProvider')
    const blockNumber = await web3.eth.getBlockNumber()
    setBlockNumber(blockNumber)
  }

  async function getBlockFromETH() {
    const response: any = await fetchGraph(ethGraphUrl, ethGraphQuery)
    setBlockNumber(response.data.blocks[0].number)
  }

  async function getBlockFromGraph() {
    const response: any = await fetchGraph(
      `${config.subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,
      graphQuery
    )
    setGraphBlockNumber(response.data._meta.block.number)
  }

  useEffect(() => {
    if (!config) return

    getBlockFromGraph()
    const timer = setInterval(() => getBlockFromGraph(), refreshInterval)

    web3
      ? getBlockFromWeb3()
      : config.network === 'mainnet'
      ? getBlockFromETH()
      : getBlockFromPolygon()

    return () => {
      clearInterval(timer)
    }
  }, [web3, config])

  useEffect(() => {
    if (!blockNumber && !graphBlockNumber) return
    const difference = blockNumber - graphBlockNumber
    console.log(difference)

    if (difference > blockDifferenceThreshold) {
      setState('warning')
      setIsGraphSynced(false)
      return
    }
    setState('success')
    setIsGraphSynced(true)
  }, [blockNumber, graphBlockNumber])

  console.log(blockNumber)
  console.log(graphBlockNumber)

  /* useSWR(config.subgraphUri, fetchData, {
    onSuccess: (data) => {
      console.log('Graph',data)
      setGraphBlockNumber(data.data._meta.block.number)
    }
  })

  useSWR(ethGraphUrl, fetchETH, {
    onSuccess: (data: any) => {
      console.log('ETH',data)
      setBlockNumber(data.data.blocks[0].number)
    }
  })
  */

  return { blockNumber, graphBlockNumber, state, isGraphSynced }
}
