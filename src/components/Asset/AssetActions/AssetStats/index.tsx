import { useAsset } from '@context/Asset'
import React from 'react'
import styles from './index.module.css'

export default function AssetStats() {
  const { asset } = useAsset()

  return (
    <footer className={styles.stats}>
      {!asset || !asset?.stats || asset?.stats?.orders === 0 ? (
        'No sales yet'
      ) : (
        <>
          <span className={styles.number}>{asset.stats.orders}</span> sale
          {asset.stats.orders === 1 ? '' : 's'}
        </>
      )}
    </footer>
  )
}
