import React, { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'
import MarketStats from '../molecules/MarketStats'
import BuildId from '../atoms/BuildId'
import SyncStatus from '../molecules/SyncStatus'

export default function Footer({
  setGraphSynched
}: {
  setGraphSynched: React.Dispatch<React.SetStateAction<boolean>>
}): ReactElement {
  const { copyright } = useSiteMetadata()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <BuildId />
        <MarketStats />

        <div className={styles.copyright}>
          © {year} <Markdown text={copyright} /> —{' '}
          <Link to="/terms">Terms</Link>
          {' — '}
          <a href="https://oceanprotocol.com/privacy">Privacy</a>
        </div>
      </div>
      <SyncStatus setGraphSynched={setGraphSynched} />
    </footer>
  )
}
