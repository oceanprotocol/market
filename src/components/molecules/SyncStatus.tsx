import React, { ReactElement, useEffect, useState } from 'react'
import styles from './SyncStatus.module.css'
import Status from '../atoms/Status'
import { useWeb3 } from '../../providers/Web3'
import useSWR from 'swr'
import { useOcean } from '../../providers/Ocean'
import fetch from 'cross-fetch'
const refreshInterval = 120000

export default function SyncStatus(): ReactElement {
  const { web3 } = useWeb3()
  const { config } = useOcean()
  const [state, setState] = useState<string>('success')
  const [blockNumber, setBlockNumber] = useState<number>()

  useEffect(() => {
    web3 && web3.eth.getBlockNumber().then((resp) => setBlockNumber(resp))
  }, [web3])

  async function fetchData(url: string): Promise<Response> {
    try {
      const queryBody =
        '{"query":"  query Meta {   _meta {      block {        hash       number     }      deployment      hasIndexingErrors    }  }","variables":{},"operationName":"Meta"}'
      const response = await fetch(
        `${url}/subgraphs/name/oceanprotocol/ocean-subgraph`,
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
  const onSuccess = async (data: any) => {
    console.log(data)
  }

  useSWR(config.subgraphUri, fetchData, {
    refreshInterval,
    onSuccess
  })
  return (
    <div className={styles.sync}>
      <span className={styles.text}>{blockNumber}</span>
      <Status state={state} />
    </div>
  )
}
