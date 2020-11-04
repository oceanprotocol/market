import React, { ReactElement, useEffect, useState } from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'
import axios from 'axios'
import PriceUnit from '../atoms/Price/PriceUnit'
import Conversion from '../atoms/Price/Conversion'
import { Logger } from '@oceanprotocol/lib'

interface MarketStatsResponse {
  datasets: {
    pools: number
    exchange: number
    none: number
    total: number
  }
  owners: number
  ocean: number
  datatoken: number
}

export default function Footer(): ReactElement {
  const { copyright } = useSiteMetadata()
  const year = new Date().getFullYear()

  const [stats, setStats] = useState<MarketStatsResponse>()

  useEffect(() => {
    async function getStats() {
      try {
        const response = await axios('https://market-stats.oceanprotocol.com')
        if (!response || response.status !== 200) return
        setStats(response.data)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    getStats()
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.stats}>
          Total of <strong>{stats?.datasets.total}</strong> data sets published
          by <strong>{stats?.owners}</strong> accounts.
          <br />
          <PriceUnit
            price={`${stats?.ocean}`}
            small
            className={styles.total}
            conversion
          />{' '}
          in <strong>{stats?.datasets.pools}</strong> data set pools.
          <br />
          <strong>{stats?.datasets.none}</strong> data sets have no price set
          yet.
        </div>
        <div>
          © {year} <Markdown text={copyright} /> —{' '}
          <Link to="/terms">Terms</Link>
          {' — '}
          <a href="https://oceanprotocol.com/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
