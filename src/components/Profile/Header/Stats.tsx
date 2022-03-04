import { LoggerInstance } from '@oceanprotocol/lib'
import React, { useEffect, useState, ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import { getAccountTVLInOwnAssets, UserLiquidity } from '@utils/subgraph'
import Conversion from '@shared/Price/Conversion'
import NumberUnit from './NumberUnit'
import styles from './Stats.module.css'
import { useProfile } from '@context/Profile'
import { PoolShares_poolShares as PoolShare } from '../../../@types/subgraph/PoolShares'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { calculateUserTVL } from '@utils/pool'
import Decimal from 'decimal.js'
import { MAX_DECIMALS } from '@utils/constants'

async function getPoolSharesLiquidity(
  poolShares: PoolShare[]
): Promise<string> {
  let tvl = new Decimal(0)
  for (const poolShare of poolShares) {
    const poolUserTvl = calculateUserTVL(
      poolShare.shares,
      poolShare.pool.totalShares,
      poolShare.pool.baseTokenLiquidity
    )
    tvl = tvl.add(new Decimal(poolUserTvl))
  }

  return tvl.toDecimalPlaces(MAX_DECIMALS).toString()
}

export default function Stats({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { poolShares, assets, assetsTotal, sales } = useProfile()

  const [publisherTvl, setPublisherTvl] = useState('0')
  const [totalTvl, setTotalTvl] = useState('0')

  useEffect(() => {
    if (!accountId || chainIds.length === 0) {
      setPublisherTvl('0')
      setTotalTvl('0')
    }
  }, [accountId, chainIds])

  useEffect(() => {
    if (!assets || !accountId || !chainIds) return

    async function getPublisherLiquidity() {
      try {
        console.log('GET PUB LIQ', chainIds)

        const accountPoolAdresses: string[] = []
        const assetsPrices = await getAccessDetailsForAssets(assets)
        for (const priceInfo of assetsPrices) {
          if (priceInfo.accessDetails.type === 'dynamic') {
            accountPoolAdresses.push(
              priceInfo.accessDetails.addressOrId.toLowerCase()
            )
          }
        }
        const userTvl = await getAccountTVLInOwnAssets(
          accountId,
          chainIds,
          accountPoolAdresses
        )
        setPublisherTvl(userTvl)
      } catch (error) {
        LoggerInstance.error(error.message)
      }
    }
    getPublisherLiquidity()
  }, [assets, accountId, chainIds])

  useEffect(() => {
    if (!poolShares) return

    async function getTotalLiquidity() {
      try {
        const totalTvl = await getPoolSharesLiquidity(poolShares)
        setTotalTvl(totalTvl)
      } catch (error) {
        LoggerInstance.error('Error fetching pool shares: ', error.message)
      }
    }
    getTotalLiquidity()
  }, [poolShares])

  return (
    <div className={styles.stats}>
      <NumberUnit
        label="TVL in Own Assets"
        value={<Conversion price={publisherTvl} hideApproximateSymbol />}
      />
      <NumberUnit
        label="TVL"
        value={<Conversion price={totalTvl} hideApproximateSymbol />}
      />
      <NumberUnit label={`Sale${sales === 1 ? '' : 's'}`} value={sales} />
      <NumberUnit label="Published" value={assetsTotal} />
    </div>
  )
}
