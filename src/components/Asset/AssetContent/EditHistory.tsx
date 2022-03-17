import React, { ReactElement, useEffect, useState } from 'react'
import { useAsset } from '@context/Asset'
import ExplorerLink from '@shared/ExplorerLink'
import Time from '@shared/atoms/Time'
import { gql, OperationContext, useQuery } from 'urql'
import { NftUpdate_nftUpdates as NftUpdate } from '../../../@types/subgraph/NftUpdate'
import { getQueryContext } from '@utils/subgraph'
import styles from './EditHistory.module.css'

const getReceipts = gql`
  query NftUpdate($address: String!) {
    nftUpdates(
      where: { nft: $address }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      nft {
        address
        owner
      }
      tx
      timestamp
      type
    }
  }
`

export default function EditHistory({
  receipts,
  setReceipts
}: {
  receipts: NftUpdate[]
  setReceipts: (receipts: NftUpdate[]) => void
}): ReactElement {
  const { asset } = useAsset()

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
    if (!asset) return

    const queryContext = getQueryContext(asset.chainId)
    setQueryContext(queryContext)
  }, [asset])

  const [result] = useQuery({
    query: getReceipts,
    variables: { address: asset?.nft.address.toLowerCase() },
    context: queryContext,
    pause: !asset || !queryContext
  })
  const { data } = result

  //
  // 2. Construct display data based on fetched data.
  //
  useEffect(() => {
    if (!data || data.nftUpdates.length === 0) return
    const receiptCollection = data.nftUpdates
    setReceipts(receiptCollection)
  }, [data, setReceipts])

  return (
    <>
      <h3 className={styles.title}>Metadata History</h3>
      <ul className={styles.history}>
        {receipts?.map((receipt) => (
          <li key={receipt.id} className={styles.item}>
            <ExplorerLink networkId={asset?.chainId} path={`/tx/${receipt.tx}`}>
              {getUpdateType(receipt.type)}{' '}
              <Time date={`${receipt.timestamp}`} relative isUnix />
            </ExplorerLink>
          </li>
        ))}
      </ul>
    </>
  )
}
