import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '@context/Asset'
import ExplorerLink from '@shared/ExplorerLink'
import Time from '@shared/atoms/Time'
import { gql, OperationContext, useQuery } from 'urql'
import { ReceiptData_nftUpdates as ReceiptData } from '../../../@types/subgraph/ReceiptData'
import { getQueryContext } from '@utils/subgraph'
import styles from './EditHistory.module.css'

const getReceipts = gql`
  query ReceiptData($address: ID!) {
    nftUpdates(
      where: { id: $address }
      subgraphError: deny
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      tx
      timestamp
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
    variables: { address: ddo?.services[0].datatokenAddress.toLowerCase() },
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
    if (!data || data.nftUpdates.length === 0) return

    const receiptCollectionLength = data.nftUpdates.length
    const creationData = data.nftUpdates[receiptCollectionLength - 1]
    setCreationTx(creationData.tx)

    const receiptCollection = [...data.nftUpdates]
    receiptCollection.splice(-1, 1)

    setReceipts(receiptCollection)
  }, [data])

  return (
    <>
      <h3 className={styles.title}>Metadata History</h3>
      <ul className={styles.history}>
        {receipts?.map((receipt) => (
          <li key={receipt.id} className={styles.item}>
            <ExplorerLink networkId={ddo?.chainId} path={`/tx/${receipt.tx}`}>
              edited <Time date={`${receipt.timestamp}`} relative isUnix />
            </ExplorerLink>
          </li>
        ))}
        <li className={styles.item}>
          <ExplorerLink networkId={ddo?.chainId} path={`/tx/${creationTx}`}>
            published <Time date={ddo?.metadata?.created} relative />
          </ExplorerLink>
        </li>
      </ul>
    </>
  )
}
