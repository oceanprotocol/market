import { useAsset } from '@context/Asset'
import { useUserPreferences } from '@context/UserPreferences'
import { useWeb3 } from '@context/Web3'
import Tooltip from '@shared/atoms/Tooltip'
import { formatNumber } from '@utils/numbers'
import { getNftOwnAllocation } from '@utils/veAllocation'
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'

export default function AssetStats() {
  const { locale } = useUserPreferences()
  const { asset } = useAsset()
  const { accountId } = useWeb3()

  const [ownAllocation, setOwnAllocation] = useState(0)

  useEffect(() => {
    if (!asset || !accountId) return

    async function init() {
      const allocation = await getNftOwnAllocation(
        accountId,
        asset.nftAddress,
        asset.chainId
      )
      setOwnAllocation(allocation / 100)
    }
    init()
  }, [accountId, asset])

  return (
    <footer className={styles.stats}>
      {asset?.stats?.allocated && asset?.stats?.allocated > 0 ? (
        <span className={styles.stat}>
          <span className={styles.number}>
            {formatNumber(asset.stats.allocated, locale, '0')}
          </span>{' '}
          veOCEAN
        </span>
      ) : null}
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
      {ownAllocation && ownAllocation > 0 ? (
        <span className={styles.stat}>
          <span className={styles.number}>{ownAllocation}</span>% allocated
          <Tooltip
            content={`You have ${ownAllocation}% of your total veOCEAN allocated to this asset.`}
          />
        </span>
      ) : null}
    </footer>
  )
}
