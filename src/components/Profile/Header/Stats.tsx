import { LoggerInstance } from '@oceanprotocol/lib'
import React, { useEffect, useState, ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import Conversion from '@shared/Price/Conversion'
import NumberUnit from './NumberUnit'
import styles from './Stats.module.css'
import { useProfile } from '@context/Profile'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { getLocked } from '@utils/veAllocation'
import PriceUnit from '@shared/Price/PriceUnit'
import Tooltip from '@shared/atoms/Tooltip'

export default function Stats({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { assets, assetsTotal, sales } = useProfile()

  const [totalSales, setTotalSales] = useState(0)
  const [lockedOcean, setLockedOcean] = useState(0)

  useEffect(() => {
    async function getLockedOcean() {
      if (!accountId) return
      const locked = await getLocked(accountId, chainIds)
      setLockedOcean(locked)
    }
    getLockedOcean()
  }, [accountId, chainIds])
  useEffect(() => {
    if (!assets || !accountId || !chainIds) return

    async function getPublisherTotalSales() {
      try {
        const assetsPrices = await getAccessDetailsForAssets(assets)
        let count = 0
        for (const priceInfo of assetsPrices) {
          if (priceInfo?.accessDetails?.price && priceInfo.stats.orders > 0) {
            count +=
              parseInt(priceInfo.accessDetails.price) * priceInfo.stats.orders
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
      <NumberUnit
        label="Locked OCEAN"
        value={
          lockedOcean > 0 ? (
            <Conversion
              price={lockedOcean}
              symbol={'ocean'}
              hideApproximateSymbol
            />
          ) : (
            <>
              {'0'}
              <Tooltip content="LOCK OCEAN!!" />
            </>
          )
        }
      />
    </div>
  )
}
