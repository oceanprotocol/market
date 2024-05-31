import { useAsset } from '@context/Asset'
import React from 'react'
import styles from './index.module.css'

export default function AssetStats() {
  const { asset } = useAsset()

  return (
    <footer className={styles.stats}>
      {!asset?.stats || asset?.stats?.orders < 0 ? (
        <span className={styles.stat}>N/A</span>
      ) : asset?.stats?.orders === 0 ? (
        <span className={styles.stat}>No sales yet</span>
      ) : (
        <span className={styles.stat}>
          <span className={styles.number}>{asset.stats.orders}</span> sale
          {asset.stats.orders === 1 ? '' : 's'}
        </span>
      )}
    </footer>
  )
}
