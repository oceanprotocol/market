import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import axios from 'axios'
import styles from './MarketStats.module.css'
import { useInView } from 'react-intersection-observer'
import { gql, useQuery } from '@apollo/client'
import Conversion from '../atoms/Price/Conversion'
import PriceUnit from '../atoms/Price/PriceUnit'
import Price from '../organisms/AssetContent/Pricing/FormPricing/Price'

interface MarketStatsResponse {
  datasets: {
    pools: number
    exchanges: number
    none: number
    total: number
  }
  owners: number
  ocean: number
  datatoken: number
}

const refreshInterval = 60000 // 60 sec.

const getTotalPoolsValues = gql`
  query PoolsData {
    poolFactories {
      totalLockedValue
      totalOceanLiquidity
      poolCount
      finalizedPoolCount
    }
  }
`

export default function MarketStats(): ReactElement {
  const [ref, inView] = useInView()
  const [stats, setStats] = useState<MarketStatsResponse>()
  const [totalLockedValue, setTotalLockedValue] = useState<string>()
  const [totalOceanLiquidity, setTotalOceanLiquidity] = useState<string>()
  const { data } = useQuery(getTotalPoolsValues)

  useEffect(() => {
    if (!data) return
    setTotalLockedValue(data.poolFactories[0].totalLockedValue)
    setTotalOceanLiquidity(data.poolFactories[0].totalOceanLiquidity)
  }, [data])

  useEffect(() => {
    const source = axios.CancelToken.source()

    async function getStats() {
      try {
        const response = await axios('https://market-stats.oceanprotocol.com', {
          cancelToken: source.token
        })
        if (!response || response.status !== 200) return
        setStats(response.data)
      } catch (error) {
        if (axios.isCancel(error)) {
          Logger.log(error.message)
        } else {
          Logger.error(error.message)
        }
      }
    }

    // Update periodically when in viewport
    const interval = setInterval(getStats, refreshInterval)

    if (!inView) {
      clearInterval(interval)
    }

    getStats()

    return () => {
      clearInterval(interval)
      source.cancel()
    }
  }, [inView])

  return (
    <div className={styles.stats} ref={ref}>
      <Conversion price={`${totalLockedValue}`} hideApproximationSign />{' '}
      <abbr title="Total Value Locked">TVL</abbr> (total value locked) across{' '}
      <strong>{stats?.datasets.pools}</strong> data set pools that contain{' '}
      <PriceUnit price={totalOceanLiquidity} small className={styles.total} />{' '}
      and datatokens for each pool.
      <br />
      <strong>{stats?.datasets.none}</strong> data sets have no price set yet.
    </div>
  )
}
