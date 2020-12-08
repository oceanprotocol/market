import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '../../../providers/Asset'
import EtherscanLink from '../../atoms/EtherscanLink'
import Time from '../../atoms/Time'
import styles from './EditHistory.module.css'

interface Receipt {
  hash: string
  timestamp: string
}

// TODO: fetch for real
const fakeReceipts = [
  {
    hash: '0xxxxxxxxx',
    timestamp: '1607460269'
  },
  {
    hash: '0xxxxxxxxx',
    timestamp: '1606460159'
  },
  {
    hash: '0xxxxxxxxx',
    timestamp: '1506460159'
  }
]

export default function EditHistory(): ReactElement {
  const { networkId } = useOcean()
  const { ddo } = useAsset()

  const [receipts, setReceipts] = useState<Receipt[]>()

  useEffect(() => {
    setReceipts(fakeReceipts)
  }, [])

  return (
    <>
      <h3 className={styles.title}>Metadata History</h3>
      <ul className={styles.history}>
        {receipts?.map((receipt) => (
          <li key={receipt.hash} className={styles.item}>
            <EtherscanLink networkId={networkId} path={`/tx/${receipt.hash}`}>
              edited <Time date={receipt.timestamp} relative isUnix />
            </EtherscanLink>
          </li>
        ))}
        <li className={styles.item}>
          {/* TODO: get this initial metadata creation tx somehow */}
          <EtherscanLink networkId={networkId} path="/tx/xxx">
            created <Time date={ddo.created} relative />
          </EtherscanLink>
        </li>
      </ul>
    </>
  )
}
