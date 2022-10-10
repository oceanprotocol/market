import { useAsset } from '@context/Asset'
import { useUserPreferences } from '@context/UserPreferences'
import { formatPrice } from '@shared/Price/PriceUnit'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

export default function AssetStats() {
  const { locale } = useUserPreferences()
  const { asset } = useAsset()
  const [orders, setOrders] = useState(0)
  const [allocated, setAllocated] = useState(0)

  useEffect(() => {
    if (!asset) return

    const { orders, allocated } = asset.stats

    setOrders(orders)
    setAllocated(allocated)
  }, [asset])

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
    </footer>
  )
}
