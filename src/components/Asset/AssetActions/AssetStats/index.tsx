import { useAsset } from '@context/Asset'
import PriceUnit from '@shared/Price/PriceUnit'
import React from 'react'
import styles from './index.module.css'

export default function AssetStats() {
  const { asset } = useAsset()
  const { orders, allocated } = asset.stats

  return (
    <footer className={styles.stats}>
      {allocated && allocated > 0 ? (
        <span className={styles.stat}>
          <span className={styles.number}>
            {' '}
            <PriceUnit price={allocated} symbol="veOCEAN" size="small" />
          </span>{' '}
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
