import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import PriceUnit from '../atoms/Price/PriceUnit'
import axios from 'axios'
import styles from './MarketStats.module.css'
import { useInView } from 'react-intersection-observer'
import { EwaiClient, IEwaiStatsResult } from '../../ewai/client/ewai-js'

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

export default function MarketStats(): ReactElement {
  const [ref, inView] = useInView()
  const [stats, setStats] = useState<IEwaiStatsResult>()

  useEffect(() => {
    async function getStats() {
      try {
        const ewaiClient = new EwaiClient({
          username: process.env.EWAI_API_USERNAME,
          password: process.env.EWAI_API_PASSWORD,
          graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
        })
        const ewaiStats = await ewaiClient.ewaiStatsAsync()
        setStats(ewaiStats)
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
    }
  }, [inView])

  return (
    <div className={styles.stats} ref={ref}>
      There are <strong>{stats?.count}</strong> EWAI energy data sets published
      in this marketplace by <strong>{stats?.addresses}</strong> addresses.
    </div>
  )
}
