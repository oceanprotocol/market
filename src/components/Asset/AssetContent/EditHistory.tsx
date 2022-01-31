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
      where: { nft: $address }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      nft {
        address
      }
      tx
      timestamp
      type
    }
  }
`

export default function EditHistory(): ReactElement {
  const { ddo } = useAsset()

  function getUpdateType(type: string): string {
    switch (type) {
      case 'METADATA_CREATED':
        return 'published'
      case 'METADATA_UPDATED':
        return 'updated'
      case 'STATE_UPDATED':
        return 'state updated'
      case 'TOKENURI_UPDATED':
        return 'NFT metadata updated'
      default:
        return ''
    }
  }
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
    variables: { address: ddo?.nft.address.toLowerCase() },
    context: queryContext,
    pause: !ddo || !queryContext
  })
  const { data } = result

  //
  // 2. Construct display data based on fetched data.
  //
  const [receipts, setReceipts] = useState<ReceiptData[]>()

  useEffect(() => {
    if (!data || data.nftUpdates.length === 0) return
    const receiptCollection = data.nftUpdates
    setReceipts(receiptCollection)
  }, [data])

  return (
    <>
      <h3 className={styles.title}>Metadata History</h3>
      <ul className={styles.history}>
        {receipts?.map((receipt) => (
          <li key={receipt.id} className={styles.item}>
            <ExplorerLink networkId={ddo?.chainId} path={`/tx/${receipt.tx}`}>
              {getUpdateType(receipt.type)}{' '}
              <Time date={`${receipt.timestamp}`} relative isUnix />
            </ExplorerLink>
          </li>
        ))}
      </ul>
    </>
  )
}
