import React, { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'
import MarketStats from '../molecules/MarketStats'
import BuildId from '../atoms/BuildId'
import Button from '../atoms/Button'
import { useUserPreferences } from '../../providers/UserPreferences'
import { useGdprMetadata } from '../../hooks/useGdprMetadata'

export default function Footer(): ReactElement {
  const { copyright, appConfig } = useSiteMetadata()
  const { setShowPPC } = useUserPreferences()
  const cookies = useGdprMetadata()

  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        {/* <SyncStatus /> |  */}
        <BuildId />
        <MarketStats />
        <div className={styles.copyright}>
          © {year} <Markdown text={copyright} /> —{' '}
          <Link to="/terms">Terms</Link>
          {' — '}
          <a href="https://oceanprotocol.com/privacy">Privacy</a>
          {appConfig.privacyPreferenceCenter && (
            <>
              {' — '}
              <Button
                style="text"
                size="small"
                className="link"
                onClick={() => {
                  setShowPPC(true)
                }}
              >
                {cookies.optionalCookies ? 'Cookie Settings' : 'Cookies'}
              </Button>
            </>
          )}
        </div>
      </div>
    </footer>
  )
}
