import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '../../../providers/Asset'
import EtherscanLink from '../../atoms/EtherscanLink'
import Time from '../../atoms/Time'
import styles from './EditHistory.module.css'
import { gql, useQuery } from '@apollo/client'
import { ReceiptData_datatokens_updates as ReceiptData } from '../../../@types/apollo/ReceiptData'

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
  const { networkId } = useOcean()
  const { ddo } = useAsset()
  const { data } = useQuery(getReceipts, {
    variables: { address: ddo?.dataToken.toLowerCase() }
  })

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
            <EtherscanLink networkId={networkId} path={`/tx/${receipt.tx}`}>
              edited{' '}
              <Time date={receipt.timestamp.toString()} relative isUnix />
            </EtherscanLink>
          </li>
        ))}
        <li className={styles.item}>
          <EtherscanLink networkId={networkId} path={`/tx/${creationTx}`}>
            published <Time date={ddo.created} relative />
          </EtherscanLink>
        </li>
      </ul>
    </>
  )
}
