import React, { ReactElement, useState } from 'react'
import { useConsent, CookieConsentStatus } from '@context/CookieConsent'
import styles from './PrivacyPreferenceCenter.module.css'
import { useGdprMetadata } from '@hooks/useGdprMetadata'
import Markdown from '@shared/Markdown'
import CookieModule from './CookieModule'
import Button from '@shared/atoms/Button'
import { useUserPreferences } from '@context/UserPreferences'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function CookieBanner({
  style
}: {
  style?: 'small' | 'default'
}): ReactElement {
  const { resetConsentStatus } = useConsent()
  const cookies = useGdprMetadata()
  const { showPPC, setShowPPC } = useUserPreferences()
  const [smallBanner, setSmallBanner] = useState<boolean>(style === 'small')

  function closeBanner() {
    setShowPPC(false)

    // Wait for CSS animations to finish
    setTimeout(() => {
      setSmallBanner(style === 'small')
    }, 300)
  }

  function handleAllCookies(accepted: boolean) {
    resetConsentStatus(
      accepted ? CookieConsentStatus.APPROVED : CookieConsentStatus.REJECTED
    )
    closeBanner()
  }

  const styleClasses = cx(styles.wrapper, {
    hidden: !showPPC,
    small: smallBanner // style === 'small'
  })

  return (
    <div className={styleClasses}>
      <div className={styles.banner}>
        <div className={styles.container}>
          <div className={styles.cookieInfo}>
            <Markdown text={cookies.title} className={styles.header} />
            <Markdown text={cookies.text} />
          </div>
          {cookies.optionalCookies && (
            <>
              <div className={styles.buttons}>
                <Button
                  size="small"
                  onClick={() => {
                    handleAllCookies(true)
                  }}
                >
                  {cookies.accept || 'Accept all'}
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    handleAllCookies(false)
                  }}
                >
                  {cookies.reject || 'Reject all'}
                </Button>
                <Button
                  className={styles.configureButton}
                  size="small"
                  onClick={() => {
                    setSmallBanner(false)
                  }}
                >
                  {cookies.configure || 'Customize'}
                </Button>
              </div>
              <div className={styles.optionals}>
                {cookies.optionalCookies.map((cookie) => {
                  return <CookieModule {...cookie} key={cookie.cookieName} />
                })}
              </div>
            </>
          )}
        </div>
        {(!smallBanner || !cookies.optionalCookies) && (
          <Button
            size="small"
            style="primary"
            onClick={() => {
              closeBanner()
            }}
            className={styles.closeButton}
          >
            {cookies.close || 'Save and close'}
          </Button>
        )}
      </div>
    </div>
  )
}
