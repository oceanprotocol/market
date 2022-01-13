import React, { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '@shared/Markdown'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import Link from 'next/link'
import MarketStats from './MarketStats'
import BuildId from './BuildId'
import { useUserPreferences } from '@context/UserPreferences'
import Button from '@shared/atoms/Button'
import { useGdprMetadata } from '@hooks/useGdprMetadata'

export default function Footer(): ReactElement {
  const { copyright, appConfig } = useSiteMetadata()
  const { setShowPPC } = useUserPreferences()
  const { privacyPolicySlug } = useUserPreferences()

  const cookies = useGdprMetadata()

  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <BuildId />
        <MarketStats />
        <div className={styles.copyright}>
          © {year} <Markdown text={copyright} />
          <br />
          <Link href="/imprint">
            <a>Imprint</a>
          </Link>
          {' — '}
          <Link href="/terms">
            <a>Terms</a>
          </Link>
          {' — '}
          <Link href={privacyPolicySlug}>
            <a>Privacy</a>
          </Link>
          {appConfig.privacyPreferenceCenter === 'true' && (
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
