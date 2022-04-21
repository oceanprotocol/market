import { useUserPreferences } from '@context/UserPreferences'
import { useGdprMetadata } from '@hooks/useGdprMetadata'
import Button from '@shared/atoms/Button'
import Link from 'next/link'
import React, { Fragment } from 'react'
import content from '../../../content/footer.json'
import External from '@images/external.svg'
import styles from './Links.module.css'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function Links() {
  const { siteMetadata } = useMarketMetadata()
  const { setShowPPC, privacyPolicySlug } = useUserPreferences()
  const cookies = useGdprMetadata()

  return (
    <div className={styles.links}>
      {content.links.map(({ name, url }) => (
        <Fragment key={name}>
          <Button style="text" size="small" href={url} target="_blank">
            {name} <External />
          </Button>
          {' — '}
        </Fragment>
      ))}

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
      {siteMetadata?.appConfig.privacyPreferenceCenter === 'true' && (
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
  )
}
