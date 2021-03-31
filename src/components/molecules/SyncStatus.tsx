import React, { ReactElement, useEffect, useState } from 'react'
import styles from './SyncStatus.module.css'
import Status from '../atoms/Status'
import { useWeb3 } from '../../providers/Web3'
import { gql, useQuery } from '@apollo/client'

const blockInfo = gql`
  query Meta {
    _meta {
      block {
        hash
        number
      }
      deployment
      hasIndexingErrors
    }
  }
`

export default function SyncStatus(): ReactElement {
  const { web3 } = useWeb3()
  const [state, setState] = useState<string>('success')
  const [blockNumber, setBlockNumber] = useState<number>()
  const { data, error } = useQuery(blockInfo)
  useEffect(() => {
    web3 && web3.eth.getBlockNumber().then((resp) => setBlockNumber(resp))
  }, [web3])
  useEffect(() => {
    console.log(data)
    console.log(error)
    if (!data) return
    console.log(data)
  }, [data, error])
  return (
    <div className={styles.sync}>
      <span className={styles.text}>{blockNumber}</span>
      <Status state={state} />
    </div>
  )
}
