import { useAsset } from '@context/Asset'
import { useUserPreferences } from '@context/UserPreferences'
import { useWeb3 } from '@context/Web3'
import { formatPrice } from '@shared/Price/PriceUnit'
import { getNftOwnAllocation } from '@utils/veAllocation'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

export default function AssetStats() {
  const { locale } = useUserPreferences()
  const { asset } = useAsset()
  const [orders, setOrders] = useState(0)
  const [allocated, setAllocated] = useState(0)
  const { accountId } = useWeb3()
  const [ownAllocation, setOwnAllocation] = useState(0)
  useEffect(() => {
    if (!asset) return

    const { orders, allocated } = asset.stats

    setOrders(orders)
    setAllocated(allocated)
  }, [asset])

  useEffect(() => {
    async function init() {
      const allocation = await getNftOwnAllocation(
        accountId,
        asset.nftAddress,
        asset.chainId
      )
      console.log('allocation', allocation)
      setOwnAllocation(allocation / 100)
    }
    init()
  }, [accountId, asset.chainId, asset.nftAddress])

  return (
    <footer className={styles.stats}>
      {allocated && allocated > 0 ? (
        <span className={styles.stat}>
          <span className={styles.number}>
            {formatPrice(allocated, locale)}
          </span>
          veOCEAN
        </span>
      ) : null}
      {!asset || !asset?.stats || orders < 0 ? (
        'N/A'
      ) : orders === 0 ? (
        'No sales yet'
      ) : (
        <span className={styles.stat}>
          <span className={styles.number}>{orders}</span> sale
          {orders === 1 ? '' : 's'}
        </span>
      )}
      {ownAllocation && ownAllocation > 0 ? (
        <span className={styles.stat}>
          <span className={styles.number}>{ownAllocation}</span>% allocation
        </span>
      ) : null}
    </footer>
  )
}
