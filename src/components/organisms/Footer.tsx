import React, { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'
import MarketStats from '../molecules/MarketStats'
import BuildId from '../atoms/BuildId'
import { useUserPreferences } from '../../providers/UserPreferences'

export default function Footer(): ReactElement {
  const { copyright } = useSiteMetadata()
  const { privacyPolicySlug } = useUserPreferences()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        {/* <SyncStatus /> |  */}
        <BuildId />
        <MarketStats />
        <div className={styles.copyright}>
          © {year} <Markdown text={copyright} />
          {' - '}
          <Link to="/terms">Terms</Link>
          {' — '}
          <Link to={privacyPolicySlug}>Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
