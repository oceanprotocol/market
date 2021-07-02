import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '../../../providers/Asset'
import ExplorerLink from '../../atoms/ExplorerLink'
import Time from '../../atoms/Time'
import styles from './EditHistory.module.css'
import { gql, useQuery } from 'urql'
import { useWeb3 } from '../../../providers/Web3'

const getReceipts = gql`
  query ReceiptData($address: ID!) {
    datatokens(where: { id: $address }) {
      updates(orderBy: timestamp, orderDirection: desc) {
        id
        tx
        timestamp
      }
    }
  }
`

export default function EditHistory(): ReactElement {
  const { networkId } = useWeb3()
  const { ddo } = useAsset()
  const [result] = useQuery({
    query: getReceipts,
    variables: { address: ddo?.dataToken.toLowerCase() }
  })
  const { data } = result

  const [receipts, setReceipts] = useState<ReceiptData[]>()
  const [creationTx, setCreationTx] = useState<string>()

  useEffect(() => {
    if (!data || data.datatokens.length === 0) return

    const receiptCollectionLength = data.datatokens[0].updates.length
    const creationData = data.datatokens[0].updates[receiptCollectionLength - 1]
    setCreationTx(creationData.tx)

    const receiptCollection = [...data.datatokens[0].updates]
    receiptCollection.splice(-1, 1)

    setReceipts(receiptCollection)
  }, [data])

  return (
    <>
      <h3 className={styles.title}>Metadata History</h3>
      <ul className={styles.history}>
        {receipts?.map((receipt) => (
          <li key={receipt.id} className={styles.item}>
            <ExplorerLink networkId={networkId} path={`/tx/${receipt.tx}`}>
              edited{' '}
              <Time date={receipt.timestamp.toString()} relative isUnix />
            </ExplorerLink>
          </li>
        ))}
        <li className={styles.item}>
          <ExplorerLink networkId={networkId} path={`/tx/${creationTx}`}>
            published <Time date={ddo.created} relative />
          </ExplorerLink>
        </li>
      </ul>
    </>
  )
}
