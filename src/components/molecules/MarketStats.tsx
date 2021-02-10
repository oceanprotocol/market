import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import axios from 'axios'
import styles from './MarketStats.module.css'
import { useInView } from 'react-intersection-observer'
import { gql, useQuery } from '@apollo/client'
import Conversion from '../atoms/Price/Conversion'
import PriceUnit from '../atoms/Price/PriceUnit'

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
      totalLiquidity
      poolCount
      finalizedPoolCount
    }
  }
`

export default function MarketStats(): ReactElement {
  const [ref, inView] = useInView()
  const [stats, setStats] = useState<MarketStatsResponse>()
  const [totalValueLocked, setTotalValueLocked] = useState<string>()
  const [totalLiquidity, setTotalLiquidity] = useState<string>()
  const { data } = useQuery(getTotalPoolsValues)

  useEffect(() => {
    if (!data) return
    setTotalValueLocked(data.poolFactories[0].totalLockedValue)
    setTotalLiquidity(data.poolFactories[0].totalLiquidity)
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
      <Conversion price={`${totalValueLocked}`} hideApproximationSign />{' '}
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{stats?.datasets.pools}</strong> data set pools that contain{' '}
      <PriceUnit price={totalLiquidity} small className={styles.total} /> and
      and datatokens for each pool.
      <br />
    </div>
  )
}
