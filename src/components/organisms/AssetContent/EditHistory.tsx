import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '../../../providers/Asset'
import ExplorerLink from '../../atoms/ExplorerLink'
import Time from '../../atoms/Time'
import { gql, OperationContext, useQuery } from 'urql'
import { ReceiptData_datatokens_updates as ReceiptData } from '../../../@types/apollo/ReceiptData'
import { getQueryContext } from '../../../utils/subgraph'
import styles from './EditHistory.module.css'

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
  const { ddo } = useAsset()

  //
  // 1. Construct subgraph query based on DDO.
  // Need to wait for it to avoid infinite rerender loop with useQuery.
  //
  const [queryContext, setQueryContext] = useState<OperationContext>()

  useEffect(() => {
    if (!ddo) return

    const queryContext = getQueryContext(ddo.chainId)
    setQueryContext(queryContext)
  }, [ddo])

  const [result] = useQuery({
    query: getReceipts,
    variables: { address: ddo?.dataToken.toLowerCase() },
    context: queryContext,
    pause: !ddo || !queryContext
  })
  const { data } = result

  //
  // 2. Construct display data based on fetched data.
  //
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
            <ExplorerLink networkId={ddo.chainId} path={`/tx/${receipt.tx}`}>
              edited <Time date={`${receipt.timestamp}`} relative isUnix />
            </ExplorerLink>
          </li>
        ))}
        <li className={styles.item}>
          <ExplorerLink networkId={ddo.chainId} path={`/tx/${creationTx}`}>
            published <Time date={ddo.created} relative />
          </ExplorerLink>
        </li>
      </ul>
    </>
  )
}
