import { useAsset } from '@context/Asset'
import React from 'react'
import styles from './index.module.css'

export default function AssetStats() {
  const { asset } = useAsset()

  return (
    <footer className={styles.stats}>
      {!asset?.indexedMetadata.stats ||
      asset?.indexedMetadata.stats[0]?.orders < 0 ? (
        <span className={styles.stat}>N/A</span>
      ) : asset?.indexedMetadata?.stats[0]?.orders === 0 ? (
        <span className={styles.stat}>No sales yet</span>
      ) : (
        <span className={styles.stat}>
          <span className={styles.number}>
            {asset.indexedMetadata?.stats[0].orders}
          </span>{' '}
          sale
          {asset?.indexedMetadata?.stats[0]?.orders === 1 ? '' : 's'}
        </span>
      )}
    </footer>
  )
}
