import React, { ReactElement, useEffect, useState } from 'react'
import styles from './SyncStatus.module.css'
import Status from '../atoms/Status'
import { useWeb3 } from '../../providers/Web3'
import Web3 from 'web3'
import useSWR from 'swr'
import { useOcean } from '../../providers/Ocean'
import fetch from 'cross-fetch'
const refreshInterval = 12000
const blockDifferenceTreshold = 30
const ethGraphUrl = `https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks`
const ethGraphQuery = '{"query":"  query Blocks{   blocks(first: 1, skip: 0, orderBy: number, orderDirection: desc, where: {number_gt: 9300000}) { id number timestamp  author  difficulty  gasUsed  gasLimit } }","variables":{},"operationName":"Blocks"}'
const graphQuery = '{"query":"  query Meta {   _meta {      block {        hash       number     }      deployment      hasIndexingErrors    }  }","variables":{},"operationName":"Meta"}'

async function fetchGraph(url: string, queryBody: string): Promise<Response> {
  try {
    const response = await fetch(
      url,
      {
        method: 'POST',
        body: queryBody
      }
    )

    return response.json()
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}

export default function SyncStatus(): ReactElement {
  const { config } = useOcean()
  const { web3, web3Provider } = useWeb3()
  const [state, setState] = useState<string>('success')
  const [blockNumber, setBlockNumber] = useState<number>()
  const [graphBlockNumber, setGraphBlockNumber] = useState<number>()

  useEffect(() => {
    if(!config) return
    getBlockFromGraph()
    web3 ? getBlockFromWeb3() : config.network==='mainnet' ? getBlockFromETH() : getBlockFromPolygon();
  }, [web3, config])

  useEffect(() => {
    if(!blockNumber && !graphBlockNumber) return
    const difference = blockNumber - graphBlockNumber
    console.log(difference)
    difference > blockDifferenceTreshold ? setState('warning') : setState('success')
  },[blockNumber,graphBlockNumber])

  console.log(blockNumber)
  console.log(graphBlockNumber)

  function getBlockFromPolygon(){
    console.log('Polygon')
    const web3Polygon = new Web3(config.nodeUri)
    web3Polygon.eth.getBlockNumber().then((resp: any) => setBlockNumber(resp))
  }

  function getBlockFromWeb3(){
    console.log('withProvider')
    web3.eth.getBlockNumber().then((resp: any) => {
      setBlockNumber(resp)
    })
  }

  async function getBlockFromETH(){
    const response:any = await fetchGraph(ethGraphUrl,ethGraphQuery)
    setBlockNumber(response.data.blocks[0].number)
  }

  async function getBlockFromGraph(){
    const response:any = await fetchGraph(`${config.subgraphUri}/subgraphs/name/oceanprotocol/ocean-subgraph`,graphQuery)
    setGraphBlockNumber(response.data._meta.block.number)
  }

  /*useSWR(config.subgraphUri, fetchData, {
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

  return (
    <div className={styles.sync}>
      <span className={styles.text}>{blockNumber}</span>
      <Status state={state} />
    </div>
  )
}
