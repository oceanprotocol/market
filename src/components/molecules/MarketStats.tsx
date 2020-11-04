import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import PriceUnit from '../atoms/Price/PriceUnit'
import axios from 'axios'
import styles from './MarketStats.module.css'
import { useInView } from 'react-intersection-observer'

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

export default function MarketStats(): ReactElement {
  const [ref, inView] = useInView()
  const [stats, setStats] = useState<MarketStatsResponse>()

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
        Logger.error(error.message)
      }
    }

    // Update every 10 sec. when in viewport
    const interval = setInterval(getStats, 10000)

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
      Total of <strong>{stats?.datasets.total}</strong> data sets & datatokens
      published by <strong>{stats?.owners}</strong> accounts.
      <br />
      <PriceUnit
        price={`${stats?.ocean}`}
        small
        className={styles.total}
        conversion
      />{' '}
      in <strong>{stats?.datasets.pools}</strong> data set pools.
      <br />
      <strong>{stats?.datasets.none}</strong> data sets have no price set yet.
    </div>
  )
}
