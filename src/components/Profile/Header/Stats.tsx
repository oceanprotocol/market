import { LoggerInstance } from '@oceanprotocol/lib'
import React, { useEffect, useState, ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import Conversion from '@shared/Price/Conversion'
import NumberUnit from './NumberUnit'
import styles from './Stats.module.css'
import { useProfile } from '@context/Profile'

export default function Stats({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { assets, assetsTotal, sales } = useProfile()

  const [totalSales, setTotalSales] = useState(0)

  useEffect(() => {
    if (!assets || !accountId || !chainIds) return

    async function getPublisherTotalSales() {
      try {
        let count = 0
        for (const priceInfo of assets) {
          if (priceInfo?.stats?.price?.value && priceInfo.stats.orders > 0) {
            count += priceInfo.stats.price.value * priceInfo.stats.orders
          }
        }
        setTotalSales(count)
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    getPublisherTotalSales()
  }, [assets, accountId, chainIds])

  return (
    <div className={styles.stats}>
      <NumberUnit
        label="Total Sales"
        value={
          totalSales > 0 ? (
            <Conversion
              price={totalSales}
              symbol={'ocean'}
              hideApproximateSymbol
            />
          ) : (
            '0'
          )
        }
      />
      <NumberUnit
        label={`Sale${sales === 1 ? '' : 's'}`}
        value={sales < 0 ? 0 : sales}
      />
      <NumberUnit label="Published" value={assetsTotal} />
    </div>
  )
}
