import { useAsset } from '@context/Asset'
import React from 'react'
import styles from './index.module.css'

export default function AssetStats() {
  const { asset } = useAsset()

  // TODO: get this number for each asset
  const allocated = 5000000

  return (
    <footer className={styles.stats}>
      {allocated && allocated > 0 ? (
        <span className={styles.stat}>
          <span className={styles.number}>{allocated}</span> veOCEAN
        </span>
      ) : null}
      {!asset || !asset?.stats || asset?.stats?.orders < 0 ? (
        'N/A'
      ) : asset?.stats?.orders === 0 ? (
        'No sales yet'
      ) : (
        <span className={styles.stat}>
          <span className={styles.number}>{asset.stats.orders}</span> sale
          {asset.stats.orders === 1 ? '' : 's'}
        </span>
      )}
    </footer>
  )
}
