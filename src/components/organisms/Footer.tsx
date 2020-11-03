import React, { ReactElement, useEffect, useState } from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'
import axios from 'axios'
import PriceUnit from '../atoms/Price/PriceUnit'

interface MarketStatsResponse {
  datasets: number
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
      const response = await axios('https://market-stats.vercel.app')
      if (!response || response.status !== 200) return
      setStats(response.data)
    }
    getStats()
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.stats}>
          Pooled <PriceUnit price={`${stats?.ocean}`} conversion />
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
